import {Level} from "../../shared/Level/Level";
import {Entity} from "../../shared/Level/Entity/Entity";
import {ServerPlayer} from "./ServerPlayer";
import {ServerEntity} from "./ServerEntity";

export class ServerLevel extends Level {
	private readonly players = new Set<ServerPlayer>();
	private entities = new Map<number, ServerEntity>();

	addEntity(entity: Entity) {
		const serverEntity = new ServerEntity(this, entity);
		this.entities.set(entity.getId(), serverEntity);
		serverEntity.updatePlayers(this.players);

		if (entity instanceof ServerPlayer) {
			const serverPlayer = <ServerPlayer>entity;
			this.players.add(serverPlayer);

			this.entities.forEach(serverEntity => {
				if (serverEntity.entity !== serverPlayer) {
					serverEntity.updatePlayer(serverPlayer);
				}
			})
		}
	}

	removeEntity(entity: Entity) {
		if (entity instanceof ServerPlayer) {
			this.players.delete(entity);
			this.entities.forEach(serverEntity => {
				serverEntity.removePlayer(entity);
			})
		}

		const serverEntity = this.entities.get(entity.getId());
		if (serverEntity) {
			this.entities.delete(entity.getId());
			serverEntity.broadcastRemoved();
		}
	}
}