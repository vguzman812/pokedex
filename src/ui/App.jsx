import { useState, useEffect, useCallback } from "react";
import hardtack from "hardtack";
import Pokemon from "./Pokemon.jsx";
import Search from "./Search.jsx";
import api from "../utils/api.js";

const App = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [searchString, setSearchString] = useState(
        () => hardtack.get("searchString") || ""
    );
    const [pokemons, setPokemons] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        api.getPokemons()
            .then(setPokemons)
            .catch((err) => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    const handleSearchChange = useCallback((event) => {
        const value = event.currentTarget.value.toLowerCase().trim();
        hardtack.set("searchString", value, { maxAge: "31536000" });
        setSearchString(value);
    }, []);

    const filteredPokemons = pokemons.filter((p) =>
        p.name.includes(searchString)
    );

    return (
        <div className="page">
            {error && <div className="page__error">{error}</div>}

            <div className="page__search">
                <Search
                    onChange={handleSearchChange}
                    value={searchString}
                />
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul className="pokemons">
                    {filteredPokemons.map((pokemon) => (
                        <li
                            className="pokemons__item"
                            key={pokemon.id}
                        >
                            <Pokemon pokemon={pokemon} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default App;
