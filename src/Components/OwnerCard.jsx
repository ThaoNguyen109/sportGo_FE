import { Box, Typography } from "@mui/material";

const OwnerCard = ({ title, value, sub, titleColor }) => {
  return (
    <Box
      sx={{
        background: "white",
        borderRadius: 3,
        p: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <Typography
        sx={{
            fontSize: 17,
            color: titleColor || "#18643b", // 👈 mặc định xám
            fontWeight: 600,
        }}
        >
        {title}
      </Typography>

      <Typography fontSize={24} fontWeight="bold" mt={1}>
        {value}
      </Typography>

      <Typography fontSize={12} color="gray">
        {sub}
      </Typography>

      
    </Box>
  );
};

export default OwnerCard;
