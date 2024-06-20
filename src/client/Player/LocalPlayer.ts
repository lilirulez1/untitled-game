import {ClientPacketListenerImpl} from "../Network/ClientPacketListenerImpl";
import {Client} from "../Client";
import {ClientLevel} from "../Level/ClientLevel";
import {BigVector3} from "../../shared/Internal/BigVector3";
import {ClientPlayer} from "./ClientPlayer";
import {InputHandler} from "./Input/InputHandler";
import {Hyundai_i20} from "../../shared/Vehicles/Hyundai_i20";

export class LocalPlayer extends ClientPlayer {
	readonly packetListener: ClientPacketListenerImpl;
	input = new InputHandler();

	constructor(private client: Client, level: ClientLevel, packetListener: ClientPacketListenerImpl) {
		super(level, packetListener.getProfile());
		this.packetListener = packetListener;

		// TODO
		// Fix this shit lmao
		this.setVehicle(new Hyundai_i20(this));
	}

	update() {
		this.input.update();
		this.simulate();

		super.update();

		this.sendPosition();
	}

	simulate() {
		if (!this.getVehicle()) return;

		const vehicle = this.getVehicle();
		vehicle.setBrake(this.input.brake);
		vehicle.setThrottle(this.input.throttle);
		vehicle.update(this.client.getDeltaTime());
	}

	sendPosition() {
	}

	resetPosition() {
		this.setPosition(new BigVector3(this.getPosition().x, 0, this.getPosition().z));
	}
}