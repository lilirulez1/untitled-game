import {PlayerEntity} from "./Player";

export abstract class AbstractPlayer extends PlayerEntity {
	protected movementDelta = Vector3.zero;

	protected constructor(player: Player) {
		super(player, Vector3.zero);
	}
}