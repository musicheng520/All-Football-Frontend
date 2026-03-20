import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function MatchCard({ match }) {

    const {
        id,
        homeTeamName,
        awayTeamName,
        homeTeamLogo,
        awayTeamLogo,
        homeScore,
        awayScore,
        status,
        matchTime
    } = match;

    const formatTime = () => {
        if (!matchTime) return "";
        const [y, m, d, h, min] = matchTime;
        return `${m}/${d} ${h}:${min.toString().padStart(2, "0")}`;
    };

    const isLive = ["LIVE", "1H", "2H", "HT"].includes(status);

    return (
        <Link to={`/matches/${id}`} style={{ textDecoration: "none" }}>
            <Box sx={{
                p: 2,
                borderRadius: 4,
                background: "#fff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "0.25s",

                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.12)"
                }
            }}>

                {/* HOME */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: 150 }}>
                    <img src={homeTeamLogo} style={{ width: 28 }} />
                    <Typography fontWeight={600}>{homeTeamName}</Typography>
                </Box>

                {/* CENTER */}
                <Box sx={{ textAlign: "center" }}>
                    <Typography fontWeight={800} fontSize={18}>
                        {status === "FT"
                            ? `${homeScore} - ${awayScore}`
                            : "vs"}
                    </Typography>

                    <Typography
                        fontSize={12}
                        color={isLive ? "#d32f2f" : "gray"}
                    >
                        {status === "NS" ? formatTime() : status}
                    </Typography>
                </Box>

                {/* AWAY */}
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "flex-end",
                    width: 150
                }}>
                    <Typography fontWeight={600}>{awayTeamName}</Typography>
                    <img src={awayTeamLogo} style={{ width: 28 }} />
                </Box>

            </Box>
        </Link>
    );
}