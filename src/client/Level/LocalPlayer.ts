import {ClientPacketListenerImpl} from "../Network/ClientPacketListenerImpl";
import {PlayerEntity} from "../../shared/Level/Entity/PlayerEntity";
import {Client} from "../Client";

export class LocalPlayer extends PlayerEntity {
	readonly packetListener: ClientPacketListenerImpl;

	constructor(packetListener: ClientPacketListenerImpl, private client: Client, player: Player, position: Vector3) {
		super(player, Vector3.zero);
		this.packetListener = packetListener;
	}

	update() {

	}
}