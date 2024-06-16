import {Workspace} from "@rbxts/services";

export class DebugRenderer {
	private wireframes = new Map<number, WireframeHandleAdornment>();

	getColor(color: Color3): WireframeHandleAdornment {
		const currentWireframe = this.wireframes.get(color.R * color.G * color.B);
		if (currentWireframe) {
			return currentWireframe;
		}

		const wireframe = new Instance("WireframeHandleAdornment");
		wireframe.Parent = Workspace.CurrentCamera;
		wireframe.Adornee = Workspace;
		wireframe.Color3 = color;

		this.wireframes.set(color.R * color.G * color.B, wireframe);
		return wireframe;
	}

	clear() {
		this.wireframes.forEach(wireframe => wireframe.Clear());
	}
}