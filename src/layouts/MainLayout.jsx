import { Link, Outlet } from "react-router-dom";

function MainLayout() {
    return (
        <div>

            <nav style={{ display: "flex", gap: "20px" }}>
                <Link to="/">Home</Link>
                <Link to="/matches">Matches</Link>
                <Link to="/teams">Teams</Link>
                <Link to="/players">Players</Link>
                <Link to="/news">News</Link>
            </nav>

            <hr />

            <Outlet />

        </div>
    );
}

export default MainLayout;