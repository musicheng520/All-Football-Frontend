import { useEffect, useState } from "react";
import { getProfile } from "../api/auth";
import { getMyFollows } from "../api/follow";
import { Link } from "react-router-dom";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    Stack
} from "@mui/material";

function Profile() {

    const [user, setUser] = useState(null);
    const [teams, setTeams] = useState([]);

    useEffect(() => {

        const fetchUser = async () => {
            try {
                const res = await getProfile();
                setUser(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchFollows = async () => {
            try {
                const res = await getMyFollows();
                setTeams(res.data.data || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUser();
        fetchFollows();

    }, []);

    if (!user) {
        return <Typography sx={{ p: 4 }}>Loading...</Typography>;
    }

    return (

        <Box
            sx={{
                maxWidth: 1000,
                mx: "auto",
                mt: 4,
                px: 2
            }}
        >

            {/* 👤 USER CARD */}
            <Card
                sx={{
                    borderRadius: 4,
                    mb: 3,
                    boxShadow: "0 10px 28px rgba(0,0,0,0.07)"
                }}
            >
                <CardContent
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3
                    }}
                >

                    {/* Avatar */}
                    <Avatar
                        sx={{
                            width: 72,
                            height: 72,
                            fontSize: 28,
                            bgcolor: "#1976d2"
                        }}
                    >
                        {user.username?.[0]?.toUpperCase()}
                    </Avatar>

                    {/* Info */}
                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            {user.username}
                        </Typography>

                        <Typography color="text.secondary">
                            ID: {user.id}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1,
                                display: "inline-block",
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 2,
                                background: "#f1f5f9",
                                fontSize: 12,
                                fontWeight: 600
                            }}
                        >
                            {user.role}
                        </Typography>
                    </Box>

                </CardContent>
            </Card>


            {/* ⭐ FOLLOWED TEAMS */}
            <Card
                sx={{
                    borderRadius: 4,
                    boxShadow: "0 10px 28px rgba(0,0,0,0.07)"
                }}
            >
                <CardContent>

                    <Typography variant="h6" fontWeight={700} mb={2}>
                        ⭐ Followed Teams
                    </Typography>

                    {teams.length === 0 ? (
                        <Typography color="text.secondary">
                            No followed teams.
                        </Typography>
                    ) : (
                        <Stack direction="row" flexWrap="wrap" gap={1.5}>
                            {teams.map(team => (
                                <Chip
                                    key={team.id}
                                    label={team.name}
                                    component={Link}
                                    to={`/teams/${team.id}`}
                                    clickable
                                    sx={{
                                        px: 1,
                                        fontWeight: 500,
                                        borderRadius: 2
                                    }}
                                />
                            ))}
                        </Stack>
                    )}

                </CardContent>
            </Card>

        </Box>
    );
}

export default Profile;