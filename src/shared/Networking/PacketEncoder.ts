import {Channel} from "./Channel";
import {Packet} from "./Packets/Packet";
import {ByteBuffer} from "./ByteBuffer";
import {ConnectionProtocol} from "./ConnectionProtocol";
import {Exception} from "../Internal/Exception";

export class PacketEncoder {
	write(channel: Channel, packet: Packet<any>) {
		const buffer = new ByteBuffer();

		this.encode(packet, buffer);

		channel.bufferWrite(buffer);
	}

	private encode(packet: Packet<any>, buffer: ByteBuffer) {
		const packetId = ConnectionProtocol.PACKETS.getID(packet);

		if (packetId === undefined) {
			throw new Exception(`Undefined packet: ${tostring(getmetatable(packet))}`);
		}

		buffer.writeUnsignedInt(packetId);

		try {
			packet.write(buffer);
		} catch (e) {
			if (e instanceof Exception) {
				throw new Exception(e);
			}

			throw new Exception("Uncaught error when writing to packet\n" + e);
		}
	}
}