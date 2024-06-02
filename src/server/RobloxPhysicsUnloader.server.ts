import {Workspace} from "@rbxts/services";

Workspace.DescendantAdded.Connect(descendant => {
	if (descendant.IsA("BasePart")) {
		descendant.Anchored = true;
	}
})