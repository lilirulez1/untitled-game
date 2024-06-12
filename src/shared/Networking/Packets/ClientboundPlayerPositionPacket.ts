import {Packet} from "./Packet";
import {ClientPacketListener} from "./ClientPacketListener";
import {ByteBuffer} from "../ByteBuffer";
import {BigVector3} from "../../Internal/BigVector3";

export class ClientboundPlayerPositionPacket implements Packet<ClientPacketListener> {
	private readonly position: BigVector3;

	constructor(param1: ByteBuffer | BigVector3) {
		if (param1 instanceof ByteBuffer) {
			this.position = new BigVector3(param1);
		} else {
			this.position = param1;
		}
	}

	handle(listener: ClientPacketListener) {
		listener.handleMovePlayer(this);
	}

	write(byteBuffer: ByteBuffer) {
		this.position.write(byteBuffer);
	}

	getPosition() {
		return this.position;
	}
}