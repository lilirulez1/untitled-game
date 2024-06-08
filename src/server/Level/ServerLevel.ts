import {Level} from "../../shared/Level/Level";
import {Entity} from "../../shared/Level/Entity/Entity";
import {ServerPlayer} from "../Networking/ServerPlayer";

export class ServerLevel extends Level {
	private readonly players = new Set<ServerPlayer>();
	private entities = new Set<Entity>();

	update() {
		this.entities.forEach(entity => {
			entity.update();
		});
	}

	addEntity(entity: Entity) {
		this.entities.add(entity);

		if (entity instanceof ServerPlayer) {
			this.players.add(entity);
		}
	}

	removeEntity(entity: Entity) {
		this.entities.delete(entity);

		if (entity instanceof ServerPlayer) {
			this.players.delete(entity);
		}
	}
}