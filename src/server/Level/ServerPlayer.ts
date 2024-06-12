import {ServerPacketListenerImpl} from "../Networking/ServerPacketListenerImpl";
import {ClientboundSystemMessagePacket} from "../../shared/Networking/Packets/ClientboundSystemMessagePacket";
import {PlayerEntity} from "../../shared/Level/Entity/PlayerEntity";
import {Profile} from "../../shared/Profile";
import {ServerLevel} from "./ServerLevel";
import {BigVector3} from "../../shared/Internal/BigVector3";

export class ServerPlayer extends PlayerEntity {
	packetListener!: ServerPacketListenerImpl;
	private disconnected = false;

	constructor(level: ServerLevel, private player: Player, profile: Profile) {
		super(level, BigVector3.ZERO, profile);
		this.fudgeSpawnLocation();
	}

	fudgeSpawnLocation() {
		this.moveTo(new BigVector3(math.random(-10, 10), 0, math.random(-10, 10)));
	}

	getPlayer() {
		return this.player;
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