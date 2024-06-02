import {Channel} from "./Channel";

export abstract class ChannelInitializer {
	abstract initializeChannel(channel: Channel): void;
}
