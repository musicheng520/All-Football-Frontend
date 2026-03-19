import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function FollowBar({ teams, currentTeam, onSelect, onAdd }) {

    return (
        <Box sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            overflowX: "auto"
        }}>
            {teams.map(team => (
                <Box
                    key={team.id}
                    onClick={() => onSelect(team)}
                    sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        background: currentTeam?.id === team.id ? "#dcedc8" : "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "0.2s",
                        "&:hover": { transform: "scale(1.1)" }
                    }}
                >
                    <img src={team.logo} style={{ width: "70%" }} />
                </Box>
            ))}

            {/* ➕ */}
            <Box
                onClick={onAdd}
                sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    border: "2px dashed #ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer"
                }}
            >
                <AddIcon />
            </Box>

        </Box>
    );
}