import {Runnable} from "../Runnable";
import {Supplier} from "../Supplier";

export class SendListener {
	static thenRun(callback: Runnable): SendListener {
		return new class extends SendListener {
			onSuccess() {
				super.onSuccess();
				callback();
			}

			onFailure() {
				super.onFailure("");
				callback();
			}
		}();
	}

	static exceptionallyDo(callback: Supplier<string>) {
		return new class extends SendListener {
			onFailure(msg: string) {
				super.onFailure(msg);
				callback(msg);
			}
		}();
	}

	onSuccess() {};

	onFailure(msg: string) {};
}