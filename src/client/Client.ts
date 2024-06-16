import {Conekt} from "../shared/Conekt";
import {RunService} from "@rbxts/services";
import {Connection} from "../shared/Networking/Connection";
import {ClientPacketListenerImpl} from "./Network/ClientPacketListenerImpl";
import {LocalPlayer} from "./Player/LocalPlayer";
import {Exception} from "../shared/Internal/Exception";
import {ClientLevel} from "./Level/ClientLevel";
import {Options} from "./Options";
import {GameRenderer} from "./GameRenderer";

export class Client {
	static instance: Client;

	readonly options = new Options();
	player!: LocalPlayer;

	private conekt = new Conekt();

	private connection!: Connection;
	private level!: ClientLevel;
	private gameRenderer = new GameRenderer();

	private deltaTime = 0;

	constructor() {
		Client.instance = this;
	}

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
		this.deltaTime = deltaTime;

		if (this.connection !== undefined) {
			if (this.connection.isConnected()) {
				this.connection.update();
			} else {
				this.connection.handleDisconnection();
			}
		}

		if (this.level) {
			this.level.updateEntities();
		}

		this.gameRenderer.update();
	}

	getPacketListener() {
		return this.player === undefined ? undefined : this.player.packetListener;
	}

	getGameRenderer() {
		return this.gameRenderer;
	}

	getDeltaTime() {
		return this.deltaTime;
	}

	disconnect() {
		const packetListener = this.getPacketListener();
		if (packetListener) {
			packetListener.close();
		}
	}

	setLevel(level: ClientLevel) {
		this.level = level;
	}
}