import {PlayerEntity} from "../../shared/Level/Entity/PlayerEntity";
import {ClientLevel} from "../Level/ClientLevel";
import {BigVector3} from "../../shared/Internal/BigVector3";
import {Profile} from "../../shared/Profile";
import {EntityDimensions} from "../../shared/Level/Entity/EntityDimensions";

export abstract class ClientPlayer extends PlayerEntity {
	protected constructor(level: ClientLevel, profile: Profile) {
		super(level, BigVector3.ZERO, profile);
		this.updateDimensions(new EntityDimensions(2.2, 1.77, 4.47));
	}

	setPosition(position: BigVector3) {
		super.setPosition(position);
	}

	destroy() {
		super.destroy();
	}
}