export class LookupTable {
	private table = new Array<[number, number]>();

	add(index: number, value: number) {
		this.table.push([index, value]);

		return this;
	}

	find(index: number) {
		for (let i = 0; i < this.table.size() - 1; i++) {
			if (this.table[i][0] <= index && index <= this.table[i + 1][0]) {
				const [key, value] = this.table[i];
				const [key1, value1] = this.table[i + 1];
				return (value) + (value1 - value) * (index - key) / (key1 - key);
			}
		}
	}
}