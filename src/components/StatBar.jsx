import { useEffect, useState, useRef } from "react";
import { Box, Typography } from "@mui/material";

function StatBar({ label, home, away, version }) {

    const [homeVal, setHomeVal] = useState(0);
    const [awayVal, setAwayVal] = useState(0);

    const raf = useRef(null);

    useEffect(() => {

        let start = null;

        const animate = (t) => {
            if (!start) start = t;

            const progress = t - start;
            const percent = Math.min(progress / 800, 1);

            setHomeVal(home * percent);
            setAwayVal(away * percent);

            if (percent < 1) {
                raf.current = requestAnimationFrame(animate);
            }
        };

        cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(raf.current);

    }, [home, away, version]);

    const total = home + away || 1;

    return (
        <Box sx={{ mb: 3 }}>

            <Typography textAlign="center" mb={1}>
                {label}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography width={40}>
                    {Math.round(homeVal)}
                </Typography>

                <Box sx={{
                    flex: 1,
                    mx: 2,
                    height: 6,
                    background: "#eee",
                    borderRadius: 5
                }}>
                    <Box sx={{
                        width: `${(homeVal / total) * 100}%`,
                        height: "100%",
                        background: "linear-gradient(90deg,#1976d2,#42a5f5)",
                        transition: "width 0.8s ease"
                    }} />
                </Box>

                <Typography width={40} textAlign="right">
                    {Math.round(awayVal)}
                </Typography>
            </Box>

        </Box>
    );
}

export default StatBar;