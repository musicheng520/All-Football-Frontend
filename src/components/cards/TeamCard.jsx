import { Card, CardContent, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function TeamCard({ team }) {

    return (
        <Card
            component={Link}
            to={`/teams/${team.id}`}
            sx={{
                textDecoration: "none",
                borderRadius: 4,
                height: "100%",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                transition: "0.25s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.12)"
                }
            }}
        >
            <CardContent sx={{ textAlign: "center", width: "100%" }}>

                <Box sx={{
                    width: 64,
                    height: 64,
                    mx: "auto",
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <img
                        src={team.logo}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain"
                        }}
                    />
                </Box>

                <Typography fontWeight={600}>
                    {team.name}
                </Typography>

                <Typography fontSize={12} color="text.secondary">
                    {team.country}
                </Typography>

            </CardContent>
        </Card>
    );
}