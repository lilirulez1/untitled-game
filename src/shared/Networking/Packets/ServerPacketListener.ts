import {PacketListener} from "../PacketListener";
import {ServerboundHelloPacket} from "./ServerboundHelloPacket";

export interface ServerPacketListener extends PacketListener {
	handleHello(packet: ServerboundHelloPacket): void;
}