export class Future {
	private success = false;

	isSuccess() {
		return this.success;
	}

	wasSuccess() {
		this.success = true;
		return this;
	}
}