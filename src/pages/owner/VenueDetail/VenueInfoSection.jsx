import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import axiosClient from "../../../api/axiosClient";


const VenueInfoSection = ({ 
  selectedVenue,
  setSelectedVenue,
 }) => {

  const [openEdit, setOpenEdit] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
 const [previewImage, setPreviewImage] = useState(null);


  const [formData, setFormData] = useState({
    name: selectedVenue.name || "",
    address: selectedVenue.address || "",
    phone: selectedVenue.phone || "",
    description: selectedVenue.description || "",
    
  });

  const handleOpenEdit = () => {
    setFormData({
      name: selectedVenue.name || "",
      address: selectedVenue.address || "",
      phone: selectedVenue.phone || "",
      description: selectedVenue.description || "",
    });
    setCoverImage(null);

      if (selectedVenue.image) {
        setPreviewImage(
          `http://localhost:8000/storage/${selectedVenue.image}`
        );
      } else {
        setPreviewImage(null);
      }
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setCoverImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {

      const data = new FormData();

      data.append("name", formData.name);
      data.append("address", formData.address);
      data.append("phone", formData.phone);
      data.append("description", formData.description);

      // if (coverImage) {
      //   data.append("image", coverImage);
      // }

      const response = await axiosClient.post(
        `/owner/courts/${selectedVenue.id}?_method=PUT`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSelectedVenue(response.data.data);

      setOpenEdit(false);

    } catch (error) {

      console.log(error.response?.data);

    }

};
  return (
    <>
      
      <Box
        sx={{
          background: "white",
          borderRadius: 3,
          p: 3,
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize:20, color:"#095f26" }}>Thông tin địa điểm</Typography>

          <Button
            variant="contained"
            onClick={handleOpenEdit}
            sx={{
              textTransform: "none",
              background: "#22c55e",
              color: "white",
              "&:hover": { background: "#16a34a" },
              
            }}
          >
            Chỉnh sửa thông tin
          </Button>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 1, fontSize:18, color:"#095f26"  }}>Thông tin cơ bản</Typography>

            <Typography sx={{ fontSize: 15, color: "#000000" }}>Tên địa điểm</Typography>
            <Box sx={{ background: "#f1f5f9", p: 1, borderRadius: 1, mb: 2 }}>
              {selectedVenue.name}
            </Box>

            <Typography sx={{ fontSize: 15, color: "#000000" }}>Địa chỉ</Typography>
            <Box sx={{ background: "#f1f5f9", p: 1, borderRadius: 1 , mb: 2 }}>
              {selectedVenue.address}
            </Box>

            <Typography sx={{ fontSize: 15, color: "#000000"}}>Số điện thoại</Typography>
            <Box sx={{ background: "#f1f5f9", p: 1, borderRadius: 1 , mb: 2 }}>
              {selectedVenue.phone}
            </Box>

            <Typography sx={{ fontSize: 15, color: "#000000" }}>Mô tả</Typography>
            <Box sx={{ background: "#f1f5f9", p: 1, borderRadius: 1 , mb: 2 }}>
              {selectedVenue.description}
            </Box>

          </Box>

        
        </Box>
      </Box>

      {openEdit && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <Box
            sx={{
              width: 650,
              
              background: "#fff",
              borderRadius: 3,
              p: 3,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600, fontSize: 18, mb: 1, color: "#207d42", textAlign: "center",fontweight: 600 ,
              }}
            >
              Chỉnh sửa thông tin địa điểm
            </Typography>

            <Typography sx={{ mb: 1 }}>
              Tên địa điểm
            </Typography>

            <TextField
              fullWidth
              height="30px"
              name="name"
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 1 }}
            />

            <Typography sx={{ mb: 1 }}>
              Địa chỉ
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={1}
              name="address"
              value={formData.address}
              onChange={handleChange}
              sx={{ mb: 1 }}
            />
            <Typography sx={{ mb: 1 }}>
              Số điện thoại
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={1}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              sx={{ mb: 1 }}
            />
            <Typography sx={{ mb: 1 }}>
              Mô tả
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            

            {/* <Typography sx={{ mb: 1 }}>
              Ảnh bìa sân
            </Typography>

            <TextField
              fullWidth
              type="file"
              inputProps={{
                accept: "image/*",
              }}
              onChange={handleImageChange}
              sx={{ mb: 2 }}
            />

            {previewImage && (
              <Box
                component="img"
                src={previewImage}
                alt="Ảnh bìa"
                sx={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  borderRadius: 2,
                  border: "1px solid #e5e7eb",
                  mb: 1,
                }}
              />
            )} */}

            

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCloseEdit}
                sx={{
                  fontsize :"10px", 
                  background: "#e71212 !important",
                  backgroundColor: "#e71212 !important",
                  color: "#f8f8f8 !important",
                  boxShadow: "none !important",
                  border: "none",

                    "&:hover": {
                      background: "#a10a0a !important",
                      boxShadow: "none",
                    },
                }}
              >
                Hủy
              </Button>

              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  background: "#22c55e",
                  "&:hover": {
                    background: "#16a34a",
                  },
                }}
              >
                Lưu
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default VenueInfoSection;
