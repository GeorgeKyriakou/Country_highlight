import React, { useState } from "react";
import Map from "./components/WorldMap";
import Continents from "./components/CountriesLIst";
import "./App.css";

function App() {
	const [countriesToHighlight, setCountriesToHighlight] = useState([]);

	return (
		<div className="App">
			<header>
				<h1>Utopia Country Highlighter</h1>
				<img src=" https://utopiamusic.com/logo.png" alt="utopia" />
			</header>
			<Continents setCountriesToHighlight={setCountriesToHighlight} />
			<Map countriesToHighlight={countriesToHighlight} />
		</div>
	);
}

export default App;
