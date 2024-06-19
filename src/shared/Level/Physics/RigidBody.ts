import {OrientedBoundingBox} from "./OrientedBoundingBox";
import {BigVector3} from "../../Internal/BigVector3";
import {ByteBuffer} from "../../Networking/ByteBuffer";

export class RigidBody extends OrientedBoundingBox {
	private worldVelocity = Vector3.zero;
	private localVelocity = Vector3.zero;
	private angularVelocity = Vector3.zero;
	private mass = 0;
	private inertia = 0;
	private drag = 0;
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
		this.localVelocity = this.localVelocity.add(velocity);
		this.worldVelocity = this.orientation.VectorToWorldSpace(this.localVelocity);
	}

	getVelocity() {
		return this.localVelocity;
	}

	addVelocityWorld(velocity: Vector3) {
		this.worldVelocity = this.worldVelocity.add(velocity);
		this.localVelocity = this.orientation.VectorToObjectSpace(this.worldVelocity);
	}

	getWorldVelocity() {
		return this.worldVelocity;
	}

	addAngularVelocity(velocity: Vector3) {
		this.angularVelocity = this.angularVelocity.add(velocity);
	}

	getAngularVelocity() {
		return this.angularVelocity;
	}

	setMass(mass: number) {
		this.mass = mass;
	}

	getWeight() {
		return this.mass * 9.8 * 0.5;
	}

	setCentreOfGravity(centreOfGravity: Vector3) {
		this.centreOfGravity = centreOfGravity;
	}

	update(deltaTime: number) {
		this.position = this.position.add(this.worldVelocity.mul(deltaTime));

		const angularVelocity = this.angularVelocity.mul(deltaTime);
		this.orientation = this.orientation.mul(CFrame.Angles(angularVelocity.X, angularVelocity.Y, angularVelocity.Z));
	}

	write(byteBuffer: ByteBuffer) {
		this.position.write(byteBuffer);
		byteBuffer.writeVector3(this.size);
		byteBuffer.writeCFrame(this.orientation);
		byteBuffer.writeVector3(this.localVelocity);
		byteBuffer.writeVector3(this.worldVelocity);
		byteBuffer.writeUnsignedInt(this.mass);
		byteBuffer.writeVector3(this.centreOfGravity);
	}

	private recreate(byteBuffer: ByteBuffer) {
		this.localVelocity = byteBuffer.readVector3();
		this.worldVelocity = byteBuffer.readVector3();
		this.mass = byteBuffer.readUnsignedInt();
		this.centreOfGravity = byteBuffer.readVector3();
	}
}