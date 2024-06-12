import {ClientLevel} from "../Level/ClientLevel";
import {Profile} from "../../shared/Profile";
import {ClientboundAddEntityPacket} from "../../shared/Networking/Packets/ClientboundAddEntityPacket";
import {ClientPlayer} from "./ClientPlayer";

export class RemotePlayer extends ClientPlayer {
	constructor(level: ClientLevel, profile: Profile) {
		super(level, profile, new Color3(1, 0, 0));
	}

	recreateFromPacket(packet: ClientboundAddEntityPacket) {
		super.recreateFromPacket(packet);
		this.setOldPosition();
	}
}