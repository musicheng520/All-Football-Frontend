import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import { getNewsDetail } from "../api/newsApi";

const NewsDetail = () => {

    const { id } = useParams();

    const [news, setNews] = useState(null);

    useEffect(() => {

        const fetchNews = async () => {
            const res = await getNewsDetail(id);
            setNews(res.data.data);
        };

        fetchNews();

    }, [id]);

    if (!news) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>

            <Typography variant="h4" gutterBottom>
                {news.title}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {news.createdAt}
            </Typography>

            {news.imageUrl && (
                <Box
                    component="img"
                    src={news.imageUrl}
                    alt={news.title}
                    sx={{ width: "100%", borderRadius: 2, mb: 3 }}
                />
            )}

            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {news.content}
            </Typography>

        </Container>
    );
};

export default NewsDetail;