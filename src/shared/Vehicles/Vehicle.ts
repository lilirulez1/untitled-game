// https://www.asawicki.info/Mirror/Car%20Physics%20for%20Games/Car%20Physics%20for%20Games.html

import {BigVector3} from "../Internal/BigVector3";
import {LookupTable} from "../Internal/LookupTable";

export interface GearRatios {
	1: number;
	2: number;
	3: number;
	4: number;
	5: number;
	reverse: number;
	differentialRatio: number;
}

export interface Options {
	mass: number;
	dimensions: {
		frontalArea: number;
		frictionCoefficient: number;
		wheelbase: number;
		frontAxle: number;
		rearAxle: number;
		centreOfGravityHeight: number;
	},
	wheels: {
		rollingResistance: number;
		tireFrictionCoefficient: number;
		wheelRadius: number;
	},
	engine: {
		gearRatios: GearRatios,
		torqueTable: LookupTable,
		transmissionEfficiency: number;
	}
}

export abstract class Vehicle {
	protected abstract options: Options;

	protected direction = Vector3.zAxis;
	protected position = BigVector3.ZERO;
	protected velocity = Vector3.zero;
	protected torque = 0;
	protected rpm = 2200;
	private wheelRotationRate = 0;
	private throttle = 0;
	private braking = 0;
	private gear = 1;

	update(deltaTime: number) {
		let traction = this.getTraction();

		if (this.braking > 0) {
			let braking = this.direction.Unit.mul(-1).mul(this.braking);

			if (this.getSpeed() < deltaTime * (this.braking / this.options.mass)) {
				this.velocity = Vector3.zero;
				braking = Vector3.zero;
			}

			traction = braking;
		}

		const drag = this.getDrag();
		const rollingResistance = this.getRollingResistance();
		const longitudinalForce = this.getLongitudinalForce(traction, drag, rollingResistance);

		const acceleration = longitudinalForce.div(this.options.mass);

		this.velocity = this.velocity.add(acceleration.mul(deltaTime));
		this.position = this.position.add(this.velocity.mul(deltaTime));

		return this.position;
	}

	setThrottle(throttle: number) {
		this.throttle = throttle;
	}

	setBrake(brake: number) {
		this.braking = brake;
	}

	protected getDragConstant() {
		return 0.5 * this.options.dimensions.frictionCoefficient * this.options.dimensions.frontalArea * 1.29;
	}

	private getSpeed() {
		return this.velocity.Magnitude;
	}

	private getBraking() {
		if (this.getSpeed() > 0) {
			return this.direction.mul(this.braking).mul(-1);
		} else {
			return Vector3.zero;
		}
	}

	private getTraction(): Vector3 {
		return this.direction.mul(this.getEngineForce());
	}

	private getDrag() {
		return this.velocity.mul(-this.getDragConstant() * this.getSpeed());
	}

	private getRollingResistance() {
		return this.velocity.mul(-this.options.wheels.rollingResistance);
	}

	private getLongitudinalForce(traction: Vector3, drag: Vector3, rollingResistance: Vector3) {
		return traction.add(drag).add(rollingResistance);
	}

	private setVelocity(velocity: Vector3) {
		this.velocity = velocity;
	}

	private getVelocity() {
		return this.velocity;
	}

	private getWeightMoving(acceleration: Vector3) {
		const stationaryWeight = this.getWeightStationary();
		const weightFront = stationaryWeight[0] - (this.options.dimensions.centreOfGravityHeight / this.options.dimensions.wheelbase) * this.options.mass * acceleration.Z;
		const weightBack = stationaryWeight[1] - (this.options.dimensions.centreOfGravityHeight / this.options.dimensions.wheelbase) * this.options.mass * acceleration.Z;
		return [weightFront, weightBack];
	}

	private getWeightStationary() {
		const weight = this.options.mass * 9.81;
		const weightFront = (this.options.dimensions.rearAxle / this.options.dimensions.wheelbase) * weight;
		const weightBack = (this.options.dimensions.frontAxle / this.options.dimensions.wheelbase) * weight;
		return [weightFront, weightBack];
	}

	private getMaxTraction(acceleration: Vector3) {
		const [weightFront, weightBack] = this.getWeightMoving(acceleration);
		const frontMax = this.options.wheels.tireFrictionCoefficient * weightFront;
		const backMax = this.options.wheels.tireFrictionCoefficient * weightBack;
		return [frontMax, backMax];
	}

	private getDriveForce() {
		return this.getDriveTorque().div(this.options.wheels.wheelRadius);
	}

	private getDriveTorque() {
		return this.direction
			.mul(this.options.engine.torqueTable.find(this.rpm)! * 1.356 * this.throttle)
			.mul(this.options.engine.gearRatios[this.gear as keyof GearRatios])
			.mul(this.options.engine.gearRatios.differentialRatio)
			.mul(this.options.engine.transmissionEfficiency);
	}

	private getHorsepower() {
		return this.torque * this.rpm / 5252;
	}
}