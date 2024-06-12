import {ServerPacketListener} from "../../shared/Networking/Packets/ServerPacketListener";
import {UpdatablePacketListener} from "../../shared/Networking/UpdatablePacketListener";
import {Connection} from "../../shared/Networking/Connection";
import {Server} from "../Server";
import {ServerboundHelloPacket} from "../../shared/Networking/Packets/ServerboundHelloPacket";
import {ServerPlayer} from "../Level/ServerPlayer";
import {Packet} from "../../shared/Networking/Packets/Packet";
import {PacketSendListener} from "../../shared/Networking/PacketSendListener";
import {Exception} from "../../shared/Internal/Exception";
import {ServerPlayerConnection} from "./ServerPlayerConnection";
import {Profile} from "../../shared/Profile";
import {BigVector3} from "../../shared/Internal/BigVector3";
import {ClientboundPlayerPositionPacket} from "../../shared/Networking/Packets/ClientboundPlayerPositionPacket";

export class ServerPacketListenerImpl implements ServerPacketListener, UpdatablePacketListener, ServerPlayerConnection {
	private player!: ServerPlayer;
	private profile!: Profile;

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

		this.profile = new Profile(this.connection.connectedPlayer());

		this.player = playerList.getPlayer(this.connection.connectedPlayer(), this.profile);
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

	teleport(position: BigVector3) {
		this.player.setPosition(position);
		this.player.packetListener.send(new ClientboundPlayerPositionPacket(position));
	}

	getPlayer(): ServerPlayer {
		return this.player;
	}
}