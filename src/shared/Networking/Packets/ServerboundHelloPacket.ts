import {Packet} from "./Packet";
import {ClientPacketListener} from "./ClientPacketListener";
import {ByteBuffer} from "../ByteBuffer";
import {ServerPacketListener} from "./ServerPacketListener";

export class ServerboundHelloPacket implements Packet<ServerPacketListener> {
	handle(listener: ClientPacketListener) {
		listener.handleHello(this);
	}

	write(byteBuffer: ByteBuffer) {
	}
}