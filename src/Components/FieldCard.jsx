import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  Box,
  IconButton,
  Chip,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useState } from "react";

const FieldCard = ({
  name,
  location,
  image,
  rating = 4.6,
  distance = "1.2km",
  time = "00:00 - 24:00",
  type = "Đơn ngày",
}) => {
  const [liked, setLiked] = useState(false);

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-4px)",
          transition: "0.3s",
          boxShadow: "0 12px 25px rgba(0,0,0,0.2)",
        }

      }}
    >
      {/* ẢNH + BADGE */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          image={image}
          alt={name}
          sx={{ height: 130 }}
        />

        {/* BADGE */}
        <Chip
          label={type}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            background: "#22c55e",
            color: "white",
            fontSize: 11,
          }}
        />

        {/* RATING */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 80,
            display: "flex",
            alignItems: "center",
            background: "white",
            px: 0.8,
            borderRadius: 2,
            fontSize: 11,
          }}
        >
          <StarIcon sx={{ fontSize: 14, color: "#facc15" }} />
          {rating}
        </Box>

        {/* ❤️ YÊU THÍCH */}
        <IconButton
          onClick={() => setLiked(!liked)}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "white",
            width: 28,
            height: 28,
          }}
        >
          {liked ? (
            <FavoriteIcon fontSize="small" color="error" />
          ) : (
            <FavoriteBorderIcon fontSize="small" />
          )}
        </IconButton>
      </Box>

      {/* CONTENT */}
      <CardContent
  sx={{
    py: 1,
    px: 1.2,
    "&:last-child": { pb: 1 },
  }}
>
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center", // 👈 căn giữa theo chiều dọc
    }}
  >
    {/* 👉 LEFT */}
    <Box>
      <Typography fontWeight="bold" fontSize={13}>
        {name}
      </Typography>

      <Typography fontSize={11} color="gray">
        ({distance}) {location}
      </Typography>

      <Typography fontSize={11} color="gray">
        🕒 {time}
      </Typography>
    </Box>

    {/* 👉 RIGHT */}
    <Button
      variant="outlined"
      color="inherit"
      size="small"
      sx={{
        py: 0.4,
        px: 1.5,
        borderRadius: 2,
        fontSize: 14,
        textTransform: "none",
        minWidth: "auto",
        height: 28, // 👈 giữ button gọn
        background: "#18643b !important",
        color: "white",
        "&:hover": {
          background: "#14532d !important",
        },
      }}
    >
      Đặt lịch
    </Button>
  </Box>
</CardContent>

    </Card>
  );
};

export default FieldCard;
