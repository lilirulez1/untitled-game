import {BigVector3} from "../../Internal/BigVector3";

export abstract class BoundingBox {
	protected constructor(protected position: BigVector3, protected size: Vector3) {
	}

	abstract intersects(boundingBox: BoundingBox): boolean;

	abstract debug(adornment: WireframeHandleAdornment): void;
}