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

	add(vector3: Vector3): BigVector3;
	add(vector3: BigVector3): BigVector3;
	add(vector3: BigVector3 | Vector3) {
		if (vector3 instanceof BigVector3) {
			return new BigVector3(this.x + vector3.x, this.y + vector3.y, this.z + vector3.z);
		} else {
			return new BigVector3(this.x + vector3.X, this.y + vector3.Y, this.z + vector3.Z);
		}
	}

	minus(vector3: BigVector3) {
		return new BigVector3(this.x - vector3.x, this.y - vector3.y, this.z - vector3.z);
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