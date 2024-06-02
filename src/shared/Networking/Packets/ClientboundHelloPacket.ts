import {Packet} from "./Packet";
import {ClientPacketListener} from "./ClientPacketListener";
import {ByteBuffer} from "../ByteBuffer";

export class ClientboundHelloPacket implements Packet<ClientPacketListener> {
	handle(listener: ClientPacketListener) {
		listener.handleHello(this);
	}

	write(byteBuffer: ByteBuffer) {
	}
}