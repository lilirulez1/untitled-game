import {Vehicle} from "./Vehicle";

class Suspension {
	constructor(private compressionDamping: number,
				private length: number,
				private relaxationDamping: number,
				private restLength: number,
				private stiffness: number,
				private maxSuspensionForce: number,
				private minSuspensionLength: number) {}
}

export class Wheel {
	// for visual wheel model
	private angularVelocity = 0;
	private rotationAngle = 0;
	//

	private brakeForce = 0;
	private friction = 0;
	private motorForce = 0;
	private offset = Vector3.zero;
	private radius = 0;
	private rollingFrictionForce = 0;
	private skidEnergy = 0;
	private steeringAngle = 0;
	private suspension = new Suspension(0, 0, 0, 0, 0, 0, 0);

	constructor(private vehicle: Vehicle) {}

	update(deltaTime: number) {

	}
}