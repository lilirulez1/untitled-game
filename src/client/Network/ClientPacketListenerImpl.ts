import {ClientPacketListener} from "../../shared/Networking/Packets/ClientPacketListener";
import {ClientboundHelloPacket} from "../../shared/Networking/Packets/ClientboundHelloPacket";
import {Connection} from "../../shared/Networking/Connection";
import {Client} from "../Client";
import {ClientboundDisconnectPacket} from "../../shared/Networking/Packets/ClientboundDisconnectPacket";
import {LocalPlayer} from "../Level/LocalPlayer";
import {ClientboundSystemMessagePacket} from "../../shared/Networking/Packets/ClientboundSystemMessagePacket";

export class ClientPacketListenerImpl implements ClientPacketListener {
	private closed = false;

	constructor(private readonly client: Client, private readonly connection: Connection) {}

	close() {
		this.closed = true;
	}

	onDisconnect(reason: string) {
		this.client.disconnect();
		warn(`Client disconnected with reason: ${reason}`);
	}

	isAcceptingMessages(): boolean {
		return this.connection.isConnected() && !this.closed;
	}

	handleHello(packet: ClientboundHelloPacket) {
		this.client.player = new LocalPlayer(this, this.client, this.connection.connectedPlayer(), Vector3.zero);
	}

	handleSystemMessage(packet: ClientboundSystemMessagePacket) {
		print(`[SYSTEM] ${packet.getMessage()}`);
	}

	handleDisconnect(packet: ClientboundDisconnectPacket) {
		this.connection.disconnect(packet.getReason());
	}
}