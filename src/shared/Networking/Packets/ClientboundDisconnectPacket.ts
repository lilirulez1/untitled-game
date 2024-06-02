import {ClientPacketListener} from "./ClientPacketListener";
import {Packet} from "./Packet";
import {ByteBuffer} from "../ByteBuffer";

export class ClientboundDisconnectPacket implements Packet<ClientPacketListener> {
	private readonly reason: string;

	constructor(value: string | ByteBuffer) {
		if (value instanceof ByteBuffer) {
			this.reason = value.readString();
		} else {
			this.reason = value;
		}
	}

	handle(listener: ClientPacketListener) {
		listener.handleDisconnect(this);
	}

	write(byteBuffer: ByteBuffer) {
		byteBuffer.writeString(this.reason);
	}

	getReason() {
		return this.reason;
	}
}