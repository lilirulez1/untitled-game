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

	 brakeForce = 0;
	 motorForce = 0;
	 offset = Vector3.zero;
	 radius = 0;
	 mass = 0;
	 rollingFrictionForce = 0;
	 skidEnergy = 0;
	 steeringAngle = 0;
	 suspension = new Suspension(0, 0, 0, 0, 0, 0, 0);

	constructor(private vehicle: Vehicle) {}

	update(deltaTime: number) {

	}

	getInertia()  {
		return this.mass * this.radius^2 / 2;
	}
}