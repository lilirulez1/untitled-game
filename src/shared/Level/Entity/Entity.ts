import {ClientboundAddEntityPacket} from "../../Networking/Packets/ClientboundAddEntityPacket";
import {EntityType} from "./EntityType";
import {HttpService} from "@rbxts/services";
import {BigVector3} from "../../Internal/BigVector3";
import {LevelCallback} from "../LevelCallback";

export abstract class Entity {
	private static ENTITY_COUNTER = 0;

	private position = BigVector3.ZERO;
	private oldPosition = BigVector3.ZERO;
	private id: number;
	private uuid: string;
	private levelCallback?: LevelCallback;

	protected constructor(private readonly entityType: EntityType) {
		this.id = Entity.ENTITY_COUNTER++;
		this.uuid = HttpService.GenerateGUID(false);
		this.setPosition(new BigVector3(0, 0, 0));
	}

	update() {}

	recreateFromPacket(packet: ClientboundAddEntityPacket) {
		this.id = packet.getId();
		this.uuid = packet.getUuid();
		this.moveTo(packet.getPosition());
	}

	getId() {
		return this.id;
	}

	setUuid(uuid: string) {
		this.uuid = uuid;
	}

	getUuid() {
		return this.uuid;
	}

	getType() {
		return this.entityType;
	}

	moveTo(position: BigVector3) {
		this.setPosition(position);
		this.setOldPosition();
	}

	setOldPosition() {
		this.oldPosition = this.position;
	}

	setPosition(position: BigVector3) {
		if (this.position !== position) {
			this.position = position;
			print(`Set position to ${position} [${tostring(getmetatable(this))}]`);
		}
	}

	getPosition() {
		return this.position;
	}

	getAddEntityPacket() {
		return new ClientboundAddEntityPacket(this.getId(), this.getType(), this.getUuid(), this.getPosition());
	}

	destroy() {

	}
}