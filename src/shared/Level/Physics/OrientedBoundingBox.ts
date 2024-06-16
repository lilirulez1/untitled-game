import {BoundingBox} from "./BoundingBox";
import {BigVector3} from "../../Internal/BigVector3";
import {Exception} from "../../Internal/Exception";

export class OrientedBoundingBox extends BoundingBox {
	constructor(position: BigVector3, size: Vector3, private orientation: CFrame) {
		super(position, size);
	}

	intersects(boundingBox: BoundingBox): boolean {
		if (boundingBox instanceof OrientedBoundingBox) {
			return this.intersectsOrientedBoundingBox(boundingBox);
		}

		throw new Exception("Tried to test intersection with a non Oriented BoundingBox");
	}

	debug(adornment: WireframeHandleAdornment) {
		const halfSize = this.size.mul(0.5);
		const vertices = [
			new Vector3(-halfSize.X, -halfSize.Y, -halfSize.Z),
			new Vector3(halfSize.X, -halfSize.Y, -halfSize.Z),
			new Vector3(halfSize.X, -halfSize.Y, halfSize.Z),
			new Vector3(-halfSize.X, -halfSize.Y, halfSize.Z),
			new Vector3(-halfSize.X, halfSize.Y, -halfSize.Z),
			new Vector3(halfSize.X, halfSize.Y, -halfSize.Z),
			new Vector3(halfSize.X, halfSize.Y, halfSize.Z),
			new Vector3(-halfSize.X, halfSize.Y, halfSize.Z)
		];

		for (let i = 0; i < vertices.size(); i++) {
			vertices[i] = this.orientation.mul(vertices[i]).add(this.position.toVector3());
		}

		const edges = [
			[0, 1], [1, 2], [2, 3], [3, 0],
			[4, 5], [5, 6], [6, 7], [7, 4],
			[0, 4], [1, 5], [2, 6], [3, 7]
		];

		for (const edge of edges) {
			const vertex1 = vertices[edge[0]];
			const vertex2 = vertices[edge[1]];
			adornment.AddLine(vertex1, vertex2);
		}
	}

	private intersectsOrientedBoundingBox(boundingBox: OrientedBoundingBox) {
		const relativePosition = this.orientation.Inverse().mul(boundingBox.position.minus(this.position).toVector3());
		const relativeOrientation = this.orientation.Inverse().mul(boundingBox.orientation);

		const thisExtents = this.size.div(2);
		const otherExtents = boundingBox.size.div(2);

		const directionVectors: Record<string, Vector3> = {
			"X": new Vector3(1, 0, 0),
			"Y": new Vector3(0, 1, 0),
			"Z": new Vector3(0, 0, 1)
		};

		for (const axis of ["X", "Y", "Z"]) {
			const axisVector = directionVectors[axis];

			const thisAxis = this.orientation.mul(axisVector);
			const otherAxis = boundingBox.orientation.mul(axisVector);

			const thisProjection = thisExtents.X * math.abs(thisAxis.Dot(relativeOrientation.mul(otherAxis)));
			const otherProjection = otherExtents.X * math.abs(otherAxis.Dot(relativeOrientation.mul(thisAxis)));

			if (math.abs(relativePosition.Dot(thisAxis)) > thisProjection + otherProjection) {
				return false;
			}
		}

		return true;
	}
}