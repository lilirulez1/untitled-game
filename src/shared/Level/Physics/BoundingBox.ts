import {BigVector3} from "../../Internal/BigVector3";

export abstract class BoundingBox {
	protected constructor(protected position: BigVector3, protected size: Vector3) {
	}

	setPosition(position: BigVector3) {
		this.position = position;
	}

	getPosition() {
		return this.position;
	}

	setSize(size: Vector3) {
		this.size = size;
	}

	getSize() {
		return this.size;
	}

	abstract intersects(boundingBox: BoundingBox): boolean;

	abstract debug(adornment: WireframeHandleAdornment): void;
}