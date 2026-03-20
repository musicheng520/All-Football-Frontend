import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    Tabs,
    Tab,
    Box,
    Chip,
    Typography,
    Card,
    CardContent,
    Divider,
    Stack
} from "@mui/material";

import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SportsIcon from "@mui/icons-material/Sports";
import PercentIcon from "@mui/icons-material/Percent";
import FlagIcon from "@mui/icons-material/Flag";
import WarningIcon from "@mui/icons-material/Warning";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { getFixtureDetail } from "../api/fixtures";
import { connectSocket, disconnectSocket } from "../utils/socket";

function MatchDetail() {

    const { id } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);

    // =========================
    // INITIAL LOAD
    // =========================
    useEffect(() => {
        setLoading(true);

        getFixtureDetail(id)
            .then(res => setData(res.data.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

    }, [id]);

    // =========================
    // LIVE SOCKET
    // =========================
    useEffect(() => {

        if (!id) return;

        connectSocket(id, (wsData) => {

            setData(prev => {

                if (!prev) return prev;

                return {
                    ...prev,
                    fixture: wsData.fixture || prev.fixture,
                    events: wsData.events || prev.events
                };
            });

        });

        return () => disconnectSocket();

    }, [id]);

    // =========================
    // HELPERS
    // =========================
    const formatTime = (t) => {
        if (!t || t.length < 5) return "TBD";
        return `${t[0]}-${t[1]}-${t[2]} ${t[3]}:${t[4]}`;
    };

    const isLive = (status) => {
        return ["LIVE", "1H", "2H"].includes(status);
    };

    const getStatusChip = (status) => {

        if (isLive(status)) {
            return <Chip label="LIVE" color="error" size="small" />;
        }

        if (status === "FT") {
            return <Chip label="FT" color="success" size="small" />;
        }

        if (status === "NS") {
            return <Chip label="UPCOMING" size="small" />;
        }

        return <Chip label={status} size="small" />;
    };

    const deduplicateEvents = (events = []) => {
        const seen = new Set();

        return events.filter(e => {
            const key = `${e.minute}-${e.playerId}-${e.type}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    };

    // =========================
    // EVENTS
    // =========================
    const renderEvents = (events, homeId) => {

        if (!events || events.length === 0) {
            return <Typography>No events yet</Typography>;
        }

        return deduplicateEvents(events)
            .sort((a, b) => a.minute - b.minute)
            .map((e, i) => {

                const isHome = e.teamId === homeId;

                return (
                    <Box
                        key={i}
                        sx={{
                            display: "flex",
                            justifyContent: isHome ? "flex-start" : "flex-end",
                            mb: 2
                        }}
                    >
                        <Card sx={{
                            maxWidth: "65%",
                            borderRadius: 3,
                            background: "#f9fafb"
                        }}>
                            <CardContent>
                                <Typography fontWeight={600}>
                                    {e.minute}' {e.type}
                                </Typography>

                                <Typography fontSize={14}>
                                    {e.playerName}
                                </Typography>

                                {e.assistPlayerName && (
                                    <Typography fontSize={12} color="text.secondary">
                                        Assist: {e.assistPlayerName}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                );
            });
    };

    // =========================
    // STATS（已优化）
    // =========================
    const statMeta = {
        shotsTotal: { label: "Shots", icon: <SportsSoccerIcon /> },
        shotsOnTarget: { label: "On Target", icon: <SportsIcon /> },
        possession: { label: "Possession", icon: <PercentIcon /> },
        fouls: { label: "Fouls", icon: <WarningIcon /> },
        corners: { label: "Corners", icon: <FlagIcon /> },
        yellowCards: { label: "Cards", icon: <AccessTimeIcon /> },
        offsides: { label: "Offsides", icon: <AccessTimeIcon /> }
    };

    const renderStats = (stats) => {

        if (!stats || !stats.home || !stats.away) {
            return <Typography>No statistics available</Typography>;
        }

        return (
            <Box sx={{ mt: 2 }}>
                {Object.keys(statMeta).map(key => {

                    const meta = statMeta[key];
                    const homeVal = stats.home[key] || 0;
                    const awayVal = stats.away[key] || 0;
                    const total = homeVal + awayVal || 1;

                    return (
                        <Box key={key} sx={{ mb: 3 }}>

                            {/* 标题 */}
                            <Box sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 1,
                                mb: 1,
                                color: "#1976d2"
                            }}>
                                {meta.icon}
                                <Typography fontWeight={600}>
                                    {meta.label}
                                </Typography>
                            </Box>

                            {/* 数值 + 进度条 */}
                            <Box sx={{
                                display: "flex",
                                alignItems: "center"
                            }}>

                                <Typography width={40}>{homeVal}</Typography>

                                <Box sx={{
                                    flex: 1,
                                    mx: 2,
                                    height: 6,
                                    borderRadius: 5,
                                    background: "#eee",
                                    overflow: "hidden"
                                }}>
                                    <Box sx={{
                                        width: `${(homeVal / total) * 100}%`,
                                        height: "100%",
                                        background: "#1976d2"
                                    }} />
                                </Box>

                                <Typography width={40} textAlign="right">
                                    {awayVal}
                                </Typography>

                            </Box>

                        </Box>
                    );
                })}
            </Box>
        );
    };

    // =========================
    // LINEUP
    // =========================
    const renderLineup = (lineup, teamName, status) => {

        if (!lineup) return <Typography>{teamName}: No lineup</Typography>;

        if (!lineup.startingXI?.length) {

            if (status === "NS") return <Typography>{teamName}: Not started</Typography>;
            if (isLive(status)) return <Typography>{teamName}: Loading lineup...</Typography>;

            return <Typography>{teamName}: No data</Typography>;
        }

        return (
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6">{teamName} ({lineup.formation})</Typography>
                <Typography fontSize={14} color="text.secondary">
                    Coach: {lineup.coach}
                </Typography>

                <Typography mt={1}>Starting XI</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                    {lineup.startingXI.map(p => (
                        <Chip key={p.playerId} label={p.playerName} />
                    ))}
                </Stack>

                <Typography mt={2}>Substitutes</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                    {lineup.substitutes.map(p => (
                        <Chip key={p.playerId} label={p.playerName} variant="outlined" />
                    ))}
                </Stack>
            </Box>
        );
    };

    // =========================
    // STATE
    // =========================
    if (loading) return <Typography>Loading...</Typography>;
    if (!data) return <Typography>No data</Typography>;

    const { fixture, homeTeam, awayTeam, events, statistics } = data;

    return (

        <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>

            {/* HEADER */}
            <Card sx={{ borderRadius: 4, mb: 3 }}>
                <CardContent>

                    <Typography textAlign="center" fontWeight={600}>
                        {fixture.round}
                    </Typography>

                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2
                    }}>

                        {/* HOME */}
                        <Box textAlign="center">
                            <Box
                                component="img"
                                src={homeTeam.logo}
                                sx={{ width: 60, height: 60, objectFit: "contain" }}
                            />
                            <Typography mt={1}>{homeTeam.name}</Typography>
                        </Box>

                        {/* SCORE */}
                        <Box textAlign="center">
                            <Typography variant="h3" fontWeight={700}>
                                {fixture.homeScore} : {fixture.awayScore}
                            </Typography>
                            <Box mt={1}>
                                {getStatusChip(fixture.status)}
                            </Box>
                        </Box>

                        {/* AWAY */}
                        <Box textAlign="center">
                            <Box
                                component="img"
                                src={awayTeam.logo}
                                sx={{ width: 60, height: 60, objectFit: "contain" }}
                            />
                            <Typography mt={1}>{awayTeam.name}</Typography>
                        </Box>

                    </Box>

                    <Typography textAlign="center" mt={2} color="text.secondary">
                        {formatTime(fixture.matchTime)} | {fixture.venue}
                    </Typography>

                </CardContent>
            </Card>

            {/* TABS */}
            <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
                <Tab label="Overview" />
                <Tab label="Events" />
                <Tab label="Stats" />
                <Tab label="Lineups" />
            </Tabs>

            {/* CONTENT */}
            <Box sx={{ mt: 3 }}>

                {tab === 0 && (
                    <Card>
                        <CardContent>
                            <Typography>Status: {fixture.status}</Typography>
                            <Typography>Referee: {fixture.referee}</Typography>
                            <Typography>Venue: {fixture.venue}</Typography>
                        </CardContent>
                    </Card>
                )}

                {tab === 1 && renderEvents(events, fixture.homeTeamId)}

                {tab === 2 && renderStats(statistics)}

                {tab === 3 && (
                    <>
                        {renderLineup(data.homeLineup, homeTeam.name, fixture.status)}
                        {renderLineup(data.awayLineup, awayTeam.name, fixture.status)}
                    </>
                )}

            </Box>

        </Box>
    );
}

export default MatchDetail;