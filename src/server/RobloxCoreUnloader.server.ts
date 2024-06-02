import {Players, StarterPlayer} from "@rbxts/services";

StarterPlayer.FindFirstChild("StarterPlayerScripts")!.GetChildren().forEach(descendant => {
	if (descendant.IsA("BaseScript")) {
		descendant.Destroy();
	} else if (descendant.IsA("ModuleScript")) {
		descendant.Destroy();
	}
});

const characterAddedMap = new Map<Player, RBXScriptConnection>();

Players.PlayerAdded.Connect(player => {
	characterAddedMap.set(player, player.CharacterAdded.Connect(character => {
		player.PlayerGui.WaitForChild("Freecam").Destroy();
	}));
});

Players.PlayerRemoving.Connect(player => {
	const connection = characterAddedMap.get(player)

	if (connection) {
		connection.Disconnect();
		characterAddedMap.delete(player);
	}
})