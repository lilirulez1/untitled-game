export class Profile {
	constructor(private player: Player) {
	}

	getId() {
		return this.player.UserId;
	}

	getName() {
		return this.player.Name;
	}
}