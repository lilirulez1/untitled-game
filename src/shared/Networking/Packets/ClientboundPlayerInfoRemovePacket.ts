import {Packet} from "./Packet";
import {ClientPacketListener} from "./ClientPacketListener";
import {ByteBuffer} from "../ByteBuffer";

export class ClientboundPlayerInfoRemovePacket implements Packet<ClientPacketListener> {
	private readonly profileIds: Array<string>;

	constructor(param1: ByteBuffer | Array<string>) {
		if (param1 instanceof ByteBuffer) {
			this.profileIds = param1.readArray((byteBuffer) => {
				return byteBuffer.readString();
			});
		} else {
			this.profileIds = param1;
		}
	}

	handle(listener: ClientPacketListener) {
		listener.handlePlayerInfoRemove(this);
	}

	write(byteBuffer: ByteBuffer) {
		byteBuffer.writeArray(this.profileIds, (byteBuffer, profileId) => {
			byteBuffer.writeString(profileId);
		});
	}

	getProfileIds() {
		return this.profileIds;
	}
}