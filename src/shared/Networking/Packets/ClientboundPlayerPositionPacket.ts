import {Packet} from "./Packet";
import {ClientPacketListener} from "./ClientPacketListener";
import {ByteBuffer} from "../ByteBuffer";
import {BigVector3} from "../../Internal/BigVector3";

export class ClientboundPlayerPositionPacket implements Packet<ClientPacketListener> {
	private readonly position: BigVector3;
	private readonly orientation: CFrame;

	constructor(param1: ByteBuffer | BigVector3, orientation: CFrame) {
		if (param1 instanceof ByteBuffer) {
			this.position = new BigVector3(param1);
			this.orientation = param1.readCFrame();
		} else {
			this.position = param1;
			this.orientation = orientation;
		}
	}

	handle(listener: ClientPacketListener) {
		listener.handlePlayerPosition(this);
	}

	write(byteBuffer: ByteBuffer) {
		this.position.write(byteBuffer);
		byteBuffer.writeCFrame(this.orientation);
	}

	getPosition() {
		return this.position;
	}

	getOrientation() {
		return this.orientation;
	}
}