import {HttpClient} from "./HttpClient";
import Fetch from "./Fetch";
import {HttpService} from "@rbxts/services";
import {SendListener} from "./sendListener";

export class HttpRequest {
	private _data?: Record<string, string | { [Key: string]: string }>;

	constructor(private readonly httpClient: HttpClient, private readonly endpoint: string) {}

	data(data: Record<string, string | { [Key: string]: string }>) {
		this._data = data;
		return this;
	}

	post(sendListener?: SendListener, errorListener?: SendListener) {
		const data = this._data ? {...this.httpClient.data ?? {}, ...this._data} : this.httpClient.data;

		Fetch({
			Url: this.httpClient.getUrl() + this.endpoint,
			Method: "POST",
			Headers: this.httpClient.headers,
			Body: HttpService.JSONEncode(data)
		}, (future, data) => {
			if (sendListener) {
				if (future.isSuccess()) {
					sendListener.onSuccess();
				} else if (errorListener) {
					sendListener.onFailure(<string><unknown>undefined);
					errorListener.onFailure("An error occurred while sending the request: " + data);
				}
			}
		});
	}
}