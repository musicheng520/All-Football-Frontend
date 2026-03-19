import { Box, Typography } from "@mui/material";

export default function OverviewCard({ stats }) {

    const Item = ({ label, value }) => (
        <Box sx={{ textAlign: "center" }}>
            <Typography fontSize={20} fontWeight={700}>
                {value}
            </Typography>
            <Typography fontSize={12} color="gray">
                {label}
            </Typography>
        </Box>
    );

    return (
        <Box sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 2
        }}>
            <Item label="Played" value={stats.played} />
            <Item label="Wins" value={stats.wins} />
            <Item label="Draws" value={stats.draws} />
            <Item label="Losses" value={stats.losses} />
            <Item label="Goals" value={`${stats.gf} : ${stats.ga}`} />
            <Item label="Win Rate" value={`${stats.winRate}%`} />
        </Box>
    );
}