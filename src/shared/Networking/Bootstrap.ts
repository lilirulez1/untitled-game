import {Address} from "./Address";
import {Channel} from "./Channel";
import {ChannelInitializer} from "./ChannelInitializer";
import {ReplicatedStorage} from "@rbxts/services";
import {ChannelPackets} from "./ChannelPackets";

const server = ReplicatedStorage.Server;

export class Bootstrap {
	private channels = new Map<Address, Channel>();
	private childHandler!: ChannelInitializer;

	connect() {
		server.OnClientEvent.Connect((...args: unknown[]) => {
			const receivedPacket = args[0] as ChannelPackets;

			switch (receivedPacket) {
				case ChannelPackets.ACCEPTED: {
					const channelAddress = new Address(args[1] as Address);

					const channel = new Channel(channelAddress);
					this.channels.set(channelAddress, channel);

					channel.connect(server);

					this.childHandler.initializeChannel(channel);
					break;
				}
			}
		});
		server.FireServer(ChannelPackets.CONNECT);
	}

	public setChildHandler(initializer: ChannelInitializer) {
		this.childHandler = initializer;
		return this;
	}
}