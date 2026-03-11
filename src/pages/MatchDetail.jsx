import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFixtureDetail } from "../api/fixtures";

function MatchDetail() {

    const { id } = useParams();

    const [match, setMatch] = useState(null);

    useEffect(() => {

        getFixtureDetail(id)
            .then((res) => {
                setMatch(res.data.data);
            })
            .catch((err) => {
                console.error(err);
            });

    }, [id]);

    if (!match) {
        return <div>Loading...</div>;
    }

    const fixture = match.fixture;
    const homeTeam = match.homeTeam;
    const awayTeam = match.awayTeam;

    return (
        <div>

            <h1>Match Detail</h1>

            <h2>
                {homeTeam.name} vs {awayTeam.name}
            </h2>

            <p>
                Score: {fixture.homeScore ?? "-"} : {fixture.awayScore ?? "-"}
            </p>

            <p>Status: {fixture.status}</p>

            <p>Venue: {fixture.venue}</p>

            <p>Referee: {fixture.referee ?? "Unknown"}</p>

        </div>
    );
}

export default MatchDetail;