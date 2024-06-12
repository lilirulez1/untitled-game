import {ClientPacketListener} from "./ClientPacketListener";
import {Packet} from "./Packet";
import {ByteBuffer} from "../ByteBuffer";
import {ServerPlayer} from "../../../server/Level/ServerPlayer";
import {Profile} from "../../Profile";
import {Players} from "@rbxts/services";

class Entry {
	constructor(private readonly uuid: string, private readonly profile: Profile) {}

	getUuid() {
		return this.uuid;
	}

	getProfile() {
		return this.profile;
	}
}

class Action {
	static readonly ADD_PLAYER = new Action((entryBuilder, byteBuffer) => {
		entryBuilder.profile = new Profile(Players.GetPlayerByUserId(tonumber(byteBuffer.readString())!)!);
	}, (byteBuffer, entry) => {
		byteBuffer.writeString(entry.getUuid());
	}, "ADD_PLAYER");

	constructor(
		readonly reader: (entryBuilder: EntryBuilder, byteBuffer: ByteBuffer) => void,
		readonly writer: (byteBuffer: ByteBuffer, entry: Entry) => void,
		readonly name: string
	) {}
}

class EntryBuilder {
	profile!: Profile;

	constructor(readonly uuid: string) {}

	build() {
		return new Entry(this.uuid, this.profile);
	}
}

export class ClientboundPlayerInfoUpdatePacket implements Packet<ClientPacketListener> {
	private readonly actions = new Array<Action>();
	private readonly entries = new Array<Entry>();

	constructor(param1: ByteBuffer | Action[], players: Set<ServerPlayer>) {
		if (param1 instanceof ByteBuffer) {
			this.actions = param1.readArray(byteBuffer => {
				return Action[byteBuffer.readString() as keyof typeof Action];
			});

			this.entries = param1.readArray(byteBuffer => {
				const entryBuilder = new EntryBuilder(byteBuffer.readString());

				this.actions.forEach(action => {
					action.reader(entryBuilder, byteBuffer);
				})

				return entryBuilder.build();
			});
		} else {
			this.actions = param1;
			players.forEach(player => {
				this.entries.push(new Entry(player.getUuid(), new Profile(player.getPlayer())));
			})
		}
	}

	static createPlayerInitializing(players: Set<ServerPlayer>) {
		return new ClientboundPlayerInfoUpdatePacket([Action.ADD_PLAYER], players);
	}

	handle(listener: ClientPacketListener) {
		listener.handlePlayerInfoUpdate(this);
	}

	write(byteBuffer: ByteBuffer) {
		byteBuffer.writeArray(this.actions, (byteBuffer, action) => {
			byteBuffer.writeString(action.name);
		});

		byteBuffer.writeArray(this.entries, (byteBuffer, entry) => {
			byteBuffer.writeString(entry.getUuid());

			this.actions.forEach(action => {
				action.writer(byteBuffer, entry);
			})
		});
	}

	getActions() {
		return this.actions;
	}

	getNewEntries() {
		return this.actions.includes(Action.ADD_PLAYER) ? this.entries : [];
	}

	getEntries() {
		return this.entries;
	}
}