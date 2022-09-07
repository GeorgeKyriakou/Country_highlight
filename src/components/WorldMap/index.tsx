import React, { memo, SVGProps, useEffect, useRef } from "react";
import * as d3 from "d3";
import FeatureCollection from "../../models/FeatureCollection";
const specialCharacters = new RegExp(/@"[,]+"/);

const drawMap = (mapRef: SVGSVGElement) => {
	const svg = d3.select(mapRef),
		width = +svg.attr("width"),
		height = +svg.attr("height");

	const projection = d3
		.geoMercator()
		.scale(70)
		.center([0, 20])
		.translate([width / 2, height / 2]);

	let data = new Map();
	const colorScale = d3
		.scaleThreshold()
		.domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
		.range(d3.schemeBlues[7] as unknown as number[]);

	Promise.all([
		d3.json(
			"https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
		),
		d3.csv(
			"https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv",
			(d) => {
				return data.set(d.code, d.pop && +d.pop);
			}
		),
	]).then((loadData) => {
		const topo = loadData[0] as FeatureCollection;

		svg
			.append("g")
			.selectAll("path")
			.data(topo.features)
			.join("path")
			.attr("d", d3.geoPath().projection(projection) as any)
			.attr("fill", function (d) {
				d.total = data.get(d.id) || 0;
				return colorScale(d.total);
			})
			.attr("id", (d) => d.properties.name.replaceAll(",", ""))
			.attr("class", () => "Country")
			.style("opacity", 0.8);
	});
};

const WorldMapWrapper = ({
	countriesToHighlight,
}: {
	countriesToHighlight: string[];
}) => {
	const mapRef = useRef<SVGSVGElement | null>(null);

	useEffect(() => {
		if (mapRef.current === null) return;

		drawMap(mapRef.current);
	}, [mapRef]);

	useEffect(() => {
		if (countriesToHighlight.length === 0) {
			d3.selectAll(".Country").transition().duration(100).style("opacity", 1);
			return;
		}
		d3.selectAll(".Country").transition().duration(100).style("opacity", 0.2);
		countriesToHighlight.forEach((country) => {
			country = country.replaceAll(/[^\w\s]/gi, "");
			// Some countries have different names in the data coming from the two sources (Utopia country db and where D3 map chart
			// gets its data)
			// For example, United Kingdom of Great Britain and Northern Ireland, will not show on the map
			// because the data coming for visualizing the map use the name 'England' instead.
			// A normalization layer of both data would probably fix this, but for this task it adds complexity that
			// does not make too much sense.
			const fromMap = d3.select(`#${country.split(" ").join("")}`) || null;
			if (!fromMap) return;
			fromMap
				.transition()
				.duration(100)
				.style("opacity", 1)
				.attr("fill", (d) => "#e3127e");
		});
	}, [countriesToHighlight]);

	return (
		<div className="map">
			<svg ref={mapRef} width="1200" height="500"></svg>
		</div>
	);
};

export default memo(WorldMapWrapper);
