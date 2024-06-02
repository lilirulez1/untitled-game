import {ByteBuffer} from "./ByteBuffer";
import {Players, RunService} from "@rbxts/services";
import {Packet} from "./Packets/Packet";
import {Consumer} from "../Internal/Consumer";
import {Future} from "../Internal/Future";
import {Address} from "./Address";
import {Connection} from "./Connection";
import {ChannelPackets} from "./ChannelPackets";
import {PacketDecoder} from "./PacketDecoder";
import {PacketEncoder} from "./PacketEncoder";
import {Exception} from "../Internal/Exception";
import {Conekt} from "../Conekt";

export class Channel {
	private conekt = new Conekt();

	private channelHandler!: Connection;
	private player!: Player;

	private encoder = new PacketEncoder();
	private decoder = new PacketDecoder();

	private remote!: RemoteEvent;

	private closed = false;

	private listener?: Consumer<Future>;

	constructor(private address: Address) {}

	getAddress() {
		return this.address;
	}

	write(packet: Packet<any>) {
		try {
			this.encoder.write(this, packet);
		} catch (e) {
			if (e instanceof Exception) {
				throw new Exception(e);
			}

			throw new Exception("Uncaught error when writing to packet\n" + e);
		}
	}

	bufferWrite(buffer: ByteBuffer) {
		if (RunService.IsClient()) {
			this.remote.FireServer(ChannelPackets.PACKET, this.address, buffer.buffer);
		} else {
			if (!this.player) return;
			this.remote.FireClient(this.player, ChannelPackets.PACKET, this.address, buffer.buffer);
		}
		if (this.listener) {
			this.listener(new Future().wasSuccess());
			this.listener = undefined;
		}
	}

	close() {
		if (this.closed) return;
		this.closed = true;

		this.conekt.cleanup();
	}

	connect(remote: RemoteEvent, player?: Player) {
		this.remote = remote;
		this.player = player ?? Players.LocalPlayer;

		this.conekt.add(this.player.GetPropertyChangedSignal("Parent").Connect(() => {
			this.close();
		}))

		if (RunService.IsClient()) {
			this.conekt.add(this.remote.OnClientEvent.Connect((...args: unknown[]) => {
				this.bind(...args);
			}))
		} else {
			this.conekt.add(this.remote.OnServerEvent.Connect((_player, ...args: unknown[]) => {
				this.bind(...args);
			}))
		}
	}

	setHandler(handler: Connection) {
		handler.channelActive(this);
		this.channelHandler = handler;
	}

	addListener(callback: Consumer<Future>) {
		this.listener = callback;
	}

	isOpen() {
		return !this.closed;
	}

	getPlayer() {
		return this.player;
	}

	private bind(...args: unknown[]) {
		if (!this.channelHandler) return;
		if (args[0] !== ChannelPackets.PACKET) return;
		if (this.address.rawAddress !== (args[1] as Address).rawAddress) return;

		const buffer = new ByteBuffer(args[2] as buffer);
		const packet = this.decoder.read(buffer);

		this.channelHandler.channelRead(packet);
	}
}