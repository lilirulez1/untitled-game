import {Input} from "./Input";
import {UserInputService} from "@rbxts/services";

export class GamepadInput extends Input {
	update() {
		const gamepadState = UserInputService.GetGamepadState(Enum.UserInputType.Gamepad1);

		this.inputHandler.steering = gamepadState[16].Position.X;
		this.inputHandler.accelerator = gamepadState[9].Position.Z;
		this.inputHandler.brake = gamepadState[8].Position.Z;

		this.inputHandler.handbrake = gamepadState[3].Position.Z === 1;
		this.inputHandler.gearUp = gamepadState[4].Position.Z === 1;
		this.inputHandler.gearDown = gamepadState[1].Position.Z === 1;
	}
}