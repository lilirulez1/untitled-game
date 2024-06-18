import {Input} from "./Input";
import {UserInputService} from "@rbxts/services";

export class KeyboardInput extends Input {
	calculateAxis(one: Boolean, two: Boolean) {
		if (one === two) {
			return 0;
		} else {
			return one ? 1 : -1;
		}
	}

	update() {
		this.inputHandler.steering = this.calculateAxis(UserInputService.IsKeyDown(Enum.KeyCode.D), UserInputService.IsKeyDown(Enum.KeyCode.A));
		this.inputHandler.throttle = UserInputService.IsKeyDown(Enum.KeyCode.W) ? 1 : 0;
		this.inputHandler.brake = UserInputService.IsKeyDown(Enum.KeyCode.S) ? 1 : 0;

		this.inputHandler.handbrake = UserInputService.IsKeyDown(Enum.KeyCode.Space);
		this.inputHandler.gearUp = UserInputService.IsKeyDown(Enum.KeyCode.E);
		this.inputHandler.gearDown = UserInputService.IsKeyDown(Enum.KeyCode.Q);
	}
}