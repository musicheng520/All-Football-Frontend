import { Box, Typography, Card, CardContent } from "@mui/material";

import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PercentIcon from "@mui/icons-material/Percent";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import CancelIcon from "@mui/icons-material/Cancel";

export default function OverviewCard({ stats = {} }) {

    const played = stats.played || 0;
    const wins = stats.wins || 0;
    const draws = stats.draws || 0;
    const losses = stats.losses || 0;
    const gf = stats.gf || 0;
    const ga = stats.ga || 0;

    const winRate = played ? Math.round((wins / played) * 100) : 0;

    const Item = ({ label, value, icon, highlight }) => (
        <Box sx={{
            textAlign: "center",
            p: 2,
            borderRadius: 3,
            background: highlight ? "#1976d2" : "#f5f5f5",
            color: highlight ? "#fff" : "inherit"
        }}>
            <Box mb={0.5}>{icon}</Box>

            <Typography fontSize={18} fontWeight={700}>
                {value}
            </Typography>

            <Typography fontSize={12} opacity={0.7}>
                {label}
            </Typography>
        </Box>
    );

    return (
        <Card sx={{
            borderRadius: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
        }}>
            <CardContent>

                <Typography fontWeight={700} mb={2}>
                    Team Overview
                </Typography>

                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: 2
                }}>

                    <Item label="Played" value={played} icon={<SportsSoccerIcon />} />
                    <Item label="Wins" value={wins} icon={<EmojiEventsIcon />} />
                    <Item label="Draws" value={draws} icon={<ShowChartIcon />} />
                    <Item label="Losses" value={losses} icon={<CancelIcon />} />
                    <Item label="Goals" value={`${gf} : ${ga}`} icon={<ScoreboardIcon />} />

                    <Item
                        label="Win Rate"
                        value={`${winRate}%`}
                        icon={<PercentIcon />}
                        highlight
                    />

                </Box>

            </CardContent>
        </Card>
    );
}