import {HttpService} from "@rbxts/services";
import {Exception} from "../shared/Internal/Exception";

export class Telemetry {
	private website = "http://localhost:3000";
	private key = "!G*'MbQy+Q22v";
	private serverId = game.JobId === "" ? "STUDIO_SERVER" : game.JobId;

	connect() {
		this.sendRequest("/connect", "Failed to connect to Telemetry")
	}

	disconnect() {
		this.sendRequest("/disconnect", "Failed to disconnect from Telemetry")
	}

	playerJoin(name: string) {
		this.sendRequest("/playerJoin", "Failed to send join to Telemetry", HttpService.JSONEncode({
			name
		}));
	}

	playerLeft(name: string) {
		this.sendRequest("/playerLeave", "Failed to send leave to Telemetry", HttpService.JSONEncode({
			name
		}));
	}

	private sendRequest(endpoint: string, warning: string, body?: string) {
		try {
			const result = HttpService.RequestAsync({
				Url: `${this.website}/api/server${endpoint}`,
				Method: "POST",
				Body: body,
				Headers: {
					"Content-Type": "application/json",
					"x-key": this.key,
					"x-server-id": this.serverId
				},
			})

			if (result.StatusCode < 200 || result.StatusCode > 299) {
				throw new Exception(`Unsuccessful response status code: ${result.StatusCode}`);
			}
		} catch (e) {
			warn(`${warning}` + e);
		}
	}
}