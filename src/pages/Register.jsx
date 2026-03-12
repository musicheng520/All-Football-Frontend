import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";

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

        <div>

            <h1>Register</h1>

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

            <button onClick={handleRegister}>
                Register
            </button>

        </div>
    );
}

export default Register;