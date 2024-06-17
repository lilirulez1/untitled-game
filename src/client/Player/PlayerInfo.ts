import {Profile} from "../../shared/Profile";

export class PlayerInfo {
	constructor(private readonly profile: Profile) {}

	getProfile() {
		return this.profile;
	}
}