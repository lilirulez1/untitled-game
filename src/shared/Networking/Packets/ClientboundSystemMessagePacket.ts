import {Packet} from "./Packet";
import {ClientPacketListener} from "./ClientPacketListener";
import {ByteBuffer} from "../ByteBuffer";

export class ClientboundSystemMessagePacket implements Packet<ClientPacketListener> {
	private readonly message: string;

	constructor(param1: string | ByteBuffer) {
		if (param1 instanceof ByteBuffer) {
			this.message = param1.readString();
		} else {
			this.message = param1;
		}
	}

	handle(listener: ClientPacketListener) {
		listener.handleSystemMessage(this);
	}

	write(byteBuffer: ByteBuffer) {
		byteBuffer.writeString(this.message);
	}

	getMessage() {
		return this.message;
	}
}