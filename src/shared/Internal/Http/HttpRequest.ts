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

	post(sendListener?: SendListener) {
		const data = this._data ? {...this.httpClient.data ?? {}, ...this._data} : this.httpClient.data;

		Fetch({
			Url: this.httpClient.getUrl() + this.endpoint,
			Method: "POST",
			Headers: this.httpClient.headers,
			Body: HttpService.JSONEncode(data)
		}, future => {
			if (future.isSuccess()) {
				if (sendListener) {
					sendListener.onSuccess();
				}
			}
		});
	}
}