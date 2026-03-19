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

    return (
        <Link
            to={`/matches/${id}`}   // 🔥 保持你原来的路由
            style={{ textDecoration: "none" }}
        >
            <Box
                sx={{
                    p: 2,
                    borderRadius: 3,
                    background: "#fff",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "0.2s",

                    "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                    }
                }}
            >

                {/* HOME */}
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    width: 140
                }}>
                    <img src={homeTeamLogo} style={{ width: 28 }} />
                    <Typography fontWeight={600} fontSize={14}>
                        {homeTeamName}
                    </Typography>
                </Box>

                {/* CENTER */}
                <Box sx={{
                    textAlign: "center",
                    minWidth: 120
                }}>
                    <Typography fontWeight={700} fontSize={16}>
                        {status === "FT"
                            ? `${homeScore} - ${awayScore}`
                            : "vs"}
                    </Typography>

                    <Typography fontSize={12} color="gray">
                        {status === "NS" ? formatTime() : status}
                    </Typography>
                </Box>

                {/* AWAY */}
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "flex-end",
                    width: 140
                }}>
                    <Typography fontWeight={600} fontSize={14}>
                        {awayTeamName}
                    </Typography>
                    <img src={awayTeamLogo} style={{ width: 28 }} />
                </Box>

            </Box>
        </Link>
    );
}