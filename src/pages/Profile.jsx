import { useEffect, useState } from "react";
import { getProfile } from "../api/auth";

function Profile() {

    const [user, setUser] = useState(null);

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const res = await getProfile();

                setUser(res.data.data);

            } catch (err) {

                console.error(err);

            }
        };

        fetchUser();

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

        </div>
    );
}

export default Profile;