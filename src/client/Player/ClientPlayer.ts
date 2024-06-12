import {PlayerEntity} from "../../shared/Level/Entity/PlayerEntity";
import {Workspace} from "@rbxts/services";
import {ClientLevel} from "../Level/ClientLevel";
import {BigVector3} from "../../shared/Internal/BigVector3";
import {Profile} from "../../shared/Profile";

function createPart(position: Vector3, color: Color3) {
	const part = new Instance("Part");
	part.Position = position;
	part.Size = Vector3.one;
	part.Color = color;
	part.Parent = Workspace;

	return part;
}

export abstract class ClientPlayer extends PlayerEntity {
	private readonly part: Part;

	protected constructor(level: ClientLevel, profile: Profile, color: Color3) {
		super(level, BigVector3.ZERO, profile);
		this.part = createPart(this.getPosition().toVector3(), color);
	}

	setPosition(position: BigVector3) {
		super.setPosition(position);
		if (this.part) {
			this.part.Position = position.toVector3();
		}
	}

	destroy() {
		super.destroy();
		this.part.Destroy();
	}
}