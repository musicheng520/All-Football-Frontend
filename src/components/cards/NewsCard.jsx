import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NewsCard({ item }) {

    return (
        <Box
            component={Link}
            to={`/news/${item.id}`}
            sx={{
                textDecoration: "none",
                color: "inherit",
                borderRadius: 4,
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                transition: "0.25s",

                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.12)"
                }
            }}
        >
            <img
                src={item.cover}
                style={{
                    width: "100%",
                    height: 150,
                    objectFit: "cover"
                }}
            />

            <Box sx={{ p: 1.5 }}>
                <Typography fontWeight={700} fontSize={14}>
                    {item.title}
                </Typography>
            </Box>
        </Box>
    );
}