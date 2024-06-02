import {Connection} from "../../shared/Networking/Connection";
import {ChannelInitializer} from "../../shared/Networking/ChannelInitializer";
import {Channel} from "../../shared/Networking/Channel";
import {Server} from "../Server";
import {ServerBootstrap} from "./ServerBootstrap";
import {ServerPacketListenerImpl} from "./ServerPacketListenerImpl";

export class ServerConnectionListener {
	private connections = new Array<Connection>();

	constructor(private server: Server) {}

	startListener() {
		new ServerBootstrap()
			.setChildHandler(
				new (class extends ChannelInitializer {
					constructor(private listener: ServerConnectionListener) {super();}

					initializeChannel(channel: Channel) {
						const connection = new Connection();
						this.listener.connections.push(connection);
						channel.setHandler(connection);
						connection.setListener(new ServerPacketListenerImpl(this.listener.server, connection));
					}
				})(this)
			)
			.bind();
	}

	update() {
		this.connections.forEach((connection, index) => {
			if (connection.isConnecting()) return;

			if (connection.isConnected()) {
				try {
					connection.update();
				} catch (e) {
					warn(`Failed to handle packet for ${connection.getLoggableAddress()}`);
					connection.disconnect("Internal server error");
				}
			} else {
				this.connections.remove(index);
				connection.handleDisconnection();
			}
		})
	}

	stop() {
		this.connections.forEach(connection => connection.channel.close());
	}
}