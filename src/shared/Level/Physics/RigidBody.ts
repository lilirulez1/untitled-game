import {OrientedBoundingBox} from "./OrientedBoundingBox";
import {BigVector3} from "../../Internal/BigVector3";
import {ByteBuffer} from "../../Networking/ByteBuffer";

export class RigidBody extends OrientedBoundingBox {
	private velocity = Vector3.zero;
	private mass = 0;
	private centreOfGravity = Vector3.zero;

	constructor(byteBuffer: ByteBuffer);

	constructor(position: BigVector3, size: Vector3, orientation: CFrame);

	constructor(param1: BigVector3 | ByteBuffer, size?: Vector3, orientation?: CFrame) {
		if (param1 instanceof ByteBuffer) {
			super(new BigVector3(param1), param1.readVector3(), param1.readCFrame());
			this.recreate(param1);
		} else {
			super(param1, <Vector3>size, <CFrame>orientation);
		}
	}

	addVelocity(velocity: Vector3) {
		this.velocity = this.velocity.add(velocity);
	}

	update(deltaTime: number) {
		this.position = this.position.add(this.velocity.mul(deltaTime));
	}

	write(byteBuffer: ByteBuffer) {
		this.position.write(byteBuffer);
		byteBuffer.writeVector3(this.size);
		byteBuffer.writeCFrame(this.orientation);
		byteBuffer.writeVector3(this.velocity);
		byteBuffer.writeUnsignedInt(this.mass);
		byteBuffer.writeVector3(this.centreOfGravity);
	}

	private recreate(byteBuffer: ByteBuffer) {
		this.velocity = byteBuffer.readVector3();
		this.mass = byteBuffer.readUnsignedInt();
		this.centreOfGravity = byteBuffer.readVector3();
	}
}