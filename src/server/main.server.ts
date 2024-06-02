import {Server} from "./Server";

const server = Server.start((thread) => {
	return new Server(thread);
});