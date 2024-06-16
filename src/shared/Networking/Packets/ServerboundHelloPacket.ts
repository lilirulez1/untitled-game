import {Packet} from "./Packet";
import {ByteBuffer} from "../ByteBuffer";
import {ServerPacketListener} from "./ServerPacketListener";

export class ServerboundHelloPacket implements Packet<ServerPacketListener> {
	handle(listener: ServerPacketListener) {
		listener.handleHello(this);
	}

	write(byteBuffer: ByteBuffer) {
	}
}