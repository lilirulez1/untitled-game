import {Packet} from "./Packet";
import {ClientPacketListener} from "./ClientPacketListener";
import {ByteBuffer} from "../ByteBuffer";
import {EntityType} from "../../Level/Entity/EntityType";
import {Entity} from "../../Level/Entity/Entity";
import {RigidBody} from "../../Level/Physics/RigidBody";

export class ClientboundAddEntityPacket implements Packet<ClientPacketListener> {
	private readonly id: number;
	private readonly uuid: string;
	private readonly entityType: EntityType;
	private readonly rigidBody: RigidBody;

	constructor(param1: ByteBuffer | Entity, rigidBody: RigidBody) {
		if (param1 instanceof ByteBuffer) {
			this.id = param1.readUnsignedInt();
			this.entityType = param1.readUnsignedInt();
			this.uuid = param1.readString();
			this.rigidBody = new RigidBody(param1);
		} else {
			this.id = param1.getId();
			this.entityType = param1.getType();
			this.uuid = param1.getUuid();
			this.rigidBody = rigidBody;
		}
	}

	handle(listener: ClientPacketListener) {
		listener.handleAddEntity(this);
	}

	write(byteBuffer: ByteBuffer) {
		byteBuffer.writeUnsignedInt(this.id);
		byteBuffer.writeUnsignedInt(this.entityType);
		byteBuffer.writeString(this.uuid);
		this.rigidBody.write(byteBuffer);
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

	getRigidBody() {
		return this.rigidBody;
	}
}