import { useEffect, useState } from "react";
import {
    Box,
    Drawer,
    Typography,
    Select,
    MenuItem,
    TextField
} from "@mui/material";

import { getTeams } from "../../api/teams";

const leagues = [
    { id: 39, name: "Premier League" },
    { id: 140, name: "La Liga" },
    { id: 78, name: "Bundesliga" },
    { id: 135, name: "Serie A" },
    { id: 61, name: "Ligue 1" }
];

export default function TeamSelectorDrawer({ open, onClose, onSelect }) {

    const [leagueId, setLeagueId] = useState(61);
    const [teams, setTeams] = useState([]);
    const [keyword, setKeyword] = useState("");

    // 获取球队
    useEffect(() => {
        getTeams({
            leagueId,
            season: 2025,
            size: 100
        }).then(res => {
            setTeams(res.data.data.records || []);
        });
    }, [leagueId]);

    // 🔍 搜索过滤
    const filteredTeams = teams.filter(t =>
        t.name.toLowerCase().includes(keyword.toLowerCase())
    );

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 320, p: 2 }}>

                <Typography variant="h6" mb={2}>
                    Select Team
                </Typography>

                {/* 联赛选择 */}
                <Select
                    fullWidth
                    value={leagueId}
                    onChange={(e) => setLeagueId(e.target.value)}
                    sx={{ mb: 2 }}
                >
                    {leagues.map(l => (
                        <MenuItem key={l.id} value={l.id}>
                            {l.name}
                        </MenuItem>
                    ))}
                </Select>

                {/* 🔍 搜索框 */}
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search teams..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {/* 列表 */}
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    maxHeight: "70vh",
                    overflowY: "auto"
                }}>

                    {filteredTeams.length === 0 && (
                        <Typography fontSize={14} color="gray">
                            No teams found
                        </Typography>
                    )}

                    {filteredTeams.map(team => (
                        <Box
                            key={team.id}
                            onClick={() => {
                                onSelect(team);
                                onClose();
                            }}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                p: 1.5,
                                borderRadius: 2,
                                cursor: "pointer",
                                transition: "0.2s",

                                "&:hover": {
                                    background: "#f5f5f5"
                                }
                            }}
                        >
                            <img src={team.logo} width={28} />
                            <Typography fontWeight={500}>
                                {team.name}
                            </Typography>
                        </Box>
                    ))}

                </Box>

            </Box>
        </Drawer>
    );
}