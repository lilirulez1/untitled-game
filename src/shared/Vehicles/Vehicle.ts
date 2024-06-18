// https://github.com/spacejack/carphysics2d
// https://www.asawicki.info/Mirror/Car%20Physics%20for%20Games/Car%20Physics%20for%20Games.html

import {Entity} from "../Level/Entity/Entity";
import {RigidBody} from "../Level/Physics/RigidBody";

export interface VehicleOptions {
	mass: number;

	wheelbase: number;
	size: Vector3;

	wheelLength: number;
	wheelWidth: number;

	centreOfMassHeight: number;
	rearAxleDistance: number;
	frontAxleDistance: number;

	maxGrip: number;
	resistance: number;
}

export abstract class Vehicle {
	private rigidBody: RigidBody;
	private steering = 0;
	private throttle = 0;
	private brake = 0;

	private resistance = Vector3.zero;
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

		this.rigidBody.update(deltaTime);
	}
}