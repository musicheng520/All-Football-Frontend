import { useEffect, useState } from "react";
import { getTeams } from "../api/teams";
import { Link } from "react-router-dom";

function Teams() {

    const [teams, setTeams] = useState([]);

    const [leagueId, setLeagueId] = useState(39);
    const [page, setPage] = useState(1);

    const leagues = [
        { id: 39, name: "Premier League" },
        { id: 140, name: "La Liga" },
        { id: 78, name: "Bundesliga" },
        { id: 135, name: "Serie A" },
        { id: 61, name: "Ligue 1" }
    ];

    useEffect(() => {

        getTeams({
            leagueId: leagueId,
            season: 2025,
            page: page,
            size: 10
        })
            .then(res => {
                setTeams(res.data.data.records);
            })
            .catch(err => {
                console.error(err);
            });

    }, [leagueId, page]);

    return (
        <div>

            <h1>Teams</h1>

            {/* League Filter */}

            <select
                value={leagueId}
                onChange={(e) => {
                    setLeagueId(e.target.value);
                    setPage(1);
                }}
            >
                {leagues.map(l => (
                    <option key={l.id} value={l.id}>
                        {l.name}
                    </option>
                ))}
            </select>

            {/* Team List */}

            {teams.map(team => (

                <div key={team.id}>

                    <img src={team.logo} width="30" />

                    <Link to={`/teams/${team.id}?season=2025`}>
                        {team.name}
                    </Link>

                </div>

            ))}

            {/* Pagination */}

            <div style={{ marginTop: "20px" }}>

                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Prev
                </button>

                <span style={{ margin: "0 10px" }}>
                    Page {page}
                </span>

                <button
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>

            </div>

        </div>
    );
}

export default Teams;