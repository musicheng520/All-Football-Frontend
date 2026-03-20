import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Select,
    MenuItem,
    Typography,
    Avatar,
    Pagination
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

import NavTabs from "../components/common/NavTabs";
import SectionCard from "../components/common/SectionCard";
import TeamHero from "../components/layout/TeamHero";
import FollowBar from "../components/layout/FollowBar";
import NewsCard from "../components/cards/NewsCard";
import MatchCard from "../components/cards/MatchCard";
import PlayerCard from "../components/cards/PlayerCard";
import TeamSelectorDrawer from "../components/team/TeamSelectorDrawer";
import OverviewCard from "../components/cards/OverviewCard";

import { getMyFollows, followTeam, unfollowTeam } from "../api/follow";
import { getTeamDetail } from "../api/teams";
import { getNewsByTeam } from "../api/news";

import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SecurityIcon from "@mui/icons-material/Security";
import HubIcon from "@mui/icons-material/Hub";
import ShieldIcon from "@mui/icons-material/Shield";

const TABS = ["Overview", "News", "Players", "Matches"];

export default function TeamPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const season = parseInt(searchParams.get("season")) || 2025;

    const [teams, setTeams] = useState([]);
    const [currentTeam, setCurrentTeam] = useState(null);

    const [teamDetail, setTeamDetail] = useState(null);
    const [news, setNews] = useState([]);
    const [fixtures, setFixtures] = useState([]);
    const [squad, setSquad] = useState([]);

    const [tab, setTab] = useState(0);
    const [openDrawer, setOpenDrawer] = useState(false);

    const [matchPage, setMatchPage] = useState(1);
    const matchPageSize = 6;

    // =========================
    // FOLLOWED TEAMS
    // =========================
    const refreshFollows = async () => {
        try {
            const res = await getMyFollows();
            const list = res.data.data || [];
            setTeams(list);

            // 如果当前没有选中的球队，就默认选第一个已关注球队
            if (!currentTeam && list.length > 0) {
                setCurrentTeam(list[0]);
            }
        } catch (err) {
            console.error("load follows failed", err);
        }
    };

    useEffect(() => {
        refreshFollows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // =========================
    // TEAM DETAIL
    // =========================
    useEffect(() => {
        if (!currentTeam) return;

        getTeamDetail(currentTeam.id, season)
            .then(res => {
                const data = res.data.data;
                setTeamDetail(data.team);
                setFixtures(data.fixtures || []);
                setSquad(data.squad || []);
                setMatchPage(1);
            })
            .catch(err => console.error("load team detail failed", err));
    }, [currentTeam, season]);

    // =========================
    // NEWS
    // =========================
    useEffect(() => {
        if (!currentTeam) return;

        getNewsByTeam(currentTeam.id)
            .then(res => setNews(res.data.data || []))
            .catch(err => console.error("load team news failed", err));
    }, [currentTeam]);

    // =========================
    // FOLLOW STATUS / TOGGLE
    // =========================
    const isFollowed = useMemo(() => {
        if (!currentTeam) return false;
        return teams.some(t => t.id === currentTeam.id);
    }, [teams, currentTeam]);

    const handleToggleFollow = async () => {
        if (!currentTeam) return;

        try {
            if (isFollowed) {
                await unfollowTeam(currentTeam.id);
            } else {
                await followTeam(currentTeam.id);
            }

            await refreshFollows();
        } catch (err) {
            console.error("toggle follow failed", err);
        }
    };

    // =========================
    // OVERVIEW STATS（关键修正）
    // 用 fixtures 自己算，不再读不存在的 teamDetail.statistics
    // =========================
    const overviewStats = useMemo(() => {
        const playedMatches = fixtures.filter(f => f.status === "FT");

        let wins = 0;
        let draws = 0;
        let losses = 0;
        let gf = 0;
        let ga = 0;

        playedMatches.forEach(f => {
            const isHome = f.homeTeamId === currentTeam?.id;
            const myScore = isHome ? (f.homeScore ?? 0) : (f.awayScore ?? 0);
            const oppScore = isHome ? (f.awayScore ?? 0) : (f.homeScore ?? 0);

            gf += myScore;
            ga += oppScore;

            if (myScore > oppScore) wins++;
            else if (myScore === oppScore) draws++;
            else losses++;
        });

        return {
            played: playedMatches.length,
            wins,
            draws,
            losses,
            gf,
            ga
        };
    }, [fixtures, currentTeam]);

    // =========================
    // PLAYER GROUPING
    // =========================
    const groupPlayers = (players) => {
        const groups = {
            Goalkeeper: [],
            Defender: [],
            Midfielder: [],
            Attacker: []
        };

        players.forEach(p => {
            if (groups[p.position]) {
                groups[p.position].push(p);
            }
        });

        Object.keys(groups).forEach(key => {
            groups[key].sort(
                (a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0)
            );
        });

        return groups;
    };

    const grouped = groupPlayers(squad);

    const topPlayers = [...squad]
        .sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))
        .slice(0, 5);

    // =========================
    // MATCH PAGINATION
    // =========================
    const paginatedMatches = fixtures.slice(
        (matchPage - 1) * matchPageSize,
        matchPage * matchPageSize
    );

    const totalMatchPages = Math.ceil(fixtures.length / matchPageSize);

    if (!teamDetail) return <div>Loading...</div>;

    return (
        <Box sx={{ px: 4, py: 3 }}>
            {/* HERO */}
            <TeamHero
                team={teamDetail}
                isFollowed={isFollowed}
                onFollow={handleToggleFollow}
            />

            {/* FOLLOW BAR */}
            <FollowBar
                teams={teams}
                currentTeam={currentTeam}
                onSelect={setCurrentTeam}
                onAdd={() => setOpenDrawer(true)}
            />

            {/* TABS */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <NavTabs tabs={TABS} value={tab} onChange={setTab} />

                <Box sx={{ ml: "auto" }}>
                    <Select
                        size="small"
                        value={season}
                        onChange={(e) =>
                            setSearchParams({ season: e.target.value })
                        }
                    >
                        {[2025, 2024, 2023].map(y => (
                            <MenuItem key={y} value={y}>{y}</MenuItem>
                        ))}
                    </Select>
                </Box>
            </Box>

            {/* ========================= */}
            {/* OVERVIEW */}
            {/* ========================= */}
            {tab === 0 && (
                <SectionCard>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr 2.5fr" },
                            gap: 3,
                            alignItems: "stretch"
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                p: 3,
                                borderRadius: 3,
                                background: "#f9fafb"
                            }}
                        >
                            <Typography fontWeight={700} fontSize={18} mb={2}>
                                Club Info
                            </Typography>

                            <Typography fontSize={16} fontWeight={600}>
                                Founded: {teamDetail.founded}
                            </Typography>

                            <Typography fontSize={14} color="text.secondary" mt={1}>
                                Stadium: {teamDetail.venueName}
                            </Typography>

                            <Typography fontSize={14} color="text.secondary" mt={0.5}>
                                City: {teamDetail.venueCity}
                            </Typography>

                            <Typography fontSize={14} color="text.secondary" mt={0.5}>
                                Capacity: {teamDetail.venueCapacity}
                            </Typography>
                        </Box>
                        <OverviewCard stats={overviewStats} />
                    </Box>
                </SectionCard>
            )}

            {/* ========================= */}
            {/* NEWS */}
            {/* ========================= */}
            {tab === 1 && (
                <SectionCard>
                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
                        gap: 2
                    }}>
                        {news.map(n => (
                            <NewsCard key={n.id} item={n} />
                        ))}
                    </Box>
                </SectionCard>
            )}

            {/* ========================= */}
            {/* PLAYERS */}
            {/* ========================= */}
            {tab === 2 && (
                <SectionCard>
                    <Box sx={{ mb: 3 }}>
                        <Typography fontWeight={700} mb={1}>
                            🔥 Top Players
                        </Typography>

                        <Box sx={{ display: "flex", gap: 1, overflowX: "auto" }}>
                            {topPlayers.map(p => (
                                <Box
                                    key={p.id}
                                    sx={{
                                        minWidth: 120,
                                        p: 1.5,
                                        borderRadius: "12px",
                                        background: "#fff",
                                        textAlign: "center",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                                    }}
                                >
                                    <Avatar
                                        src={p.photo}
                                        sx={{ width: 48, height: 48, mx: "auto", mb: 1 }}
                                    />
                                    <Typography fontSize={13} fontWeight={600}>
                                        {p.name}
                                    </Typography>
                                    <Typography fontSize={12} color="gray">
                                        ⭐ {p.rating}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {[
                        ["Goalkeepers", grouped.Goalkeeper, <ShieldIcon />],
                        ["Defenders", grouped.Defender, <SecurityIcon />],
                        ["Midfielders", grouped.Midfielder, <HubIcon />],
                        ["Attackers", grouped.Attacker, <SportsSoccerIcon />]
                    ].map(([title, players, icon]) => (
                        <Box key={title} sx={{ mb: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                {icon}
                                <Typography ml={1} fontWeight={700}>
                                    {title}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                {players.map(p => (
                                    <PlayerCard key={p.id} player={p} />
                                ))}
                            </Box>
                        </Box>
                    ))}
                </SectionCard>
            )}

            {/* ========================= */}
            {/* MATCHES */}
            {/* ========================= */}
            {tab === 3 && (
                <SectionCard>
                    <Box sx={{ display: "grid", gap: 2 }}>
                        {paginatedMatches.map(f => (
                            <MatchCard key={f.id} match={f} />
                        ))}
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                        <Pagination
                            count={totalMatchPages}
                            page={matchPage}
                            onChange={(e, value) => setMatchPage(value)}
                        />
                    </Box>
                </SectionCard>
            )}

            {/* DRAWER */}
            <TeamSelectorDrawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                onSelect={(team) => {
                    setCurrentTeam(team);
                    setOpenDrawer(false);
                }}
            />
        </Box>
    );
}