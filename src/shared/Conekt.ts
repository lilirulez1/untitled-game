export class Conekt {
	private connections = new Map<number, RBXScriptConnection>();

	add(connection: RBXScriptConnection) {
		const index = this.connections.size();
		this.connections.set(index, connection);
		return index;
	}

	remove(task: number) {
		const connection = this.connections.get(task);

		if (connection && connection.Connected) {
			connection.Disconnect();
			this.connections.delete(task);
		} else {
			warn("Attempted to call remove on connection twice");
		}
	}

	cleanup() {
		this.connections.forEach((connection) => {
			if (connection.Connected) {
				connection.Disconnect();
			}
		})

		this.connections.clear();
	}
}