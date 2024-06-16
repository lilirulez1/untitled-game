import {ClientboundAddEntityPacket} from "../../Networking/Packets/ClientboundAddEntityPacket";
import {EntityType} from "./EntityType";
import {HttpService} from "@rbxts/services";
import {BigVector3} from "../../Internal/BigVector3";
import {BoundingBox} from "../Physics/BoundingBox";
import {EntityDimensions} from "./EntityDimensions";
import {OrientedBoundingBox} from "../Physics/OrientedBoundingBox";

export abstract class Entity {
	private static ENTITY_COUNTER = 0;
	private static INITIAL_BOUNDING_BOX = new OrientedBoundingBox(BigVector3.ZERO, Vector3.zero, CFrame.Angles(0, 0, 0));

	private position = BigVector3.ZERO;
	private oldPosition = BigVector3.ZERO;
	private rotation = Vector3.zero;
	private dimensions: EntityDimensions;

	private id: number;
	private uuid: string;

	private boundingBox: BoundingBox = Entity.INITIAL_BOUNDING_BOX;

	protected constructor(private readonly entityType: EntityType) {
		this.id = Entity.ENTITY_COUNTER++;
		this.uuid = HttpService.GenerateGUID(false);
		this.dimensions = new EntityDimensions(1, 1, 1);
		this.setPosition(new BigVector3(0, 0, 0));
	}

	update() {
	}

	recreateFromPacket(packet: ClientboundAddEntityPacket) {
		this.moveTo(packet.getPosition());
		this.setRotation(packet.getRotation());
		this.id = packet.getId();
		this.uuid = packet.getUuid();
	}

	setId(id: number) {
		this.id = id;
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

	getOldPosition() {
		return this.oldPosition;
	}

	setPosition(position: BigVector3) {
		if (this.position !== position) {
			this.position = position;
		}
		this.setBoundingBox(this.makeBoundingBox());
	}

	getPosition() {
		return this.position;
	}

	setRotation(rotation: Vector3) {
		this.rotation = rotation;
		this.setBoundingBox(this.makeBoundingBox());
	}

	getRotation() {
		return this.rotation;
	}

	getAddEntityPacket() {
		return new ClientboundAddEntityPacket(this.getId(), this.getType(), this.getUuid(), this.getPosition(), this.getRotation());
	}

	makeBoundingBox() {
		return this.dimensions.makeBoundingBox(this.position, this.rotation);
	}

	setBoundingBox(boundingBox: BoundingBox) {
		this.boundingBox = boundingBox;
	}

	getBoundingBox() {
		return this.boundingBox;
	}

	updateDimensions(dimensions: EntityDimensions) {
		this.dimensions = dimensions;
		this.setPosition(this.position);
	}

	destroy() {

	}
}