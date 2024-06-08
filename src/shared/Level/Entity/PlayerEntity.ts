import {Entity} from "./Entity";

export abstract class PlayerEntity extends Entity {
	protected constructor(protected player: Player, protected position: Vector3) {
		super();
	}
}