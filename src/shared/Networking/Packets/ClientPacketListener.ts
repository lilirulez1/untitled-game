import {PacketListener} from "../PacketListener";
import {ClientboundHelloPacket} from "./ClientboundHelloPacket";
import {ClientboundDisconnectPacket} from "./ClientboundDisconnectPacket";
import {ClientboundSystemMessagePacket} from "./ClientboundSystemMessagePacket";

export interface ClientPacketListener extends PacketListener {
	handleHello(packet: ClientboundHelloPacket): void;

	handleSystemMessage(packet: ClientboundSystemMessagePacket): void;

	handleDisconnect(packet: ClientboundDisconnectPacket): void;
}