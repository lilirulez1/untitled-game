import {InputHandler} from "./InputHandler";

export abstract class Input {
	constructor(protected inputHandler: InputHandler) {
	}

	abstract update(): void;
}