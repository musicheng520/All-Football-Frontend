import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { motion } from "framer-motion";

import { getNewsList } from "../api/news";
import { getLiveMatches, getRecentMatches, getUpcomingMatches } from "../api/fixtures";
import { getMyFollows } from "../api/follow";

function Home() {

    const [news, setNews] = useState([]);
    const [liveMatches, setLiveMatches] = useState([]);
    const [recentMatches, setRecentMatches] = useState([]);
    const [upcomingMatches, setUpcomingMatches] = useState([]);
    const [followTeams, setFollowTeams] = useState([]);

    const [goalToast, setGoalToast] = useState(null);
    const [loading, setLoading] = useState(true);

    // =========================
    // ✅ INITIAL FETCH（你之前删掉的核心）
    // =========================
    useEffect(() => {

        setLoading(true);

        Promise.all([
            getNewsList(),
            getLiveMatches(),
            getRecentMatches(),
            getUpcomingMatches()
        ])
            .then(([newsRes, liveRes, recentRes, upcomingRes]) => {

                setNews(newsRes?.data?.data || []);
                setLiveMatches(liveRes?.data?.data || []);
                setRecentMatches(recentRes?.data?.data || []);
                setUpcomingMatches(upcomingRes?.data?.data || []);

            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

        getMyFollows()
            .then(res => setFollowTeams(res?.data?.data || []))
            .catch(() => {});

    }, []);

    // =========================
    // ✅ WebSocket（唯一一个！！）
    // =========================
    useEffect(() => {

        const socket = new SockJS("http://localhost:8080/ws");

        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,

            onConnect: () => {
                console.log("✅ WebSocket Connected");

                client.subscribe("/topic/live", (msg) => {

                    const newMatch = JSON.parse(msg.body);
                    const incomingId = newMatch?.fixture?.id;

                    if (!incomingId) return;

                    setLiveMatches(prev => {

                        if (!prev || prev.length === 0) return prev;

                        const prevMatch = prev.find(
                            m => (m.fixture?.id || m.id) === incomingId
                        );

                        // =========================
                        // ⚽ GOAL DETECTION
                        // =========================
                        if (prevMatch) {

                            const oldHome = prevMatch.goals?.home ?? 0;
                            const oldAway = prevMatch.goals?.away ?? 0;

                            const newHome = newMatch.goals?.home ?? oldHome;
                            const newAway = newMatch.goals?.away ?? oldAway;

                            if (oldHome !== newHome || oldAway !== newAway) {

                                const homeName = newMatch.teams?.home?.name || "Home";
                                const awayName = newMatch.teams?.away?.name || "Away";

                                setGoalToast({
                                    text: `⚽ GOAL! ${homeName} ${newHome}-${newAway} ${awayName}`
                                });

                                setTimeout(() => setGoalToast(null), 2500);
                            }
                        }

                        const status = newMatch.fixture?.status?.short;

                        // =========================
                        // ❌ REMOVE FINISHED
                        // =========================
                        if (["FT", "AET", "PEN"].includes(status)) {
                            return prev.filter(m =>
                                (m.fixture?.id || m.id) !== incomingId
                            );
                        }

                        const exists = prev.some(
                            m => (m.fixture?.id || m.id) === incomingId
                        );

                        // =========================
                        // 🆕 ADD NEW LIVE MATCH
                        // =========================
                        if (!exists) {
                            return [newMatch, ...prev];
                        }

                        // =========================
                        // 🔄 UPDATE MATCH
                        // =========================
                        const updated = prev.map(m => {

                            const id = m.fixture?.id || m.id;

                            if (id !== incomingId) return m;

                            return {
                                ...m,
                                fixture: newMatch.fixture || m.fixture,
                                league: newMatch.league || m.league,
                                teams: newMatch.teams || m.teams,
                                goals: newMatch.goals || m.goals,
                                score: newMatch.score || m.score,
                                events: newMatch.events || m.events
                            };
                        });

                        // =========================
                        // ⏱ SORT
                        // =========================
                        return updated.sort((a, b) =>
                            (b.fixture?.timestamp || 0) - (a.fixture?.timestamp || 0)
                        );
                    });

                });
            }
        });

        client.activate();

        return () => client.deactivate();

    }, []);

    // =========================
    // RENDER MATCH
    // =========================
    const renderMatch = (match) => {

        const isNested = !!match.fixture;

        const matchId = isNested ? match.fixture?.id : match.id;

        const home = isNested ? match.teams?.home : {
            id: match.homeTeamId,
            name: match.homeTeamName,
            logo: match.homeTeamLogo
        };

        const away = isNested ? match.teams?.away : {
            id: match.awayTeamId,
            name: match.awayTeamName,
            logo: match.awayTeamLogo
        };

        const homeScore = isNested ? match.goals?.home : match.homeScore;
        const awayScore = isNested ? match.goals?.away : match.awayScore;

        const status = isNested
            ? match.fixture?.status?.short
            : match.status;

        const isLive = ["LIVE", "1H", "2H", "HT", "ET"].includes(status);

        return (
            <motion.div
                key={matchId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom: "1px solid #eee"
                }}
            >

                {/* HOME */}
                <Link to={`/teams/${home?.id}`}
                      style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 220 }}>
                    <img src={home?.logo} width="22" />
                    {home?.name}
                </Link>

                {/* SCORE */}
                <div style={{ textAlign: "center", minWidth: 90 }}>

                    <motion.b
                        key={`${homeScore}-${awayScore}`}
                        initial={{ scale: 1.25 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.25 }}
                        style={{ fontSize: 16, fontWeight: 700 }}
                    >
                        {homeScore ?? "-"} : {awayScore ?? "-"}
                    </motion.b>

                    <motion.div
                        animate={isLive ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
                        transition={{ duration: 1, repeat: isLive ? Infinity : 0 }}
                        style={{
                            fontSize: 12,
                            color: isLive ? "red" : "#666",
                            marginTop: 2
                        }}
                    >
                        {status || "NS"}
                    </motion.div>

                </div>

                {/* AWAY */}
                <Link to={`/teams/${away?.id}`}
                      style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 220 }}>
                    {away?.name}
                    <img src={away?.logo} width="22" />
                </Link>

                {/* VIEW */}
                <Link to={`/matches/${matchId}`}>
                    View
                </Link>

            </motion.div>
        );
    };

    if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

    return (
        <>
            {/* ⚽ GOAL TOAST */}
            {goalToast && (
                <motion.div
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{
                        position: "fixed",
                        top: 20,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#d32f2f",
                        color: "#fff",
                        padding: "12px 22px",
                        borderRadius: 30,
                        fontWeight: 600,
                        zIndex: 9999
                    }}
                >
                    {goalToast.text}
                </motion.div>
            )}

            <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>

                <h2>🔴 Live Matches</h2>
                {liveMatches.length === 0
                    ? <p>No live matches</p>
                    : liveMatches.map(renderMatch)}

                <h2>⏱ Recent Matches</h2>
                {recentMatches.map(renderMatch)}

                <h2>📅 Upcoming Matches</h2>
                {upcomingMatches.map(renderMatch)}

                <h2>📰 News</h2>
                {news.slice(0, 5).map(n => (
                    <div key={n.id}>
                        <Link to={`/news/${n.id}`}>{n.title}</Link>
                    </div>
                ))}

                <h2>⭐ My Teams</h2>
                {followTeams.map(team => (
                    <Link key={team.id} to={`/teams/${team.id}`}>
                        {team.name}
                    </Link>
                ))}

            </div>
        </>
    );
}

export default Home;