import {Packet} from "./Packet";
import {ClientPacketListener} from "./ClientPacketListener";
import {ByteBuffer} from "../ByteBuffer";

export class ClientboundHelloPacket implements Packet<ClientPacketListener> {
	private readonly playerId: number;

	constructor(param1: ByteBuffer | number) {
		if (param1 instanceof ByteBuffer) {
			this.playerId = param1.readUnsignedInt();
		} else {
			this.playerId = param1;
		}
	}

	handle(listener: ClientPacketListener) {
		listener.handleHello(this);
	}

	write(byteBuffer: ByteBuffer) {
		byteBuffer.writeUnsignedInt(this.playerId);
	}

	getPlayerId() {
		return this.playerId;
	}
}