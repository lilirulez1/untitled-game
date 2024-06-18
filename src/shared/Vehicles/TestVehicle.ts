import {Vehicle, VehicleOptions} from "./Vehicle";

export class TestVehicle extends Vehicle {
	getVehicleOptions(): VehicleOptions {
		return {
			mass: 1400,
			inertia: 1400,

			wheelbase: 2.5,
			size: new Vector3(2, 2, 3),

			wheelLength: 0.3,
			wheelWidth: 0.2,

			centreOfMassHeight: 0.55,
			rearAxleDistance: 1.25,
			frontAxleDistance: 1.25
		}
	}
}