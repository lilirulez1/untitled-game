import {Packet} from "./Packet";
import {ClientPacketListener} from "./ClientPacketListener";
import {ByteBuffer} from "../ByteBuffer";

export class ClientboundAddEntityPacket extends Packet<ClientPacketListener> {
	handle(listener: ClientPacketListener) {
	}

	write(byteBuffer: ByteBuffer) {
	}
}