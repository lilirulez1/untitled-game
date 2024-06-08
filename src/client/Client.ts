import {Conekt} from "../shared/Conekt";
import {RunService} from "@rbxts/services";
import {Connection} from "../shared/Networking/Connection";
import {ClientPacketListenerImpl} from "./Network/ClientPacketListenerImpl";
import {LocalPlayer} from "./Level/LocalPlayer";
import {Exception} from "../shared/Internal/Exception";

export class Client {
	public player!: LocalPlayer;

	private conekt = new Conekt();
	private connection!: Connection;

	run() {
		try {
			try {
				this.connection = new Connection();
				Connection.connect(this.connection);

				this.connection.initiateServerConnection(new ClientPacketListenerImpl(this, this.connection));
			} catch (e) {
				if (e instanceof Exception) {
					throw new Exception(e);
				}

				throw new Exception("Failed to connect to server\n" + e);
			}

			this.conekt.add(RunService.RenderStepped.Connect((deltaTime) => this.update(deltaTime)))
		} catch (e) {
			if (e instanceof Exception) {
				throw new Exception(e);
			}

			throw new Exception("Uncaught exception\n" + e);
		}
	}

	update(deltaTime: number) {
		if (this.connection !== undefined) {
			if (this.connection.isConnected()) {
				this.connection.update();
			} else {
				this.connection.handleDisconnection();
			}
		}
	}

	getPacketListener() {
		return this.player === undefined ? undefined : this.player.packetListener;
	}

	disconnect() {
		const packetListener = this.getPacketListener();
		if (packetListener) {
			packetListener.close();
		}
	}
}