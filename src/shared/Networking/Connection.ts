import {Packet} from "./Packets/Packet";
import {Channel} from "./Channel";
import {Address} from "./Address";
import {PacketListener} from "./PacketListener";
import {Consumer} from "../Internal/Consumer";
import {ServerboundHelloPacket} from "./Packets/ServerboundHelloPacket";
import {ClientPacketListener} from "./Packets/ClientPacketListener";
import {PacketSendListener} from "./PacketSendListener";
import {UpdatablePacketListener} from "./UpdatablePacketListener";
import {ChannelInitializer} from "./ChannelInitializer";
import {Bootstrap} from "./Bootstrap";
import {Exception} from "../Internal/Exception";

function isUpdatablePacketListener(listener: PacketListener): listener is UpdatablePacketListener {
	return "update" in listener;
}

export class Connection {
	channel!: Channel;
	private address!: Address;
	private disconnectListener!: PacketListener;
	private packetListener!: PacketListener
	private disconnectReason?: string;
	private disconnectionHandled = false;
	private pendingActions = new Array<Consumer<Connection>>();
	private delayedDisconnection?: string;

	public static connect(connection: Connection) {
		new Bootstrap()
			.setChildHandler(
				new (class extends ChannelInitializer {
					constructor() {
						super();
					}

					initializeChannel(channel: Channel) {
						connection.configurePacketHandler(channel);
					}
				})()
			)
			.connect();
	}

	configurePacketHandler(channel: Channel) {
		channel.setHandler(this);
	}

	channelActive(channel: Channel) {
		this.channel = channel;
		this.address = channel.getAddress();

		if (this.delayedDisconnection !== undefined) {
			this.disconnect(this.delayedDisconnection);
		}
	}

	channelRead(packet: Packet<any>) {
		if (this.channel.isOpen()) {
			if (this.packetListener === undefined) {
				throw new Exception("Received a packet but packet listener is not initialized");
			} else {
				if (this.packetListener.isAcceptingMessages()) {
					try {
						packet.handle(this.packetListener);
					} catch (e) {
						warn(`Received ${getmetatable(packet)} couldn't be processed\n` + e);
					}
				}
			}
		}
	}

	setListener(listener: PacketListener) {
		this.packetListener = listener;
	}

	initiateServerConnection(listener: ClientPacketListener) {
		this.disconnectListener = listener;

		this.runOnceConnected((connection) => {
			this.setListener(listener);
			connection.sendPacket(new ServerboundHelloPacket());
		})
	}

	runOnceConnected(callback: Consumer<Connection>) {
		if (this.isConnected()) {
			this.flushQueue()
			callback(this);
		} else {
			this.pendingActions.push(callback);
		}
	}

	send(packet: Packet<any>, sendListener?: PacketSendListener) {
		if (this.isConnected()) {
			this.flushQueue();
			this.sendPacket(packet, sendListener);
		} else {
			this.pendingActions.push(connection => {
				connection.sendPacket(packet, sendListener);
			})
		}
	}

	update() {
		this.flushQueue();

		if (this.packetListener && isUpdatablePacketListener(this.packetListener)) {
			this.packetListener.update();
		}

		if (!this.isConnected() && !this.disconnectionHandled) {
			this.handleDisconnection();
		}
	}

	getLoggableAddress(): string {
		return this.address.getAddress();
	}

	disconnect(reason: string) {
		if (this.channel === undefined) {
			this.delayedDisconnection = reason;
		}

		if (this.isConnected()) {
			this.channel.close();
			this.disconnectReason = reason;
		}
	}

	isConnected() {
		return this.channel !== undefined && this.channel.isOpen();
	}

	isConnecting() {
		return this.channel === undefined;
	}

	handleDisconnection() {
		if (this.channel !== undefined && !this.channel.isOpen()) {
			if (this.disconnectionHandled) {
				warn("handleDisconnection() called twice");
			} else {
				this.disconnectionHandled = true;

				const listener = this.packetListener !== undefined ? this.packetListener : this.disconnectListener;

				if (listener !== undefined) {
					const disconnectionReason = this.disconnectReason;
					listener.onDisconnect(disconnectionReason ? disconnectionReason : "Disconnected");
				}
			}
		}
	}

	connectedPlayer() {
		return this.channel.getPlayer();
	}

	private sendPacket(packet: Packet<any>, sendListener?: PacketSendListener) {
		if (sendListener !== undefined) {
			this.channel.addListener(future => {
				if (future.isSuccess()) {
					sendListener.onSuccess();
				}
			})
		}
		this.channel.write(packet);
	}

	private flushQueue() {
		if (this.channel !== undefined && this.channel.isOpen()) {
			let callback;
			while ((callback = this.pendingActions.remove(0)) !== undefined) {
				callback(this);
			}
		}
	}
}