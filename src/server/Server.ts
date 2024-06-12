import {Function} from "../shared/Internal/Function";
import {RunService} from "@rbxts/services";
import {Conekt} from "../shared/Conekt";
import {PlayerList} from "./Networking/PlayerList";
import {Exception} from "../shared/Internal/Exception";
import {ServerConnectionListener} from "./Networking/ServerConnectionListener";
import {Telemetry} from "./Telemetry";
import {ServerLevel} from "./Level/ServerLevel";

export class Server {
	private conekt = new Conekt();
	private telemetry = new Telemetry(this);

	private startTime!: number;

	private readonly connectionListener: ServerConnectionListener;

	private playerList = new PlayerList(this);

	private level!: ServerLevel;

	constructor(private thread: thread) {
		this.connectionListener = new ServerConnectionListener(this);
	}

	static start(callback: Function<thread, Server>): Server {
		let server: Server;
		const thread: thread = coroutine.create(() => {
			server.run();
		});

		server = callback(thread);
		const [success, result] = coroutine.resume(thread);

		if (!success) {
			if (result instanceof Exception) {
				error(result.message, 0);
			}

			print("Need to fix error here");
		}

		return server;
	}

	getPlayerList() {
		return this.playerList;
	}

	getTelemetry() {
		return this.telemetry;
	}

	getServerLevel() {
		return this.level;
	}

	getStartTime() {
		return this.startTime;
	}

	close() {
		warn("Stopping server");

		this.conekt.cleanup();
		this.connectionListener.stop();

		this.telemetry.disconnect();
	}

	private initialize() {
		try {
			this.connectionListener.startListener();
		} catch (e) {
			warn("Failed to start listener");
			return false;
		}

		this.telemetry.connect();

		this.level = new ServerLevel();

		this.startTime = os.clock();

		return true;
	}

	private run() {
		try {
			if (!this.initialize()) {
				throw new Exception("Failed to initialize server");
			}

			this.conekt.add(RunService.Stepped.Connect((time, deltaTime) => this.update(time, deltaTime)));

			game.Close.Wait();
		} catch (e) {
			if (e instanceof Exception) {
				throw new Exception(e);
			}

			throw new Exception("Uncaught exception\n" + e);
		} finally {
			this.close();
		}
	}

	private update(time: number, deltaTime: number) {
		this.connectionListener.update();

		this.telemetry.update(deltaTime);
	}
}