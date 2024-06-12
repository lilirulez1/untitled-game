import {ClientPacketListener} from "./ClientPacketListener";
import {Packet} from "./Packet";
import {ByteBuffer} from "../ByteBuffer";

export class ClientboundRemoveEntitiesPacket implements Packet<ClientPacketListener> {
	private readonly entityIds: Array<number>;

	constructor(param1: ByteBuffer | Array<number>) {
		if (param1 instanceof ByteBuffer) {
			this.entityIds = param1.readArray((byteBuffer) => {
				return byteBuffer.readUnsignedInt();
			})
		} else {
			this.entityIds = param1;
		}
	}

	handle(listener: ClientPacketListener) {
		listener.handleRemoveEntities(this);
	}

	write(byteBuffer: ByteBuffer) {
		byteBuffer.writeArray(this.entityIds, (byteBuffer, entityId) => {
			byteBuffer.writeUnsignedInt(entityId);
		})
	}

	getEntityIds() {
		return this.entityIds;
	}
}