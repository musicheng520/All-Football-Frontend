import { Box, Typography } from "@mui/material";

export default function NewsCard({ item }) {

    return (
        <Box sx={{
            borderRadius: 2,
            overflow: "hidden",
            cursor: "pointer",
            transition: "0.2s",
            "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
            }
        }}>
            <img src={item.cover} style={{ width: "100%", height: 150, objectFit: "cover" }} />

            <Box sx={{ p: 1 }}>
                <Typography fontWeight={600}>
                    {item.title}
                </Typography>
            </Box>
        </Box>
    );
}