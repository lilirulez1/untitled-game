import {Profile} from "../../shared/Profile";

export class PlayerInfo {
	constructor(private profile: Profile) {

	}

	getProfile() {
		return this.profile;
	}
}