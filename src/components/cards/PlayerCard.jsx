import { Box, Typography, Avatar, Chip } from "@mui/material";
import { Link } from "react-router-dom";

export default function PlayerCard({ player }) {

    const rating = parseFloat(player.rating) || 0;

    return (
        <Box
            component={Link}
            to={`/players/${player.id}`}
            sx={{
                textDecoration: "none",
                color: "inherit",
                "&:visited": { color: "inherit" },
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                borderRadius: "14px",
                background: "#fff",
                boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
                cursor: "pointer",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.1)"
                }
            }}
        >

            {/* 左侧 */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar src={player.photo} sx={{ width: 44, height: 44 }} />

                <Box ml={1.5}>
                    <Typography fontWeight={600}>
                        {player.name}
                    </Typography>

                    <Typography fontSize={12} color="gray">
                        #{player.number} · {player.nationality || "Unknown"}
                    </Typography>
                </Box>
            </Box>

            {/* 右侧 */}
            <Box sx={{ display: "flex", gap: 1 }}>
                <Chip label={`⚽ ${player.goals || 0}`} size="small" />
                <Chip label={`🎯 ${player.assists || 0}`} size="small" />
                <Chip label={`🏃 ${player.appearances || 0}`} size="small" />

                {rating > 0 && (
                    <Chip
                        label={`⭐ ${rating.toFixed(1)}`}
                        size="small"
                        color={rating >= 7.5 ? "success" : "default"}
                    />
                )}
            </Box>

        </Box>
    );
}