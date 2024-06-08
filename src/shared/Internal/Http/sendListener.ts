import {Runnable} from "../Runnable";

export class SendListener {
	static thenRun(callback: Runnable) {
		return new class extends SendListener {
			onSuccess() {
				super.onSuccess();
				callback();
			}
		}();
	}

	onSuccess() {};
}