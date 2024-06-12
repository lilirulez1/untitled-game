import {Entity} from "./Entity";
import {EntityType} from "./EntityType";
import {Profile} from "../../Profile";
import {BigVector3} from "../../Internal/BigVector3";
import {Level} from "../Level";

export abstract class PlayerEntity extends Entity {
	protected constructor(private readonly level: Level, position: BigVector3, profile: Profile) {
		super(EntityType.PLAYER);
		this.setUuid(tostring(profile.getId()));
		this.moveTo(position);
	}
}