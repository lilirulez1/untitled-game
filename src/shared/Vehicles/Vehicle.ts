// https://github.com/spacejack/carphysics2d
// https://github.com/tredfern/CarPhysicsDemo
// ^^ https://gx.games/games/7eykvg/car-physics-demo/
// https://www.asawicki.info/Mirror/Car%20Physics%20for%20Games/Car%20Physics%20for%20Games.html
// https://digitalrune.github.io/DigitalRune-Documentation/html/143af493-329d-408f-975d-e63625646f2f.htm
// https://github.com/DigitalRune/DigitalRune/tree/master/Source/DigitalRune.Physics.Specialized/Vehicles

import {Entity} from "../Level/Entity/Entity";
import {RigidBody} from "../Level/Physics/RigidBody";

export abstract class Vehicle {
	private rigidBody: RigidBody;

	constructor(private entity: Entity) {
		this.rigidBody = entity.getRigidBody();
		this.rigidBody.setSize(new Vector3(2, 2, 4));
		this.rigidBody.setMass(800);
		this.rigidBody.setCentreOfGravity(new Vector3(0, 0, 0));
	}
}