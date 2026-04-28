import { Box, TextField, Paper } from "@mui/material";
import { useState } from "react";


const SearchBar = ({ setKeyword }) => {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 90, // 👈 nằm dưới header
        zIndex: 1000,
        px: 2,
        mt: -3,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 0.5,
          borderRadius: 5,
          width: "96%",       // 👈 thu nhỏ chiều ngang
          minWidth: 250,
        }}
      >
        <TextField
          fullWidth
          placeholder="Tìm kiếm sân..."
          variant="outlined"
          size="small"
          onChange={(e) => setKeyword(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 5,
              fontSize: 14,   // 👈 chữ nhỏ hơn
              height: 36,     // 👈 chiều cao nhỏ
            
            },
          
          }}
          
        />
      </Paper>
    </Box>
  );
};

export default SearchBar;
