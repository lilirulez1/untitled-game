import {Packet} from "./Packet";
import {ClientPacketListener} from "./ClientPacketListener";
import {ByteBuffer} from "../ByteBuffer";
import {EntityType} from "../../Level/Entity/EntityType";
import {BigVector3} from "../../Internal/BigVector3";

export class ClientboundAddEntityPacket implements Packet<ClientPacketListener> {
	private readonly id: number;
	private readonly uuid: string;
	private readonly entityType: EntityType;
	private readonly position: BigVector3;

	constructor(param1: ByteBuffer | number, entityType: EntityType, uuid: string, position: BigVector3) {
		if (param1 instanceof ByteBuffer) {
			this.id = param1.readUnsignedInt();
			this.entityType = param1.readUnsignedInt();
			this.uuid = param1.readString();
			this.position = new BigVector3(param1);
		} else {
			this.id = param1;
			this.entityType = entityType;
			this.uuid = uuid;
			this.position = position;
		}
	}

	handle(listener: ClientPacketListener) {
		listener.handleAddEntity(this);
	}

	write(byteBuffer: ByteBuffer) {
		byteBuffer.writeUnsignedInt(this.id);
		byteBuffer.writeUnsignedInt(this.entityType);
		byteBuffer.writeString(this.uuid);
		this.position.write(byteBuffer);
	}

	getId() {
		return this.id;
	}

	getType() {
		return this.entityType;
	}

	getUuid() {
		return this.uuid;
	}

	getPosition() {
		return this.position;
	}
}