import {ServerPacketListenerImpl} from "./ServerPacketListenerImpl";
import {ClientboundSystemMessagePacket} from "../../shared/Networking/Packets/ClientboundSystemMessagePacket";
import {PlayerEntity} from "../../shared/Level/Entity/PlayerEntity";

export class ServerPlayer extends PlayerEntity {
	packetListener!: ServerPacketListenerImpl;
	private disconnected = false;

	constructor(player: Player) {
		super(player, Vector3.zero);
	}

	getName() {
		return this.player.Name;
	}

	getDisplayName() {
		return this.player.DisplayName;
	}

	sendSystemMessage(message: string) {
		this.packetListener.send(new ClientboundSystemMessagePacket(message));
	}

	kick(reason: string) {
		this.player.Kick(reason);
	}

	disconnect() {
		this.disconnected = true;
	}
}