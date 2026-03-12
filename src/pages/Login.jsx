import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {

        try {

            const res = await login({
                username,
                password
            });

            const token = res.data.data;

            localStorage.setItem("token", token);

            navigate("/profile");

        } catch (err) {

            console.error(err);
            alert("Login failed");

        }
    };

    return (

        <div>

            <h1>Login</h1>

            <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>
                Login
            </button>

        </div>
    );
}

export default Login;