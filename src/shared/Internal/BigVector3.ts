import {ByteBuffer} from "../Networking/ByteBuffer";
import {Exception} from "./Exception";

export class BigVector3 {
	static readonly ZERO = new BigVector3(0, 0, 0);

	x: number;
	y: number;
	z: number;

	constructor(x: number, y: number, z: number);
	constructor(byteBuffer: ByteBuffer);
	constructor(param1: ByteBuffer | number, y?: number, z?: number) {
		if (param1 instanceof ByteBuffer) {
			this.x = param1.readDouble();
			this.y = param1.readDouble();
			this.z = param1.readDouble();
		} else {
			if (y === undefined || z === undefined) {
				throw new Exception("Missing components X and Y when creating BigVector3");
			}

			this.x = param1;
			this.y = y;
			this.z = z;
		}
	}

	write(byteBuffer: ByteBuffer) {
		byteBuffer.writeDouble(this.x);
		byteBuffer.writeDouble(this.y);
		byteBuffer.writeDouble(this.z);
	}

	toVector3() {
		return new Vector3(this.x, this.y, this.z);
	}

	toString() {
		return tostring(this.toVector3());
	}
}