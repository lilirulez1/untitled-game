import {ByteBuffer} from "./Networking/ByteBuffer";

export class Profile {
	constructor(private player: Player) {
	}

	write(byteBuffer: ByteBuffer) {
		byteBuffer.writeString(this.player.Name);
		byteBuffer.writeString(this.player.DisplayName);
		byteBuffer.writeUnsignedInt(this.player.UserId);
	}

	getId() {
		return this.player.UserId;
	}
}