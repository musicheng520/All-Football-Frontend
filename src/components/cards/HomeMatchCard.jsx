import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function HomeMatchCard({ match }) {

    const isNested = !!match.fixture;

    const matchId = isNested ? match.fixture?.id : match.id;

    const home = isNested ? match.teams?.home : {
        name: match.homeTeamName,
        logo: match.homeTeamLogo
    };

    const away = isNested ? match.teams?.away : {
        name: match.awayTeamName,
        logo: match.awayTeamLogo
    };

    const homeScore = isNested ? match.goals?.home : match.homeScore;
    const awayScore = isNested ? match.goals?.away : match.awayScore;

    const status = isNested
        ? match.fixture?.status?.short
        : match.status;

    const isLive = ["LIVE", "1H", "2H", "HT"].includes(status);

    return (
        <Link
            to={`/matches/${matchId}`}
            style={{ textDecoration: "none", color: "inherit" }}
        >
            <Box sx={{
                p: 1.8,
                borderRadius: 4,
                background: "#fff",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                transition: "0.25s",

                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.12)"
                }
            }}>

                {/* LEFT */}
                <Box sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    minWidth: 0
                }}>
                    <img src={home?.logo} style={{ width: 22, height: 22 }} />

                    <Typography
                        fontWeight={600}
                        fontSize={13}
                        noWrap
                        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                        {home?.name}
                    </Typography>
                </Box>

                {/* CENTER */}
                <Box sx={{
                    width: 70,
                    textAlign: "center",
                    flexShrink: 0
                }}>
                    <Typography fontWeight={700} fontSize={14}>
                        {homeScore ?? "-"} : {awayScore ?? "-"}
                    </Typography>

                    <Typography
                        fontSize={11}
                        color={isLive ? "#d32f2f" : "#666"}
                    >
                        {status || "NS"}
                    </Typography>
                </Box>

                {/* RIGHT */}
                <Box sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 1,
                    minWidth: 0
                }}>
                    <Typography
                        fontWeight={600}
                        fontSize={13}
                        noWrap
                        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                        {away?.name}
                    </Typography>

                    <img src={away?.logo} style={{ width: 22, height: 22 }} />
                </Box>

            </Box>
        </Link>
    );
}