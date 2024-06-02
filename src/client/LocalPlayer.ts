import {AbstractPlayer} from "../shared/Level/Entity/AbstractPlayer";
import {Client} from "./Client";
import {ClientPacketListenerImpl} from "./Network/ClientPacketListenerImpl";

export class LocalPlayer extends AbstractPlayer {
	readonly packetListener: ClientPacketListenerImpl;

	constructor(player: Player, private client: Client, packetListener: ClientPacketListenerImpl) {
		super(player);
		this.packetListener = packetListener;
	}
}