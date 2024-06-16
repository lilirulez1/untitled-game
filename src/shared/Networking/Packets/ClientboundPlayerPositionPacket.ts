import {Packet} from "./Packet";
import {ClientPacketListener} from "./ClientPacketListener";
import {ByteBuffer} from "../ByteBuffer";
import {BigVector3} from "../../Internal/BigVector3";

export class ClientboundPlayerPositionPacket implements Packet<ClientPacketListener> {
	private readonly position: BigVector3;
	private readonly rotation: Vector3;

	constructor(param1: ByteBuffer | BigVector3, rotation: Vector3) {
		if (param1 instanceof ByteBuffer) {
			this.position = new BigVector3(param1);
			this.rotation = param1.readVector3();
		} else {
			this.position = param1;
			this.rotation = rotation;
		}
	}

	handle(listener: ClientPacketListener) {
		listener.handleMovePlayer(this);
	}

	write(byteBuffer: ByteBuffer) {
		this.position.write(byteBuffer);
		byteBuffer.writeVector3(this.rotation);
	}

	getPosition() {
		return this.position;
	}

	getRotation() {
		return this.rotation;
	}
}