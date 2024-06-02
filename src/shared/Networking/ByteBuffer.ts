export class ByteBuffer {
	public buffer: buffer;
	private pointer = 0;
	private reader = 0;

	constructor(Buffer?: buffer) {
		this.buffer = Buffer ? Buffer : buffer.create(256);
	}

	readUnsignedInt(): number {
		const Result = buffer.readu32(this.buffer, this.reader);
		this.reader += 4;
		return Result;
	}

	writeUnsignedInt(Number: number): ByteBuffer {
		buffer.writeu32(this.buffer, this.pointer, Number);
		this.pointer += 4;
		return this;
	}

	readString() {
		const length = this.readUnsignedInt();
		let stringBuilder = "";

		for (let i = 0; i < length; i++) {
			stringBuilder += string.char(buffer.readu8(this.buffer, this.reader));
			this.reader += 2;
		}

		return stringBuilder;
	}

	writeString(inputString: string) {
		this.writeUnsignedInt(inputString.size());

		const bytes = inputString.byte(0, inputString.size());

		for (let i = 0; i < inputString.size(); i++) {
			buffer.writeu8(this.buffer, this.pointer, bytes[i]);
			this.pointer += 2;
		}

		return this;
	}
}