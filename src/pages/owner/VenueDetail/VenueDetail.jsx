import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import OwnerLayout from "../../../Layouts/OwnerLayout";
import { Box, Typography, Button, Switch } from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import VenueInfoSection from "./VenueInfoSection";
import VenueServicesSection from "./VenueServicesSection";
import VenueImagesSection from "./VenueImagesSection";
import VenueCourtsSection from "./VenueCourtsSection";

import { useEffect } from "react";
import axiosClient from "../../../api/axiosClient";

const VenueDetail = () => {
  const { id } = useParams();
  const venueId = Number(id) || 103;

  
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchVenueDetail = async () => {
      try {
        setLoading(true);

        const res = await axiosClient.get(
          `/owner/courts/${venueId}`
        );

        console.log("Chi tiết cụm sân:", res.data);

        setSelectedVenue(res.data.data);

      } catch (error) {
        console.log("Lỗi lấy chi tiết sân:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueDetail();
  }, [venueId]);


  const [activeTab, setActiveTab] = useState("Thông tin chung");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourtName, setNewCourtName] = useState("");
  const [newCourtPrices, setNewCourtPrices] = useState({
    T2: "200k",
    T3: "200k",
    T4: "200k",
    T5: "200k",
    T6: "200k",
    T7: "220k",
    CN: "250k",
  });
  const [newCourtHours, setNewCourtHours] = useState({
    T2: "06:00-22:00",
    T3: "06:00-22:00",
    T4: "06:00-22:00",
    T5: "06:00-22:00",
    T6: "06:00-22:00",
    T7: "06:00-22:00",
    CN: "08:00-20:00",
  });
  const [editCourtIndex, setEditCourtIndex] = useState(null);
  const [editCourtName, setEditCourtName] = useState("");
  const [editCourtActive, setEditCourtActive] = useState(true);
  const [editCourtPrices, setEditCourtPrices] = useState({
    T2: "200k",
    T3: "200k",
    T4: "200k",
    T5: "200k",
    T6: "200k",
    T7: "220k",
    CN: "250k",
  });
  const [editCourtHours, setEditCourtHours] = useState({
    T2: "06:00-22:00",
    T3: "06:00-22:00",
    T4: "06:00-22:00",
    T5: "06:00-22:00",
    T6: "06:00-22:00",
    T7: "06:00-22:00",
    CN: "08:00-20:00",
  });
  const addCourtRef = useRef(null);

  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState("");
  const [services, setServices] = useState([]);

  const [images, setImages] = useState([]);
  const [coverImage, setCoverImage] = useState(null);

  const [courts, setCourts] = useState([]);

  useEffect(() => {
    if (selectedVenue) {

      setServices(selectedVenue.services || []);

      setImages(selectedVenue.images || []);

      setCoverImage(selectedVenue.image || null);

      setCourts(selectedVenue.fields || []);
    }
  }, [selectedVenue]);

  if (loading || !selectedVenue) {
    return (
      <OwnerLayout>
        <Typography>Đang tải dữ liệu...</Typography>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>

      
      <Box
        sx={{
          mt: 1,
          height: "180px",
          background: coverImage
            ? `url(${coverImage}) center/cover no-repeat`
            : "#ffffff",
          borderRadius: 3,
          p: 0,
          mb: 2,
          color: coverImage ? "white" : "white",
          borderColor: "#188238",
        }}
      >

      {/* HEADER */}
      <Box sx={{ mt: 8, mb: 3 }}>
        <Typography sx= {{fontSize :24, fontWeight :700,color: "#1ea14e" }}>
          {selectedVenue.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <LocationOn fontSize="small" sx={{ color: "#e11f2c" }} />
          <Typography sx={{ fontSize: 14,fontWeight: 550, color: "#949c98" }}>
            {selectedVenue.address}
          </Typography>
        </Box>

        {/* ACTION */}
        <Box mt={2} display="flex" alignItems="center" gap={2}>
          <Switch defaultChecked color="success" />
          <Button
            sx={{
              background: "#22c55e",
              color: "white",
              textTransform: "none",
              "&:hover": { background: "#16a34a" },
            }}
          >
            Xóa
          </Button>
        </Box>
      </Box>
      </Box>

      {/* TAB */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          background: "#f1f5f9",
          p: 1,
          borderRadius: 2,
          mb: 3,
        }}
      >
        {["Thông tin chung", "Dịch vụ", "Hình ảnh", "Sân"].map(
          (tab) => (
            <Box
              key={tab}
              onClick={() => setActiveTab(tab)}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                cursor: "pointer",
                background: activeTab === tab ? "white" : "transparent",
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? "#111827" : "#6b7280",
              }}
            >
              {tab}
            </Box>
          )
        )}
      </Box>

      {activeTab === "Thông tin chung" && <VenueInfoSection selectedVenue={selectedVenue} />}
      {activeTab === "Dịch vụ" && (
        <VenueServicesSection
          services={services}
          setServices={setServices}
          showAddService={showAddService}
          setShowAddService={setShowAddService}
          newService={newService}
          setNewService={setNewService}
        />
      )}
      {activeTab === "Hình ảnh" && (
        <VenueImagesSection
          venueId={venueId}
          coverImage={coverImage}
          setCoverImage={setCoverImage}
          images={images}
          setImages={setImages}
        />
      )}
      {activeTab === "Sân" && (
        <VenueCourtsSection
          venueId={venueId}
          courts={courts}
          setCourts={setCourts}
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          newCourtName={newCourtName}
          setNewCourtName={setNewCourtName}
          newCourtPrices={newCourtPrices}
          setNewCourtPrices={setNewCourtPrices}
          newCourtHours={newCourtHours}
          setNewCourtHours={setNewCourtHours}
          editCourtIndex={editCourtIndex}
          setEditCourtIndex={setEditCourtIndex}
          editCourtName={editCourtName}
          setEditCourtName={setEditCourtName}
          editCourtActive={editCourtActive}
          setEditCourtActive={setEditCourtActive}
          editCourtPrices={editCourtPrices}
          setEditCourtPrices={setEditCourtPrices}
          editCourtHours={editCourtHours}
          setEditCourtHours={setEditCourtHours}
          addCourtRef={addCourtRef}
        />
      )}

    </OwnerLayout>
  );
};

export default VenueDetail;