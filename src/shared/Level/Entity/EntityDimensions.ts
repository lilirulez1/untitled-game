import {BigVector3} from "../../Internal/BigVector3";
import {OrientedBoundingBox} from "../Physics/OrientedBoundingBox";

export class EntityDimensions {
	readonly height: number;
	readonly width: number;
	readonly depth: number;

	constructor(width: number, height: number, depth: number) {
		this.height = height;
		this.width = width;
		this.depth = depth;
	}

	makeBoundingBox(position: BigVector3, rotation: Vector3) {
		return new OrientedBoundingBox(
			position,
			new Vector3(this.width, this.height, this.depth),
			CFrame.Angles(rotation.X, rotation.Y, rotation.Z)
		);
	}
}
