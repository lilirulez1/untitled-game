import {ServerPlayer} from "../Level/ServerPlayer";
import {Connection} from "../../shared/Networking/Connection";
import {ClientboundHelloPacket} from "../../shared/Networking/Packets/ClientboundHelloPacket";
import {Function} from "../../shared/Internal/Function";
import {Server} from "../Server";
import {Profile} from "../../shared/Profile";
import {ClientboundPlayerInfoUpdatePacket} from "../../shared/Networking/Packets/ClientboundPlayerInfoUpdatePacket";
import {Packet} from "../../shared/Networking/Packets/Packet";
import {ClientboundPlayerInfoRemovePacket} from "../../shared/Networking/Packets/ClientboundPlayerInfoRemovePacket";

export class PlayerList {
	private players = new Set<ServerPlayer>();

	constructor(private server: Server) {}

	broadcastAll(packet: Packet<any>) {
		this.players.forEach(player => {
			player.packetListener.send(packet);
		});
	}

	broadcastSystemMessage(message: string, mutator?: Function<ServerPlayer, string>) {
		this.players.forEach(player => {
			const mutatedMessage = mutator ? mutator(player) : message;
			if (mutatedMessage) {
				player.sendSystemMessage(mutatedMessage);
			}
		});
	}

	getPlayer(player: Player, profile: Profile) {
		return new ServerPlayer(this.server.getServerLevel(), player, profile);
	}

	addPlayer(connection: Connection, player: ServerPlayer) {
		connection.send(new ClientboundHelloPacket());

		print(`${player.getName()} logged in with entity id ${player.getId()} at ${player.getPosition().toVector3()}`);

		player.packetListener.teleport(player.getPosition());

		player.packetListener.send(ClientboundPlayerInfoUpdatePacket.createPlayerInitializing(this.players));
		this.players.add(player);
		this.broadcastAll(ClientboundPlayerInfoUpdatePacket.createPlayerInitializing(new Set<ServerPlayer>().add(player)));
		this.server.getServerLevel().addEntity(player);

		this.broadcastSystemMessage(`${player.getDisplayName()} joined the game`);
		this.server.getTelemetry().playerJoined(player.getName());
	}

	removePlayer(player: ServerPlayer) {
		this.players.delete(player);
		this.server.getServerLevel().removeEntity(player);

		this.broadcastAll(new ClientboundPlayerInfoRemovePacket([player.getUuid()]));

		this.server.getTelemetry().playerLeft(player.getName());
	}
}