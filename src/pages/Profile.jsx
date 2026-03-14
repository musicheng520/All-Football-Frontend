import { useEffect, useState } from "react";
import { getProfile } from "../api/auth";
import { getMyFollows } from "../api/follow";

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
                setTeams(res.data.data);

            } catch (err) {

                console.error(err);

            }
        };

        fetchUser();
        fetchFollows();

    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (

        <div>

            <h1>Profile</h1>

            <p>ID: {user.id}</p>
            <p>Username: {user.username}</p>
            <p>Role: {user.role}</p>

            <h2>Followed Teams</h2>

            {teams.length === 0 && (
                <p>No followed teams.</p>
            )}

            {teams.map(team => (
                <div key={team.id}>
                    {team.name}
                </div>
            ))}

        </div>
    );
}

export default Profile;