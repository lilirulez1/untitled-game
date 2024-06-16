import {Vehicle} from "./Vehicle";
import {LookupTable} from "../Internal/LookupTable";

export class TestVehicle extends Vehicle {
	options = {
		mass: 1615,
		dimensions: {
			frontalArea: 2.01,
			frictionCoefficient: .35,
			wheelbase: 2.7,
			frontAxle: 1.35,
			rearAxle: 1.35,
			centreOfGravityHeight: .46
		},
		wheels: {
			rollingResistance: this.getDragConstant() * 30,
			tireFrictionCoefficient: 1.5,
			wheelRadius: .34
		},
		engine: {
			gearRatios: {
				1: 2.29,
				2: 1.61,
				3: 1.21,
				4: 1,
				5: .82,
				reverse: 2.7,
				differentialRatio: 3.42,
			},
			torqueTable: new LookupTable()
				.add(2200, 150)
				.add(2400, 600)
				.add(3000, 680)
				.add(3800, 700)
				.add(5252, 640)
				.add(6000, 580)
				.add(6500, 530)
				.add(6600, 450),
			transmissionEfficiency: .7
		}
	}
}