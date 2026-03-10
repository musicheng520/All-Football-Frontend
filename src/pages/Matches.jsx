import { useEffect, useState } from "react";
import { getFixtures } from "../api/fixtures";
import MatchCard from "../components/MatchCard";

function Matches() {

    const [matches, setMatches] = useState([]);

    useEffect(() => {

        getFixtures({
            leagueId: 140,
            season: 2025,
            page: 1,
            size: 10
        })
            .then((res) => {
                setMatches(res.data.data.records);
            })
            .catch((err) => {
                console.error(err);
            });

    }, []);

    return (
        <div>

            <h1>Matches</h1>

            {matches.map((match) => (
                <MatchCard key={match.id} match={match} />
            ))}

        </div>
    );
}

export default Matches;