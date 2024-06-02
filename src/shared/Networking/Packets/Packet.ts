import {PacketListener} from "../PacketListener";
import {ByteBuffer} from "../ByteBuffer";

export abstract class Packet<T extends PacketListener> {
	abstract handle(listener: T): void;

	abstract write(byteBuffer: ByteBuffer): void;
}
