import {Level} from "../../shared/Level/Level";
import {Entity} from "../../shared/Level/Entity/Entity";

export class ClientLevel extends Level {
	private readonly entities = new Map<number, Entity>();

	updateEntities() {
		this.entities.forEach(entity => entity.update());
	}

	addEntity(entity: Entity) {
		print(`Added entity with UUID ${entity.getUuid()} of type ${entity.getType()} to level at position ${entity.getPosition()} [${tostring(getmetatable(entity))}]`);
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