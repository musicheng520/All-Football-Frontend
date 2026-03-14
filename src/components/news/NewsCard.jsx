import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NewsCard = ({ news }) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/news/${news.id}`);
    };

    return (
        <Card
            sx={{
                maxWidth: 345,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.03)" }
            }}
            onClick={handleClick}
        >
            <CardMedia
                component="img"
                height="180"
                image={news.imageUrl || "/placeholder-news.jpg"}
                alt={news.title}
            />

            <CardContent>

                <Typography gutterBottom variant="h6">
                    {news.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    {news.summary || "Click to read more..."}
                </Typography>

            </CardContent>
        </Card>
    );
};

export default NewsCard;