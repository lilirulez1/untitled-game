import {Client} from "./Client";
import {Workspace} from "@rbxts/services";

const client = new Client();
client.run();

// todo
Workspace.CurrentCamera!.CFrame = new CFrame(0, 20, 0).mul(CFrame.Angles(math.rad(-90), 0, 0));