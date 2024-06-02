import {ReplicatedStorage} from "@rbxts/services";
import {ChannelInitializer} from "../../shared/Networking/ChannelInitializer";
import {Address} from "../../shared/Networking/Address";
import {Channel} from "../../shared/Networking/Channel";
import {ChannelPackets} from "../../shared/Networking/ChannelPackets";

const server = ReplicatedStorage.Server;

export class ServerBootstrap {
	private static readonly RANDOM: Random = new Random();

	private channels = new Map<Address, Channel>();
	private childHandler!: ChannelInitializer;

	setChildHandler(initializer: ChannelInitializer) {
		this.childHandler = initializer;
		return this;
	}

	bind() {
		server.OnServerEvent.Connect((player, ...args) => {
			const receivedPacket = args[0] as ChannelPackets;

			switch (receivedPacket) {
				case ChannelPackets.CONNECT: {
					const address = this.generateAddress();

					const channel = new Channel(address);
					this.channels.set(address, channel);

					channel.connect(server, player);

					server.FireClient(player, ChannelPackets.ACCEPTED, address);

					this.childHandler.initializeChannel(channel);
					break;
				}
			}
		})
	}

	private generateAddress() {
		const address = new Array<number>(4);

		address[0] = ServerBootstrap.RANDOM.NextInteger(0, 255);
		address[1] = ServerBootstrap.RANDOM.NextInteger(0, 255);
		address[2] = ServerBootstrap.RANDOM.NextInteger(0, 255);
		address[3] = ServerBootstrap.RANDOM.NextInteger(0, 255);

		return new Address(address);
	}
}