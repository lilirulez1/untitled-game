import {Level} from "../../shared/Level/Level";
import {Entity} from "../../shared/Level/Entity/Entity";
import {Client} from "../Client";
import {DebugRenderer} from "./DebugRenderer";
import {LocalPlayer} from "../Player/LocalPlayer";

export class ClientLevel extends Level {
	private readonly debugRenderer = new DebugRenderer();

	private readonly entities = new Map<number, Entity>();

	constructor(private readonly client: Client) {
		super();
	}

	updateEntities() {
		this.debugRenderer.clear();

		this.entities.forEach(entity => {
			entity.update();

			if (this.client.options.debug) {
				if (entity instanceof LocalPlayer) {
					entity.getBoundingBox().debug(this.debugRenderer.getColor(new Color3(0, 1, 0)));
					return;
				}

				entity.getBoundingBox().debug(this.debugRenderer.getColor(new Color3(1, 0, 0)));
			}
		});

	}

	addEntity(entity: Entity) {
		print(`Added entity with UUID ${entity.getUuid()} and entity id ${entity.getId()} of type ${tostring(getmetatable(entity))} to level at (${entity.getPosition()}) rotation (${entity.getRotation()})`);
		this.entities.set(entity.getId(), entity);
	}

	removeEntity(entityId: number) {
		const entity = this.entities.get(entityId);
		if (entity) {
			this.entities.delete(entityId);
			entity.destroy();
		}
	}
}