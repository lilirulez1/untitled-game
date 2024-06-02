import {ServerPacketListener} from "../../shared/Networking/Packets/ServerPacketListener";
import {UpdatablePacketListener} from "../../shared/Networking/UpdatablePacketListener";
import {Connection} from "../../shared/Networking/Connection";
import {Server} from "../Server";
import {ServerboundHelloPacket} from "../../shared/Networking/Packets/ServerboundHelloPacket";
import {ServerPlayer} from "./ServerPlayer";
import {Packet} from "../../shared/Networking/Packets/Packet";
import {PacketSendListener} from "../../shared/Networking/PacketSendListener";
import {Exception} from "../../shared/Internal/Exception";

export class ServerPacketListenerImpl implements ServerPacketListener, UpdatablePacketListener {
	private player!: ServerPlayer;

	constructor(private readonly server: Server, private readonly connection: Connection) {}

	update() {

	}

	onDisconnect(reason: string) {
		print(`${this.connection.connectedPlayer().Name} lost connection: ${reason}`);

		this.server.getPlayerList().broadcastSystemMessage(`${this.player.getDisplayName()} left the game`);
		this.player.disconnect();
		this.server.getPlayerList().removePlayer(this.player);
	}

	isAcceptingMessages(): boolean {
		return this.connection.isConnected();
	}

	handleHello(packet: ServerboundHelloPacket) {
		const playerList = this.server.getPlayerList();

		this.player = playerList.getPlayer(this.connection.connectedPlayer());
		this.player.packetListener = this;

		playerList.addPlayer(this.connection, this.player);
	}

	send(packet: Packet<any>, sendListener?: PacketSendListener) {
		try {
			this.connection.send(packet, sendListener);
		} catch (e) {
			if (e instanceof Exception) {
				throw new Exception(e);
			}

			throw new Exception("Uncaught error when sending packet\n" + e);
		}
	}
}