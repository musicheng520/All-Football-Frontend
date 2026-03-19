import { Box, Typography, Button } from "@mui/material";

export default function TeamHero({ team, isFollowed, onFollow }) {

    return (
        <Box sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg,#b2ff59,#76ff03)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
        }}>

            {/* 左边 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <img src={team.logo} style={{ width: 70 }} />

                <Box>
                    <Typography variant="h5" fontWeight={700}>
                        {team.name}
                    </Typography>
                    <Typography variant="body2">
                        {team.country}
                    </Typography>
                </Box>
            </Box>

            {/* 右边 Follow 按钮 */}
            <Button
                variant={isFollowed ? "contained" : "outlined"}
                onClick={onFollow}
                sx={{
                    borderRadius: 5,
                    px: 3,
                    background: isFollowed ? "#000" : "transparent",
                    color: isFollowed ? "#fff" : "#000",
                    borderColor: "#000",
                    "&:hover": {
                        background: "#000",
                        color: "#fff"
                    }
                }}
            >
                {isFollowed ? "Following" : "Follow"}
            </Button>

        </Box>
    );
}