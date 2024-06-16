import {BiConsumer} from "../Internal/BiConsumer";
import {Function} from "../Internal/Function";

export class ByteBuffer {
	public buffer: buffer;
	private pointer = 0;
	private reader = 0;

	constructor(Buffer?: buffer) {
		this.buffer = Buffer ? Buffer : buffer.create(256);
	}

	readUnsignedInt(): number {
		const result = buffer.readu32(this.buffer, this.reader);
		this.reader += 4;
		return result;
	}

	writeUnsignedInt(number: number): ByteBuffer {
		buffer.writeu32(this.buffer, this.pointer, number);
		this.pointer += 4;
		return this;
	}

	readDouble() {
		const result = buffer.readf64(this.buffer, this.reader);
		this.reader += 8;
		return result;
	}

	writeDouble(double: number) {
		buffer.writef64(this.buffer, this.pointer, double);
		this.pointer += 8;
		return this;
	}

	readFloat() {
		const result = buffer.readf32(this.buffer, this.reader);
		this.reader += 4;
		return result;
	}

	writeFloat(float: number) {
		buffer.writef32(this.buffer, this.pointer, float);
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

	readArray<T extends defined>(callback: Function<ByteBuffer, T>) {
		const arraySize = this.readUnsignedInt();
		const array = new Array<T>();

		for (let i = 0; i < arraySize; i++) {
			array.push(callback(this));
		}

		return array;
	}

	writeArray<T extends defined>(array: Array<T>, callback: BiConsumer<ByteBuffer, T>) {
		this.writeUnsignedInt(array.size());

		array.forEach(value => {
			callback(this, value);
		})

		return this;
	}

	readVector3() {
		return new Vector3(this.readFloat(), this.readFloat(), this.readFloat());
	}

	writeVector3(vector3: Vector3) {
		this.writeFloat(vector3.X);
		this.writeFloat(vector3.Y);
		this.writeFloat(vector3.Z);

		return this;
	}
}