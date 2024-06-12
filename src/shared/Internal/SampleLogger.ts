export class SampleLogger {
	private readonly sampleList = new Array<number>(240);

	private start: number = 0;
	private size: number = 0;

	logSample(sample: number): void {
		const index = this.wrapIndex(this.start + this.size);
		this.sampleList[index] = sample;

		if (this.size < 240) {
			++this.size;
		} else {
			this.start = this.wrapIndex(this.start + 1);
		}
	}

	capacity(): number {
		return 240;
	}

	samples(): number {
		return this.size;
	}

	get(index: number): number {
		if (index >= 0 && index < this.size) {
			return this.sampleList[this.wrapIndex(this.start + index)];
		} else {
			error(`${index} out of bounds for length ${this.size}`);
		}
	}

	reset(): void {
		this.start = 0;
		this.size = 0;
	}

	wrapIndex(index: number) {
		return index % 240;
	}

	average(): number {
		let sum = 0;
		for (let i = 0; i < this.size; i++) {
			sum += this.get(i);
		}
		return this.size > 0 ? sum / this.size : 0;
	}

	minimum(): number {
		if (this.size === 0) {
			return 0;
		}

		let min = this.get(0);
		for (let i = 1; i < this.size; i++) {
			const value = this.get(i);
			if (value < min) {
				min = value;
			}
		}

		return min;
	}

	maximum(): number {
		if (this.size === 0) {
			return 0;
		}

		let max = this.get(0);
		for (let i = 1; i < this.size; i++) {
			const value = this.get(i);
			if (value > max) {
				max = value;
			}
		}

		return max;
	}
}
