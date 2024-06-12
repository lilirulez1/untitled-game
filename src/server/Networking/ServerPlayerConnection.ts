import {ServerPlayer} from "../Level/ServerPlayer";
import {Packet} from "../../shared/Networking/Packets/Packet";

export interface ServerPlayerConnection {
	getPlayer(): ServerPlayer;

	send(packet: Packet<any>): void;
}