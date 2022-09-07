type Feature = {
	geometry: { type: string; coordinates: Array<Array<Number>> };
	id: string;
	properties: { name: string };
	total: number;
	type: "Feature";
};

export default Feature;
