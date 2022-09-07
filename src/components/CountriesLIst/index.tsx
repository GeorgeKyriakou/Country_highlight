import React, { useEffect, useMemo, useState } from "react";
import { Country } from "../../models/Country";
import "./style.css";

interface Props {
	setCountriesToHighlight: Function;
}

const CountreisList: React.FC<Props> = ({ setCountriesToHighlight }) => {
	const [countries, setCountries] = useState<Country[]>([]);
	const [selectedContinents, setSelectedContinents] = useState<string[]>([]);

	useEffect(() => {
		const fetchCountriesData = async () => {
			const response = await fetch(
				"https://api.countries.code-test.utopiamusic.com/all"
			);
			const data = await response.json();
			setCountries(data);
		};
		fetchCountriesData();
	}, []);

	const continents = useMemo(() => {
		const continent = new Set(countries.map((c: Country) => c.continent));
		return Array.from(continent);
	}, [countries]);

	const countriesToDisplay = useMemo(() => {
		return selectedContinents.flatMap((continent) =>
			countries.filter((country) => country.continent === continent)
		);
	}, [selectedContinents]);

	const handleContinentClick = (
		e: React.MouseEvent<HTMLLIElement, MouseEvent>
	) => {
		e.stopPropagation();
		const element = e.target as HTMLLIElement;
		const continent = element.innerText;
		element.classList.contains("pink")
			? element.classList.remove("pink")
			: element.classList.add("pink");

		setSelectedContinents((selected) => {
			const i = selected.indexOf(continent);
			if (i == -1) return [...selected, continent];
			return selected.filter((c) => c !== continent);
		});
	};
	const handleHighlightCountry = (
		e: React.MouseEvent<HTMLLIElement, MouseEvent>
	) => {
		e.stopPropagation();
		const element = e.target as HTMLLIElement;
		const country = element.innerText;
		element.classList.contains("pink")
			? element.classList.remove("pink")
			: element.classList.add("pink");
		setCountriesToHighlight((selected: string[]) => {
			const i = selected.indexOf(country);
			if (i == -1) return [...selected, country];
			return selected.filter((c) => c !== country);
		});
	};

	return (
		<div>
			<ul>
				{continents.map((continent, i) => (
					<li
						className="continent"
						onClick={handleContinentClick}
						key={`continent_${i}`}
					>
						{continent}
					</li>
				))}
			</ul>
			<ul>
				{countriesToDisplay.map((country, j) => (
					<li onClick={handleHighlightCountry} key={`country_${j}`}>
						{country.name}
					</li>
				))}
			</ul>
		</div>
	);
};

export default CountreisList;
