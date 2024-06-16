import {ClientPacketListenerImpl} from "../Network/ClientPacketListenerImpl";
import {Client} from "../Client";
import {ClientLevel} from "../Level/ClientLevel";
import {BigVector3} from "../../shared/Internal/BigVector3";
import {ClientPlayer} from "./ClientPlayer";
import {InputHandler} from "./Input/InputHandler";
import {TestVehicle} from "../../shared/Vehicles/TestVehicle";

export class LocalPlayer extends ClientPlayer {
	readonly packetListener: ClientPacketListenerImpl;
	input = new InputHandler();

	private vehicle = new TestVehicle();

	constructor(private client: Client, level: ClientLevel, packetListener: ClientPacketListenerImpl) {
		super(level, packetListener.getProfile());
		this.packetListener = packetListener;
	}

	update() {
		super.update();

		this.input.update();
		this.simulate();

		this.sendPosition();
	}

	simulate() {
		this.setPosition(this.vehicle.update(this.client.getDeltaTime()));
	}

	sendPosition() {
		const delta = this.getPosition().minus(this.getOldPosition());
	}

	resetPosition() {
		this.setPosition(new BigVector3(this.getPosition().x, 0, this.getPosition().z));
	}
}