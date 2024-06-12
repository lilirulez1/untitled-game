import {PacketListener} from "./PacketListener";
import {Packet} from "./Packets/Packet";
import {ByteBuffer} from "./ByteBuffer";
import {ClientboundHelloPacket} from "./Packets/ClientboundHelloPacket";
import {ServerboundHelloPacket} from "./Packets/ServerboundHelloPacket";
import {ClientboundDisconnectPacket} from "./Packets/ClientboundDisconnectPacket";
import {ClientboundSystemMessagePacket} from "./Packets/ClientboundSystemMessagePacket";
import {ClientboundAddEntityPacket} from "./Packets/ClientboundAddEntityPacket";
import {ClientboundPlayerInfoUpdatePacket} from "./Packets/ClientboundPlayerInfoUpdatePacket";
import {ClientboundPlayerPositionPacket} from "./Packets/ClientboundPlayerPositionPacket";
import {ClientboundRemoveEntitiesPacket} from "./Packets/ClientboundRemoveEntitiesPacket";
import {ClientboundPlayerInfoRemovePacket} from "./Packets/ClientboundPlayerInfoRemovePacket";

interface Class<T> {
	new(...args: any[]): T;
}

export class CodecData<T extends PacketListener> {
	constructor(private readonly packetSet: PacketSet<T>) {}

	packetID(packet: Packet<any>): number | undefined {
		return this.packetSet.getID(packet);
	}

	createPacket(id: number, buffer: ByteBuffer): Packet<any> {
		return this.packetSet.createPacket(id, buffer) as Packet<any>;
	}
}

export class PacketSet<T extends PacketListener> {
	readonly packetToId: Record<string, number> = {};
	private readonly idToDeserializer: ((Buffer: ByteBuffer) => Packet<T>)[] = [];

	addPacket(packet: Class<Packet<T>>): PacketSet<T> {
		this.packetToId[tostring(packet)] = this.idToDeserializer.size();
		this.idToDeserializer.push((buffer) => new packet(buffer));

		return this;
	}

	getID(packet: Packet<any>): number | undefined {
		return this.packetToId[tostring(getmetatable(packet))];
	}

	createPacket(id: number, buffer: ByteBuffer): Packet<any> | undefined {
		const deserializer = this.idToDeserializer[id];
		return deserializer !== undefined ? deserializer(buffer) : undefined;
	}
}

export class ConnectionProtocol {
	public static readonly PACKETS = new PacketSet()
		.addPacket(ClientboundDisconnectPacket)
		.addPacket(ClientboundHelloPacket)
		.addPacket(ServerboundHelloPacket)
		.addPacket(ClientboundSystemMessagePacket)
		.addPacket(ClientboundAddEntityPacket)
		.addPacket(ClientboundPlayerInfoUpdatePacket)
		.addPacket(ClientboundPlayerPositionPacket)
		.addPacket(ClientboundPlayerInfoRemovePacket)
		.addPacket(ClientboundRemoveEntitiesPacket);
}