import {Entity} from "../Level/Entity/Entity";

export abstract class Vehicle {
	constructor(private entity: Entity) {
		entity.setSize(this.getSize());
	}

	abstract getSize(): Vector3;

	update(deltaTime: number) {
		const rigidBody = this.entity.getRigidBody();
		rigidBody.addVelocity(new Vector3(0, 0, deltaTime));

		rigidBody.update(deltaTime);
	}
}