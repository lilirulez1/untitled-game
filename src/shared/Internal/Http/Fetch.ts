import {HttpService} from "@rbxts/services";
import {Exception} from "../Exception";
import {Consumer} from "../Consumer";
import {Future} from "../Future";

export default function Fetch(options: RequestAsyncRequest, listener: Consumer<Future>) {
	task.spawn(() => {
		try {
			const response = HttpService.RequestAsync(options);

			if (response.Success) {
				listener(new Future().wasSuccess());
			}
		} catch (e) {
			throw new Exception(<string>e);
		}
	});
}