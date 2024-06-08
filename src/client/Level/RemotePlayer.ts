import {PlayerEntity} from "../../shared/Level/Entity/PlayerEntity";

export class RemotePlayer extends PlayerEntity {
	constructor(player: Player, position: Vector3) {
		super(player, position);
	}
}