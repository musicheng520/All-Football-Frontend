import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography
} from "@mui/material";

function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {

            await register({
                username,
                password,
                role: "USER"
            });

            alert("Register success");
            navigate("/login");

        } catch (err) {
            console.error(err);
            alert("Register failed");
        }
    };

    return (
        <Box
            sx={{
                minHeight: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f7fa"
            }}
        >
            <Card
                sx={{
                    width: 380,
                    borderRadius: 4,
                    boxShadow: "0 12px 32px rgba(0,0,0,0.1)"
                }}
            >
                <CardContent sx={{ p: 4 }}>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                        textAlign="center"
                        mb={3}
                    >
                        Create Account
                    </Typography>

                    <TextField
                        fullWidth
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleRegister}
                        sx={{
                            borderRadius: 3,
                            textTransform: "none",
                            fontWeight: 600
                        }}
                    >
                        Register
                    </Button>

                </CardContent>
            </Card>
        </Box>
    );
}

export default Register;