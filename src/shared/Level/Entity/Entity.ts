import {ClientboundAddEntityPacket} from "../../Networking/Packets/ClientboundAddEntityPacket";

export abstract class Entity {
	update() {

	}

	recreateFromPacket(packet: ClientboundAddEntityPacket) {
		
	};
}