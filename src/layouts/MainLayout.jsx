import { Link, Outlet, useNavigate } from "react-router-dom";

function MainLayout() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/");

        window.location.reload();

    };

    return (

        <div>

            <nav style={{ display: "flex", gap: "20px" }}>

                <Link to="/">Home</Link>

                <Link to="/matches">Matches</Link>

                <Link to="/teams">Teams</Link>

                <Link to="/players">Players</Link>

                <Link to="/news">News</Link>

                {!token && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}

                {token && (
                    <>
                        <Link to="/profile">Profile</Link>

                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                )}

            </nav>

            <hr />

            <Outlet />

        </div>

    );
}

export default MainLayout;