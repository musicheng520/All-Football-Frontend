import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";

import { Tabs, Tab, Select, MenuItem } from "@mui/material";

import { getPlayerDetail } from "../api/players";
import { getNewsByPlayer } from "../api/news";

function PlayerDetail() {

    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const seasonParam = searchParams.get("season") || 2025;

    const [season, setSeason] = useState(Number(seasonParam));

    const [player, setPlayer] = useState(null);
    const [team, setTeam] = useState(null);
    const [statistics, setStatistics] = useState(null);

    const [news, setNews] = useState([]);

    const [tab, setTab] = useState(0);



    useEffect(() => {

        getPlayerDetail(id, season)
            .then((res) => {

                const data = res.data.data;

                setPlayer(data.player);
                setTeam(data.team);
                setStatistics(data.statistics?.[0] || null);

            })
            .catch((err) => {
                console.error(err);
            });

    }, [id, season]);



    useEffect(() => {

        getNewsByPlayer(id)
            .then((res) => {

                setNews(res.data.data || []);

            })
            .catch((err) => {
                console.error(err);
            });

    }, [id]);



    const handleSeasonChange = (value) => {

        setSeason(value);

        setSearchParams({
            season: value
        });

    };



    if (!player) {
        return <div>Loading...</div>;
    }



    return (

        <div style={{ padding: 20 }}>


            {/* Header */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20
                }}
            >

                <img
                    src={player.photo}
                    width="100"
                />

                <div>

                    <h1 style={{ margin: 0 }}>
                        {player.name}
                    </h1>

                    <div style={{ color: "#666" }}>
                        Age: {player.age}
                    </div>

                    {team && (

                        <Link
                            to={`/teams/${team.id}`}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                textDecoration: "none",
                                color: "inherit"
                            }}
                        >

                            <img src={team.logo} width="20"/>

                            {team.name}

                        </Link>

                    )}

                </div>


                {/* Season Switch */}

                <div style={{ marginLeft: "auto" }}>

                    <Select
                        size="small"
                        value={season}
                        onChange={(e) => handleSeasonChange(e.target.value)}
                    >

                        <MenuItem value={2025}>2025</MenuItem>
                        <MenuItem value={2024}>2024</MenuItem>
                        <MenuItem value={2023}>2023</MenuItem>
                        <MenuItem value={2022}>2022</MenuItem>

                    </Select>

                </div>

            </div>



            {/* Tabs */}

            <div style={{ marginTop: 30 }}>

                <Tabs
                    value={tab}
                    onChange={(e, v) => setTab(v)}
                >

                    <Tab label="Overview"/>
                    <Tab label="Stats"/>
                    <Tab label="News"/>
                    <Tab label="Transfers"/>

                </Tabs>

            </div>



            {/* Overview */}

            {tab === 0 && (

                <div style={{ marginTop: 20 }}>

                    <h3>Player Info</h3>

                    <p>Name: {player.name}</p>

                    <p>Age: {player.age}</p>

                    {player.height && (
                        <p>Height: {player.height}</p>
                    )}

                    {player.weight && (
                        <p>Weight: {player.weight}</p>
                    )}

                    {player.nationality && (
                        <p>Nationality: {player.nationality}</p>
                    )}

                    {player.birthDate && (
                        <p>Birth Date: {player.birthDate}</p>
                    )}

                </div>

            )}



            {/* Stats */}

            {tab === 1 && (

                <div style={{ marginTop: 20 }}>

                    <h3>Season Statistics</h3>

                    {!statistics && (
                        <p>No statistics available.</p>
                    )}

                    {statistics && (

                        <table
                            style={{
                                borderCollapse: "collapse",
                                width: "100%",
                                maxWidth: 500
                            }}
                        >

                            <tbody>

                            <tr>
                                <td>Appearances</td>
                                <td>{statistics.appearances}</td>
                            </tr>

                            <tr>
                                <td>Goals</td>
                                <td>{statistics.goals}</td>
                            </tr>

                            <tr>
                                <td>Assists</td>
                                <td>{statistics.assists}</td>
                            </tr>

                            <tr>
                                <td>Yellow Cards</td>
                                <td>{statistics.yellowCards}</td>
                            </tr>

                            <tr>
                                <td>Red Cards</td>
                                <td>{statistics.redCards}</td>
                            </tr>

                            <tr>
                                <td>Rating</td>
                                <td>{statistics.rating}</td>
                            </tr>

                            </tbody>

                        </table>

                    )}

                </div>

            )}



            {/* News */}

            {tab === 2 && (

                <div style={{ marginTop: 20 }}>

                    <h3>Player News</h3>

                    {news.length === 0 && (
                        <p>No news available.</p>
                    )}

                    {news.map((n) => (

                        <div
                            key={n.id}
                            style={{
                                borderBottom: "1px solid #eee",
                                padding: "12px 0"
                            }}
                        >

                            <Link
                                to={`/news/${n.id}`}
                                style={{
                                    fontWeight: "bold",
                                    textDecoration: "none"
                                }}
                            >
                                {n.title}
                            </Link>

                            <div style={{ fontSize: 13, color: "#666" }}>
                                {n.createdAt?.slice(0, 10)}
                            </div>

                        </div>

                    ))}

                </div>

            )}



            {/* Transfers / Injuries */}

            {tab === 3 && (

                <div style={{ marginTop: 20 }}>

                    <h3>Transfers / Injuries</h3>

                    <p>
                        Player transfer history and injury records
                        will be available soon.
                    </p>

                </div>

            )}

        </div>

    );

}

export default PlayerDetail;