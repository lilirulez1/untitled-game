// https://github.com/spacejack/carphysics2d
// https://github.com/tredfern/CarPhysicsDemo
// ^^ https://gx.games/games/7eykvg/car-physics-demo/
// https://www.asawicki.info/Mirror/Car%20Physics%20for%20Games/Car%20Physics%20for%20Games.html
// https://digitalrune.github.io/DigitalRune-Documentation/html/143af493-329d-408f-975d-e63625646f2f.htm
// https://github.com/DigitalRune/DigitalRune/tree/master/Source/DigitalRune.Physics.Specialized/Vehicles

import {Entity} from "../Level/Entity/Entity";
import {RigidBody} from "../Level/Physics/RigidBody";
import {Wheel} from "./Wheel";

export abstract class Vehicle {
	private rigidBody: RigidBody;
	private wheels = new Array<Wheel>();

	private throttle = 0;
	private brake = 0;

	constructor(private entity: Entity) {
		this.rigidBody = entity.getRigidBody();
		this.rigidBody.setSize(new Vector3(2, 2, 4));
		this.rigidBody.setMass(800);
		this.rigidBody.setCentreOfGravity(new Vector3(0, -.5, 0));
	}

	setThrottle(throttle: number) {
		this.throttle = throttle;
	}

	setBrake(brake: number) {
		this.brake = brake;
	}

	update(deltaTime: number) {
		const velocity=  this.rigidBody.getVelocity();

		const f_Traction = new Vector3(
			0,
			0,
			4000 * (this.throttle - this.brake * math.sign(velocity.Z))
		);

		// 0.5 * dragCoefficient * frontalArea * airDensity
		const c_Drag = 0.5 * 0.3 * 2.2 * 1.29;
		const f_Drag = velocity.mul(-c_Drag).mul(velocity.Magnitude);

		const f_RollingResistance = velocity.mul(30 * -c_Drag);

		const f_LongitudinalForce = f_Traction.add(f_Drag).add(f_RollingResistance);

		const acceleration = f_LongitudinalForce.div(this.rigidBody.getMass());

		this.rigidBody.addVelocity(acceleration.mul(deltaTime));

		this.rigidBody.update(deltaTime);
	}
}