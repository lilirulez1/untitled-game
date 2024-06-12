import {HttpService} from "@rbxts/services";
import {Future} from "../Future";
import {BiConsumer} from "../BiConsumer";

export default function Fetch<T>(options: RequestAsyncRequest, listener?: BiConsumer<Future, T>) {
	task.spawn(() => {
		try {
			const response = HttpService.RequestAsync(options);

			if (listener) {
				if (response.Success) {
					try {
						const data = <T>HttpService.JSONDecode(response.Body);
						listener(new Future().wasSuccess(), data);
					} catch (e) {
						listener(new Future().wasSuccess(), <T>undefined);
					}
				} else {
					print("AAA");
					listener(new Future(), <T>response.StatusMessage);
				}
			}
		} catch (e) {
			if (listener) {
				listener(new Future(), <T>e);
			}
		}
	});
}