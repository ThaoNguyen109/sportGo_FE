import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  Box,
} from "@mui/material";

const FieldCard = ({ name, location, image }) => {
  return (
    <Card
      sx={{
        top: 0 ,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
      }}
    >
      {/* ẢNH */}
      <CardMedia
        component="img"
        image={image || "https://picsum.photos/400/200"}
        alt={name}
        sx={{
          height: 160,
          width: "100%",
          objectFit: "cover",
        }}
      />

      {/* NỘI DUNG */}
      <CardContent>
        <Typography fontWeight="bold" fontSize={16}>
          {name}
        </Typography>

        <Typography fontSize={14} color="gray" mt={0.5}>
          {location}
        </Typography>

        <Box mt={2}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
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
