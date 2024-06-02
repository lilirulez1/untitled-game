import {ServerPlayer} from "./ServerPlayer";
import {Connection} from "../../shared/Networking/Connection";
import {ClientboundHelloPacket} from "../../shared/Networking/Packets/ClientboundHelloPacket";
import {Function} from "../../shared/Internal/Function";
import {Server} from "../Server";

export class PlayerList {
	private players = new Set<ServerPlayer>();

	constructor(private server: Server) {}

	broadcastSystemMessage(message: string, mutator?: Function<ServerPlayer, string>) {
		this.players.forEach(player => {
			const mutatedMessage = mutator ? mutator(player) : message;
			if (mutatedMessage) {
				player.sendSystemMessage(mutatedMessage);
			}
		})
	}

	getPlayer(player: Player) {
		return new ServerPlayer(player);
	}

	addPlayer(connection: Connection, player: ServerPlayer) {
		this.players.add(player);

		connection.send(new ClientboundHelloPacket());

		print(`${player.getName()} logged in with entity id [todo]`);

		this.broadcastSystemMessage(`${player.getDisplayName()} joined the game`);

		this.server.getTelemetry().playerJoin(player.getName());
	}

	removePlayer(player: ServerPlayer) {
		this.players.delete(player);
		this.server.getTelemetry().playerLeft(player.getName());
	}
}