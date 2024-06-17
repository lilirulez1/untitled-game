import {ClientboundAddEntityPacket} from "../../Networking/Packets/ClientboundAddEntityPacket";
import {EntityType} from "./EntityType";
import {HttpService} from "@rbxts/services";
import {RigidBody} from "../Physics/RigidBody";
import {BigVector3} from "../../Internal/BigVector3";

export abstract class Entity {
	private static ENTITY_COUNTER = 0;
	private static INITIAL_RIGID_BODY = new RigidBody(BigVector3.ZERO, Vector3.zero, CFrame.Angles(0, 0, 0));

	private id: number;
	private uuid: string;

	private rigidBody = Entity.INITIAL_RIGID_BODY;

	protected constructor(private readonly entityType: EntityType) {
		this.id = Entity.ENTITY_COUNTER++;
		this.uuid = HttpService.GenerateGUID(false);
	}

	update() {
	}

	recreateFromPacket(packet: ClientboundAddEntityPacket) {
		this.id = packet.getId();
		this.uuid = packet.getUuid();
		this.rigidBody = packet.getRigidBody();
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

	setRigidBody(rigidBody: RigidBody) {
		this.rigidBody = rigidBody;
	}

	getRigidBody() {
		return this.rigidBody;
	}

	setPosition(position: BigVector3) {
		this.rigidBody.setPosition(position);
	}

	getPosition() {
		return this.rigidBody.getPosition();
	}

	setOrientation(orientation: CFrame) {
		this.rigidBody.setOrientation(orientation);
	}

	getOrientation() {
		return this.rigidBody.getOrientation();
	}

	setSize(size: Vector3) {
		this.rigidBody.setSize(size);
	}

	getSize() {
		return this.rigidBody.getSize();
	}

	getAddEntityPacket() {
		return new ClientboundAddEntityPacket(this, this.rigidBody);
	}

	destroy() {

	}
}