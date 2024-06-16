import {CameraController} from "./CameraController";
import {Entity} from "../shared/Level/Entity/Entity";

export class GameRenderer {
	private mainCamera = new CameraController();

	setup(camera: Camera, entity: Entity) {
		this.mainCamera.setup(camera, entity);
	}

	update() {
		this.mainCamera.update();
	}
}