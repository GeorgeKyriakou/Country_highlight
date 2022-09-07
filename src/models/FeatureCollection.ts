import Feature from "./Feature";

type FeatureCollection = {
	features: Array<Feature>;
	type: "FeatureCollection";
};

export default FeatureCollection;
