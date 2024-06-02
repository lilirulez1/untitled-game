export class Exception {
	message: string;

	constructor(e: string | Exception) {
		const [source, line] = debug.info(3, "sl");

		if (e instanceof Exception) {
			this.message = e.message
				+ `\nat ${source}:line ${line}`;
		} else {
			this.message = `Unhandled exception. Exception: ${e}.`
				+ `\nat ${source}:line ${line}`;
		}
	}

	toString() {
		return this.message;
	}
}