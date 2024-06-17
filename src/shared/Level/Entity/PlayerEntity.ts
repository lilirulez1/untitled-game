import {Entity} from "./Entity";
import {EntityType} from "./EntityType";
import {Profile} from "../../Profile";
import {BigVector3} from "../../Internal/BigVector3";
import {Level} from "../Level";
import {Vehicle} from "../../Vehicles/Vehicle";

export abstract class PlayerEntity extends Entity {
	private vehicle!: Vehicle;

	protected constructor(private readonly level: Level, profile: Profile, position: BigVector3) {
		super(EntityType.PLAYER);
		this.setUuid(tostring(profile.getId()));
		this.setPosition(position);
	}

	setVehicle(vehicle: Vehicle) {
		this.vehicle = vehicle;
	}

	getVehicle() {
		return this.vehicle;
	}
}