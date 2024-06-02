import {PacketListener} from "./PacketListener";

export interface UpdatablePacketListener extends PacketListener {
	update(): void;
}