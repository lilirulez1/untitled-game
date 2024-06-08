import {HttpClient} from "../shared/Internal/Http/HttpClient";
import {SendListener} from "../shared/Internal/Http/sendListener";
import {Exception} from "../shared/Internal/Exception";

export class Telemetry {
	private connected = false;

	private website = "http://localhost:3000";
	private key = "!G*'MbQy+Q22v";
	private serverId = game.JobId === "" ? "STUDIO_SERVER" : game.JobId;

	private httpClient = new HttpClient(this.website + "/api");

	constructor() {
		this.httpClient.headers = {
			"Content-Type": "application/json",
			"x-key": this.key
		}
	}
	

	connect() {
		try {
			this.httpClient
				.request(`/server/${this.serverId}/connect`)
				.post(SendListener.thenRun(() => {
					this.connected = true;
				}));
		} catch (e) {
			if (e instanceof Exception) {
				warn("Failed to connect to telemetry\n" + e);
			}

			warn("Failed to connect to telemetry\n" + e);
		}
	}

	disconnect() {
		if (!this.connected) return;

		this.httpClient
			.request(`/server/${this.serverId}/disconnect`)
			.post();
	}

	playerJoined(name: string) {
		if (!this.connected) return;

		this.httpClient
			.request(`/server/${this.serverId}/player/join`)
			.data({
				"player": {
					"name": name,
				}
			})
			.post();
	}

	playerLeft(name: string) {
		if (!this.connected) return;

		this.httpClient
			.request(`/server/${this.serverId}/player/leave`)
			.data({
				"player": {
					"name": name,
				}
			})
			.post();
	}
}