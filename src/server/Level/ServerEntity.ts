import {ServerLevel} from "./ServerLevel";
import {Entity} from "../../shared/Level/Entity/Entity";
import {ServerPlayer} from "./ServerPlayer";
import {ServerPlayerConnection} from "../Networking/ServerPlayerConnection";
import {ClientboundRemoveEntitiesPacket} from "../../shared/Networking/Packets/ClientboundRemoveEntitiesPacket";

export class ServerEntity {
	private readonly seenBy = new Set<ServerPlayerConnection>();

	constructor(private readonly level: ServerLevel, readonly entity: Entity) {

	}

	broadcastRemoved() {
		this.seenBy.forEach(serverPlayerConnection => {
			this.removePairing(serverPlayerConnection.getPlayer());
		})
	}

	removePairing(player: ServerPlayer) {
		player.packetListener.send(new ClientboundRemoveEntitiesPacket([this.entity.getId()]));
	}

	addPairing(player: ServerPlayer) {
		player.packetListener.send(this.entity.getAddEntityPacket());
	}

	updatePlayer(player: ServerPlayer) {
		if (player !== this.entity) {
			if (!this.seenBy.has(player.packetListener)) {
				this.seenBy.add(player.packetListener);
				this.addPairing(player);
			}
		}
	}

	removePlayer(player: ServerPlayer) {

	}

	updatePlayers(players: Set<ServerPlayer>) {
		players.forEach(player => {
			this.updatePlayer(player);
		})
	}
}