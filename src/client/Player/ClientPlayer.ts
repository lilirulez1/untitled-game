import {PlayerEntity} from "../../shared/Level/Entity/PlayerEntity";
import {ClientLevel} from "../Level/ClientLevel";
import {BigVector3} from "../../shared/Internal/BigVector3";
import {Profile} from "../../shared/Profile";

export abstract class ClientPlayer extends PlayerEntity {
	protected constructor(level: ClientLevel, profile: Profile) {
		super(level, profile, BigVector3.ZERO);
	}

	setPosition(position: BigVector3) {
		super.setPosition(position);
	}

	destroy() {
		super.destroy();
	}
}