import {Vehicle} from "./Vehicle";

export class TestVehicle extends Vehicle {
	getSize(): Vector3 {
		return Vector3.one;
	}
}