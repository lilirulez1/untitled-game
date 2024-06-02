import {Runnable} from "../Internal/Runnable";

export class PacketSendListener {
	static thenRun(callback: Runnable) {
		return new class extends PacketSendListener {
			onSuccess() {
				super.onSuccess();
				callback();
			}
		}();
	}

	onSuccess() {};
}