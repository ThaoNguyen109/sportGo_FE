import { useRef } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const VenueImagesSection = ({
  coverImage,
  setCoverImage,
  images,
  setImages,
}) => {
  const coverInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleCoverUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverImage(URL.createObjectURL(file));
    }
    event.target.value = "";
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImages((prev) => [
        ...prev,
        { src: imageUrl, alt: file.name },
      ]);
    }
    event.target.value = "";
  };

  return (
    <Box
      sx={{
        background: "white",
        borderRadius: 3,
        p: 3,
        mb: 3,
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography sx={{ fontWeight: 600, color: "#111827" }}>Hình ảnh</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => imageInputRef.current?.click()}
          sx={{
            textTransform: "none",
            background: "#22c55e",
            "&:hover": { background: "#16a34a" },
          }}
        >
          Thêm hình ảnh
        </Button>
      </Box>

      <Box
        sx={{
          mb: 3,
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          minHeight: 200,
          background: coverImage ? `url(${coverImage}) center/cover no-repeat` : "#f8fafc",
          border: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          p: 3,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            color: coverImage ? "white" : "#111827",
            textShadow: coverImage ? "0 0 8px rgba(0,0,0,0.45)" : "none",
          }}
        >
          Ảnh bìa
        </Typography>
        <Box>
          <Button
            variant="contained"
            onClick={() => coverInputRef.current?.click()}
            sx={{
              textTransform: "none",
              background: "#22c55e",
              color: "white",
              mr: 2,
              "&:hover": { background: "#16a34a" },
            }}
          >
            Thêm ảnh bìa
          </Button>
          
        </Box>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={coverInputRef}
          onChange={handleCoverUpload}
        />
        <input
          type="file"
          accept="image/*"
          hidden
          ref={imageInputRef}
          onChange={handleImageUpload}
        />
      </Box>


      <Box
        sx={{
          border: "1px solid #e2e8f0",
          display: "flex",
          borderRadius: 2,
          p: 2,
          gap: 2,
        }}
      >

        
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
        {images.map((image, index) => (
          <Box key={index} sx={{ position: "relative" }}>
            <Box
              component="img"
              src={image.src}
              alt={image.alt}
              sx={{ width: "100%", borderRadius: 2, objectFit: "cover", minHeight: 180 }}
            />
            <IconButton
              size="small"
              color="error"
              onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "rgba(255, 255, 255, 0.9)",
                color: "#dc2626",
                "&:hover": { background: "rgba(255, 255, 255, 1)" },
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>

      </Box>
    </Box>
  );
};

export default VenueImagesSection;
