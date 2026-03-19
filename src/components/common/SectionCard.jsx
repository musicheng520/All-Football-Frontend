import { Box } from "@mui/material";

export default function SectionCard({ children }) {
    return (
        <Box sx={{
            p: 2,
            borderRadius: 3,
            background: "#fff",
            boxShadow: "0 6px 18px rgba(0,0,0,0.05)"
        }}>
            {children}
        </Box>
    );
}