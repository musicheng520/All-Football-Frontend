import { Container, Grid, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { getNewsList } from "../api/news";
import NewsCard from "../components/cards/NewsCard";
import { Link } from "react-router-dom";

function News() {

    const [newsList, setNewsList] = useState([]);

    useEffect(() => {
        getNewsList().then(res => {
            setNewsList(res.data.data || []);
        });
    }, []);

    if (!newsList.length) return null;

    const top = newsList[0];
    const rest = newsList.slice(1);

    return (
        <Container sx={{ mt: 4 }}>

            {/* 🔥 HEADLINE */}
            <Link to={`/news/${top.id}`} style={{ textDecoration: "none" }}>
                <Box
                    sx={{
                        mb: 4,
                        borderRadius: 3,
                        overflow: "hidden",
                        position: "relative",
                        height: 320,
                        cursor: "pointer"
                    }}
                >
                    <img
                        src={top.cover}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }}
                    />

                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            p: 3,
                            background: "linear-gradient(transparent, rgba(0,0,0,0.8))"
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{ color: "#fff", fontWeight: 700 }}
                        >
                            {top.title}
                        </Typography>
                    </Box>
                </Box>
            </Link>

            {/* 📰 GRID */}
            <Grid container spacing={3}>
                {rest.map((news) => (
                    <Grid item xs={12} sm={6} md={4} key={news.id}>
                        <NewsCard item={news} />
                    </Grid>
                ))}
            </Grid>

        </Container>
    );
}

export default News;