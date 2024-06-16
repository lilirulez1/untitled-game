import {Entity} from "../shared/Level/Entity/Entity";
import {BigVector3} from "../shared/Internal/BigVector3";

export class CameraController {
	private position = BigVector3.ZERO;
	private rotation = Vector3.zero;
	private entity!: Entity;
	private camera!: Camera;

	setup(camera: Camera, entity: Entity) {
		this.camera = camera;
		this.entity = entity;

		this.setRotation(new Vector3(math.rad(-90), 0, 0));
	}

	update() {
		if (this.entity) {
			this.setPosition(this.entity.getPosition().add(new BigVector3(0, 20, 0)));
		}
	}

	setRotation(rotation: Vector3) {
		this.rotation = rotation;
		this.camera.CFrame = new CFrame(this.position.toVector3()).mul(CFrame.Angles(rotation.X, rotation.Y, rotation.Z));
	}

	setPosition(position: BigVector3) {
		this.position = position;
		this.camera.CFrame = new CFrame(position.toVector3()).mul(CFrame.Angles(this.rotation.X, this.rotation.Y, this.rotation.Z));
	}
}