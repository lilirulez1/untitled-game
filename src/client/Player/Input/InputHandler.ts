import {KeyboardInput} from "./KeyboardInput";
import {GamepadInput} from "./GamepadInput";
import {UserInputService} from "@rbxts/services";

enum InputType {
	Keyboard,
	Gamepad,
	Unknown
}

export class InputHandler {
	steering = 0;
	throttle = 0;
	brake = 0;

	handbrake = false;
	gearUp = false;
	gearDown = false;

	private keyboardInput = new KeyboardInput(this);
	private gamepadInput = new GamepadInput(this);
	private inputType = InputType.Keyboard;

	constructor() {
	}

	update() {
		this.updateInputType();

		if (this.inputType === InputType.Keyboard) {
			this.keyboardInput.update();
		} else if (this.inputType === InputType.Gamepad) {
			this.gamepadInput.update();
		}
	}

	private updateInputType() {
		const lastInputType = UserInputService.GetLastInputType();
		if (lastInputType === Enum.UserInputType.Gamepad1) {
			this.inputType = InputType.Gamepad
		} else if (lastInputType === Enum.UserInputType.Keyboard) {
			this.inputType = InputType.Keyboard;
		}
	}
}