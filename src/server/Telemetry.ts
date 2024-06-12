import {HttpClient} from "../shared/Internal/Http/HttpClient";
import {Exception} from "../shared/Internal/Exception";
import {Server} from "./Server";
import {SampleLogger} from "../shared/Internal/SampleLogger";
import {RunService, Workspace} from "@rbxts/services";
import Fetch from "../shared/Internal/Http/Fetch";
import {SendListener} from "../shared/Internal/Http/sendListener";

export class Telemetry {
	private connected = false;
	private lastUpdateTime!: number;

	private serverTps = new SampleLogger();
	private physicsTps = new SampleLogger();

	private website = "http://localhost:3000";
	private key = "!G*'MbQy+Q22v";
	private serverId = game.JobId === "" ? "STUDIO_SERVER" : game.JobId;

	private httpClient = new HttpClient(this.website + "/api");

	constructor(private readonly server: Server) {
		this.httpClient.headers = {
			"Content-Type": "application/json",
			"x-key": this.key
		}
	}

	connect() {
		if (RunService.IsStudio()) {
			return;
		}

		try {
			Fetch<{
				query: string,
				country: string,
				regionName: string,
				status: string
			}>({
				Url: "http://ip-api.com/json/?fields=status,country,regionName,query",
				Method: "GET"
			}, (future, data) => {
				if (data.status !== "success" || !future.isSuccess()) {
					throw new Exception("Could not fetch server region info");
				}

				this.httpClient
					.request(`/server/${this.serverId}/connect`)
					.data({
						"ip": data.query,
						"location": {
							"country": data.country,
							"regionName": data.regionName,
						}
					})
					.post(SendListener.thenRun(() => {
						this.connected = true;
					}), SendListener.exceptionallyDo((e) => {
						throw new Exception(e);
					}));
			});
		} catch (e) {
			warn("Failed to connect to telemetry\n" + e);
		}
	}

	disconnect() {
		try {
			this.httpClient
				.request(`/server/${this.serverId}/disconnect`)
				.post();
		} catch (e) {
			warn("Failed to disconnect from telemetry\n" + e);
		}
	}

	playerJoined(name: string) {
		if (!this.connected) return;

		this.httpClient
			.request(`/server/${this.serverId}/player/join`)
			.data({
				"name": name,
			})
			.post();
	}

	playerLeft(name: string) {
		if (!this.connected) return;

		this.httpClient
			.request(`/server/${this.serverId}/player/leave`)
			.data({
				"name": name,
			})
			.post();
	}

	update(deltaTime: number) {
		if (!this.connected) return;

		this.serverTps.logSample(1 / deltaTime);
		this.physicsTps.logSample(Workspace.GetRealPhysicsFPS());

		if (!this.lastUpdateTime || os.clock() - this.lastUpdateTime > 5) {
			this.lastUpdateTime = os.clock();

			this.report();
		}
	}

	private report() {
		/*		print({
					"uptime": this.lastUpdateTime - this.server.getStartTime(),
					"avg_server_tps": math.round(this.serverTps.average()),
					"avg_physics_fps": math.round(this.physicsTps.average()),
					"memory_usage": Stats.GetTotalMemoryUsageMb()
				})*/
	}
}