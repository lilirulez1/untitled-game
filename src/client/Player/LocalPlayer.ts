import {ClientPacketListenerImpl} from "../Network/ClientPacketListenerImpl";
import {Client} from "../Client";
import {ClientLevel} from "../Level/ClientLevel";
import {BigVector3} from "../../shared/Internal/BigVector3";
import {ClientPlayer} from "./ClientPlayer";
import {InputHandler} from "./Input/InputHandler";

export class LocalPlayer extends ClientPlayer {
	readonly packetListener: ClientPacketListenerImpl;
	input = new InputHandler();

	constructor(private client: Client, level: ClientLevel, packetListener: ClientPacketListenerImpl) {
		super(level, packetListener.getProfile(), new Color3(0, 1, 0));
		this.packetListener = packetListener;
	}

	update() {
		super.update();

		this.input.update();
	}

	resetPosition() {
		this.setPosition(new BigVector3(this.getPosition().x, 0, this.getPosition().z));
	}
}