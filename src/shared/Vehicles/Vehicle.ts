// https://github.com/spacejack/carphysics2d
// https://github.com/tredfern/CarPhysicsDemo
// ^^ https://gx.games/games/7eykvg/car-physics-demo/
// https://www.asawicki.info/Mirror/Car%20Physics%20for%20Games/Car%20Physics%20for%20Games.html

import {Entity} from "../Level/Entity/Entity";
import {RigidBody} from "../Level/Physics/RigidBody";

export interface VehicleOptions {
	mass: number;
	inertia: number;

	wheelbase: number;
	size: Vector3;

	wheelLength: number;
	wheelWidth: number;

	centreOfMassHeight: number;
	rearAxleDistance: number;
	frontAxleDistance: number;
}

export abstract class Vehicle {
	private rigidBody: RigidBody;
	private steering = 0;
	private throttle = 0;
	private brake = 0;

	private torque = 0;
	private acceleration = Vector3.zero;

	constructor(private entity: Entity) {
		this.rigidBody = entity.getRigidBody();

		const vehicleOptions = this.getVehicleOptions();
		this.rigidBody.setSize(vehicleOptions.size);
		this.rigidBody.setMass(vehicleOptions.mass);
	}

	abstract getVehicleOptions(): VehicleOptions;

	setThrottle(throttle: number) {
		this.throttle = throttle;
	}

	setBrake(brake: number) {
		this.brake = brake;
	}

	setSteering(steering: number) {
		this.steering = steering;
	}

	update(deltaTime: number) {
		const velocity = this.rigidBody.getVelocity();

		const yawSpeed = this.rigidBody.getAngularVelocity().Y * this.getVehicleOptions().wheelbase * 0.5;

		let rotationAngle = 0;
		let sideSlip = 0;
		if (velocity.Z !== 0) {
			rotationAngle = math.atan2(yawSpeed, velocity.Z);
			sideSlip = math.atan2(velocity.X, velocity.Z);
		}

		const slipAngleFront = sideSlip + rotationAngle - -this.steering;
		const slipAngleRear = sideSlip - rotationAngle;

		const f_LateralFront = new Vector3(
			math.max(math.min(-5 * slipAngleFront, 2), -2) * this.rigidBody.getWeight(),
			0,
			0
		);
		const f_LateralRear = new Vector3(
			math.max(math.min(-5 * slipAngleRear, 2), -2) * this.rigidBody.getWeight(),
			0,
			0
		);

		const f_Traction = new Vector3(
			0,
			0,
			4000 * (this.throttle - this.brake * math.sign(velocity.Z))
		);

		const f_Resistance = new Vector3(
			-(30 * velocity.X + 5 * velocity.X * math.abs(velocity.X)),
			0,
			-(30 * velocity.Z + 5 * velocity.Z * math.abs(velocity.Z))
		);

		const force = new Vector3(
			f_Traction.X + math.cos(this.steering) * f_LateralFront.X + f_LateralRear.X + f_Resistance.X,
			0,
			f_Traction.Z + math.sin(this.steering) * f_LateralFront.Z + f_LateralRear.Z + f_Resistance.Z
		);

		const torque = this.getVehicleOptions().frontAxleDistance * f_LateralFront.X -
			this.getVehicleOptions().rearAxleDistance * f_LateralRear.X;

		this.acceleration = force.div(this.getVehicleOptions().mass);

		const angularAcceleration = torque / this.getVehicleOptions().inertia;

		this.rigidBody.addVelocity(this.acceleration.mul(deltaTime));
		this.rigidBody.addAngularVelocity(new Vector3(0, angularAcceleration, 0).mul(deltaTime));

		this.rigidBody.update(deltaTime);
	}
}