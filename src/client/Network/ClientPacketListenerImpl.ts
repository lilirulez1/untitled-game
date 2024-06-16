import {ClientPacketListener} from "../../shared/Networking/Packets/ClientPacketListener";
import {ClientboundHelloPacket} from "../../shared/Networking/Packets/ClientboundHelloPacket";
import {Connection} from "../../shared/Networking/Connection";
import {Client} from "../Client";
import {ClientboundDisconnectPacket} from "../../shared/Networking/Packets/ClientboundDisconnectPacket";
import {LocalPlayer} from "../Player/LocalPlayer";
import {ClientboundSystemMessagePacket} from "../../shared/Networking/Packets/ClientboundSystemMessagePacket";
import {ClientboundAddEntityPacket} from "../../shared/Networking/Packets/ClientboundAddEntityPacket";
import {EntityType} from "../../shared/Level/Entity/EntityType";
import {ClientLevel} from "../Level/ClientLevel";
import {RemotePlayer} from "../Player/RemotePlayer";
import {Profile} from "../../shared/Profile";
import {PlayerInfo} from "../Player/PlayerInfo";
import {ClientboundPlayerInfoUpdatePacket} from "../../shared/Networking/Packets/ClientboundPlayerInfoUpdatePacket";
import {ClientboundPlayerPositionPacket} from "../../shared/Networking/Packets/ClientboundPlayerPositionPacket";
import {ClientboundPlayerInfoRemovePacket} from "../../shared/Networking/Packets/ClientboundPlayerInfoRemovePacket";
import {ClientboundRemoveEntitiesPacket} from "../../shared/Networking/Packets/ClientboundRemoveEntitiesPacket";
import {Workspace} from "@rbxts/services";

export class ClientPacketListenerImpl implements ClientPacketListener {
	private playerInfoMap = new Map<string, PlayerInfo>();
	private closed = false;
	private level!: ClientLevel;
	private profile!: Profile;

	constructor(private readonly client: Client, private readonly connection: Connection) {}

	close() {
		this.closed = true;
	}

	onDisconnect(reason: string) {
		this.client.disconnect();
		warn(`Client disconnected with reason: ${reason}`);
	}

	isAcceptingMessages(): boolean {
		return this.connection.isConnected() && !this.closed;
	}

	handleHello(packet: ClientboundHelloPacket) {
		this.profile = new Profile(this.connection.connectedPlayer());
		this.level = new ClientLevel(this.client);
		this.client.setLevel(this.level);
		this.client.player = new LocalPlayer(this.client, this.level, this);
		this.client.player.resetPosition();
		this.client.player.setId(packet.getPlayerId());
		this.level.addEntity(this.client.player);
		this.client.getGameRenderer().setup(Workspace.CurrentCamera!, this.client.player);
	}

	handleAddEntity(packet: ClientboundAddEntityPacket) {
		const entity = this.createEntityFromPacket(packet);
		if (entity) {
			entity.recreateFromPacket(packet);
			this.level.addEntity(entity);
		} else {
			warn(`Skipping entity with id ${packet.getId()} of type ${packet.getType()}`);
		}
	}

	createEntityFromPacket(packet: ClientboundAddEntityPacket) {
		const entityType = packet.getType();
		if (entityType === EntityType.PLAYER) {
			const playerInfo = this.playerInfoMap.get(packet.getUuid());
			if (playerInfo === undefined) {
				warn(`Attempt to add player prior to sending player info (Player id ${0})`);
				return undefined;
			} else {
				return new RemotePlayer(this.level, playerInfo.getProfile());
			}
		}
	}

	handleRemoveEntities(packet: ClientboundRemoveEntitiesPacket) {
		packet.getEntityIds().forEach(entityId => {
			this.level.removeEntity(entityId);
		})
	}

	handlePlayerInfoUpdate(packet: ClientboundPlayerInfoUpdatePacket) {
		packet.getNewEntries().forEach(entry => {
			const playerInfo = new PlayerInfo(entry.getProfile());
			this.playerInfoMap.set(entry.getUuid(), playerInfo);
		})
	}

	handlePlayerInfoRemove(packet: ClientboundPlayerInfoRemovePacket) {
		packet.getProfileIds().forEach(profileId => {
			if (this.playerInfoMap.has(profileId)) {
				this.playerInfoMap.delete(profileId);
			}
		});
	}

	handleMovePlayer(packet: ClientboundPlayerPositionPacket) {
		this.client.player.setPosition(packet.getPosition());
		this.client.player.setRotation(packet.getRotation());
	}

	handleSystemMessage(packet: ClientboundSystemMessagePacket) {
		print(`[SYSTEM] ${packet.getMessage()}`);
	}

	handleDisconnect(packet: ClientboundDisconnectPacket) {
		this.connection.disconnect(packet.getReason());
	}

	getProfile() {
		return this.profile;
	}
}