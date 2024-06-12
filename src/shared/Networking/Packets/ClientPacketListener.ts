import {PacketListener} from "../PacketListener";
import {ClientboundHelloPacket} from "./ClientboundHelloPacket";
import {ClientboundDisconnectPacket} from "./ClientboundDisconnectPacket";
import {ClientboundSystemMessagePacket} from "./ClientboundSystemMessagePacket";
import {ClientboundAddEntityPacket} from "./ClientboundAddEntityPacket";
import {ClientboundPlayerInfoUpdatePacket} from "./ClientboundPlayerInfoUpdatePacket";
import {ClientboundPlayerPositionPacket} from "./ClientboundPlayerPositionPacket";
import {ClientboundPlayerInfoRemovePacket} from "./ClientboundPlayerInfoRemovePacket";
import {ClientboundRemoveEntitiesPacket} from "./ClientboundRemoveEntitiesPacket";

export interface ClientPacketListener extends PacketListener {
	handleHello(packet: ClientboundHelloPacket): void;

	handleAddEntity(packet: ClientboundAddEntityPacket): void;

	handleRemoveEntities(packet: ClientboundRemoveEntitiesPacket): void;

	handlePlayerInfoUpdate(packet: ClientboundPlayerInfoUpdatePacket): void;

	handlePlayerInfoRemove(packet: ClientboundPlayerInfoRemovePacket): void;

	handleMovePlayer(packet: ClientboundPlayerPositionPacket): void;

	handleSystemMessage(packet: ClientboundSystemMessagePacket): void;

	handleDisconnect(packet: ClientboundDisconnectPacket): void;
}