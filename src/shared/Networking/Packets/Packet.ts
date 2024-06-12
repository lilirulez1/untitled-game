import {PacketListener} from "../PacketListener";
import {ByteBuffer} from "../ByteBuffer";

export interface Packet<T extends PacketListener> {
	handle(listener: T): void;

	write(byteBuffer: ByteBuffer): void;
}
