import { useEffect, useState } from "react";
import { Box, Select, MenuItem } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import NavTabs from "../components/common/NavTabs";
import SectionCard from "../components/common/SectionCard";
import TeamHero from "../components/layout/TeamHero";
import FollowBar from "../components/layout/FollowBar";

import NewsCard from "../components/cards/NewsCard";
import MatchCard from "../components/cards/MatchCard";
import PlayerCard from "../components/cards/PlayerCard";
import OverviewCard from "../components/cards/OverviewCard";

import TeamSelectorDrawer from "../components/team/TeamSelectorDrawer";

import { getMyFollows } from "../api/follow";
import { getTeamDetail } from "../api/teams";
import { getNewsByTeam } from "../api/news";

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

    // ⭐ 分页
    const [page, setPage] = useState(1);
    const pageSize = 6;

    // ================= 获取关注 =================
    useEffect(() => {
        getMyFollows().then(res => {
            const list = res.data.data || [];
            setTeams(list);
            if (list.length > 0) setCurrentTeam(list[0]);
        });
    }, []);

    // ================= 获取球队 =================
    useEffect(() => {
        if (!currentTeam) return;

        getTeamDetail(currentTeam.id, season)
            .then(res => {
                const data = res.data.data;
                setTeamDetail(data.team);
                setFixtures(data.fixtures || []);
                setSquad(data.squad || []);
            });

    }, [currentTeam, season]);

    // ================= 获取新闻 =================
    useEffect(() => {
        if (!currentTeam) return;

        getNewsByTeam(currentTeam.id)
            .then(res => setNews(res.data.data || []));

    }, [currentTeam]);

    // ⭐ 切换 tab / 球队 重置分页
    useEffect(() => {
        setPage(1);
    }, [tab, currentTeam]);

    // ================= Follow 逻辑 =================
    const isFollowed = teams.some(t => t.id === currentTeam?.id);

    const handleFollow = () => {
        if (!currentTeam) return;

        if (isFollowed) {
            // 取消关注
            setTeams(prev => prev.filter(t => t.id !== currentTeam.id));
        } else {
            // 添加关注
            setTeams(prev => [...prev, currentTeam]);
        }
    };

    // ================= stats =================
    const stats = (() => {
        const played = fixtures.filter(f => f.status === "FT");

        let wins = 0, draws = 0, losses = 0;
        let gf = 0, ga = 0;

        played.forEach(f => {
            const isHome = f.homeTeamId === currentTeam?.id;

            const myScore = isHome ? f.homeScore : f.awayScore;
            const oppScore = isHome ? f.awayScore : f.homeScore;

            gf += myScore || 0;
            ga += oppScore || 0;

            if (myScore > oppScore) wins++;
            else if (myScore === oppScore) draws++;
            else losses++;
        });

        return {
            played: played.length,
            wins,
            draws,
            losses,
            gf,
            ga,
            winRate: played.length ? Math.round((wins / played.length) * 100) : 0
        };
    })();

    // ================= 分页 =================
    const paginatedMatches = fixtures.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const totalPages = Math.ceil(fixtures.length / pageSize);

    if (!teamDetail) return <div>Loading...</div>;

    return (
        <Box sx={{ px: 4, py: 3 }}>

            {/* HERO + FOLLOW */}
            <TeamHero
                team={teamDetail}
                isFollowed={isFollowed}
                onFollow={handleFollow}
            />

            {/* FOLLOW BAR */}
            <FollowBar
                teams={teams}
                currentTeam={currentTeam}
                onSelect={setCurrentTeam}
                onAdd={() => setOpenDrawer(true)}
            />

            {/* TABS + SEASON */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <NavTabs tabs={TABS} value={tab} onChange={setTab} />

                <Box sx={{ ml: "auto" }}>
                    <Select
                        size="small"
                        value={season}
                        onChange={(e) => setSearchParams({ season: e.target.value })}
                    >
                        {[2025, 2024, 2023].map(y => (
                            <MenuItem key={y} value={y}>{y}</MenuItem>
                        ))}
                    </Select>
                </Box>
            </Box>

            {/* ================= OVERVIEW ================= */}
            {tab === 0 && (
                <SectionCard>
                    <OverviewCard stats={stats} />
                </SectionCard>
            )}

            {/* ================= NEWS ================= */}
            {tab === 1 && (
                <SectionCard>

                    {news[0] && (
                        <Box sx={{
                            mb: 3,
                            borderRadius: 3,
                            overflow: "hidden",
                            height: 260,
                            position: "relative"
                        }}>
                            <img
                                src={news[0].cover}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />

                            <Box sx={{
                                position: "absolute",
                                bottom: 0,
                                p: 2,
                                width: "100%",
                                background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                                color: "#fff",
                                fontWeight: 600
                            }}>
                                {news[0].title}
                            </Box>
                        </Box>
                    )}

                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
                        gap: 2
                    }}>
                        {news.slice(1).map(n => (
                            <NewsCard key={n.id} item={n} />
                        ))}
                    </Box>

                </SectionCard>
            )}

            {/* ================= PLAYERS ================= */}
            {tab === 2 && (
                <SectionCard>
                    <Box sx={{ display: "grid", gap: 2 }}>
                        {squad.map(p => (
                            <PlayerCard key={p.id} player={p} />
                        ))}
                    </Box>
                </SectionCard>
            )}

            {/* ================= MATCHES ================= */}
            {tab === 3 && (
                <SectionCard>

                    <Box sx={{ display: "grid", gap: 2 }}>
                        {paginatedMatches.map(f => (
                            <MatchCard key={f.id} match={f} />
                        ))}
                    </Box>

                    <Box sx={{
                        mt: 3,
                        display: "flex",
                        justifyContent: "center",
                        gap: 1
                    }}>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <Box
                                key={i}
                                onClick={() => setPage(i + 1)}
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    background: page === i + 1 ? "#b2ff59" : "#f5f5f5",
                                    transition: "0.2s",
                                    "&:hover": {
                                        background: "#dcedc8"
                                    }
                                }}
                            >
                                {i + 1}
                            </Box>
                        ))}
                    </Box>

                </SectionCard>
            )}

            {/* DRAWER */}
            <TeamSelectorDrawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                onSelect={setCurrentTeam}
            />

        </Box>
    );
}