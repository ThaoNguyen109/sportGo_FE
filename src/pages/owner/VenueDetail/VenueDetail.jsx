import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import OwnerLayout from "../../../Layouts/OwnerLayout";
import { Box, Typography, Button, Switch } from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import VenueInfoSection from "./VenueInfoSection";
import VenueServicesSection from "./VenueServicesSection";
import VenueImagesSection from "./VenueImagesSection";
import VenueCourtsSection from "./VenueCourtsSection";

const VenueDetail = () => {
  const { id } = useParams();
  const venueId = Number(id) || 103;

  const venueDetails = {
    103: {
      name: "Sân cầu lông Cảnh Hồ",
      address: "138B Trường Chinh, Khương Mai, Thanh Xuân, Hà Nội",
      bankName: "MBBank",
      bankAccount: "0984292224",
      services: ["Cho thuê sân", "Thuê huấn luyện viên", "Bóng thi đấu"],
      images: [
        { alt: "Sân cầu lông Cảnh Hồ 1", src: "https://picsum.photos/400/200/?1text=Cảnh+Hồ+1" },
        { alt: "Sân cầu lông Cảnh Hồ 2", src: "https://picsum.photos/400/200/?2text=Cảnh+Hồ+2" },
        { alt: "Sân cầu lông Cảnh Hồ 3", src: "https://picsum.photos/400/200/?3text=Cảnh+Hồ+3" },
      ],
    },
    104: {
      name: "Đức Thảo",
      address: "18 Tam Trinh, Mai Động, Hoàng Mai, Hà Nội",
      bankName: "Vietcombank",
      bankAccount: "0123456789",
      services: ["Cho thuê sân", "Tổ chức giải đấu", "Thuê đồ thể thao"],
      images: [
        { alt: "Đức Thảo 1", src: "https://picsum.photos/400/200/?4text=Đức+Thảo+1" },
        { alt: "Đức Thảo 2", src: "https://picsum.photos/400/200/?5text=Đức+Thảo+2" },
      ],
    },
    105: {
      name: "DINKZONE",
      address: "12 Nguyễn Trãi, Thanh Xuân, Hà Nội",
      bankName: "Techcombank",
      bankAccount: "0987612345",
      services: ["Cho thuê sân", "Sân tập", "Tổ chức sự kiện"],
      images: [
        { alt: "DINKZONE 1", src: "https://picsum.photos/400/200/?6text=DINKZONE+1" },
        { alt: "DINKZONE 2", src: "https://picsum.photos/400/200/?7text=DINKZONE+2" },
        { alt: "DINKZONE 3", src: "https://picsum.photos/400/200/?8text=DINKZONE+3" },
      ],
    },
  };

  const selectedVenue = venueDetails[venueId] || venueDetails[103];

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
  const [services, setServices] = useState(selectedVenue.services);

  const [images, setImages] = useState(selectedVenue.images);
  const [coverImage, setCoverImage] = useState(null);

  const [courts, setCourts] = useState([
    {
      name: "Sân 1",
      active: true,
      priceByDay: {
        T2: "200k",
        T3: "200k",
        T4: "200k",
        T5: "200k",
        T6: "200k",
        T7: "220k",
        CN: "250k",
      },
      operatingHours: {
        T2: "06:00-22:00",
        T3: "06:00-22:00",
        T4: "06:00-22:00",
        T5: "06:00-22:00",
        T6: "06:00-22:00",
        T7: "06:00-22:00",
        CN: "08:00-20:00",
      },
    },
    {
      name: "Sân 2",
      active: true,
      priceByDay: {
        T2: "200k",
        T3: "200k",
        T4: "200k",
        T5: "200k",
        T6: "200k",
        T7: "220k",
        CN: "250k",
      },
      operatingHours: {
        T2: "06:00-22:00",
        T3: "06:00-22:00",
        T4: "06:00-22:00",
        T5: "06:00-22:00",
        T6: "06:00-22:00",
        T7: "06:00-22:00",
        CN: "08:00-20:00",
      },
    },
    {
      name: "Sân 3",
      active: true,
      priceByDay: {
        T2: "200k",
        T3: "200k",
        T4: "200k",
        T5: "200k",
        T6: "200k",
        T7: "220k",
        CN: "250k",
      },
      operatingHours: {
        T2: "06:00-22:00",
        T3: "06:00-22:00",
        T4: "06:00-22:00",
        T5: "06:00-22:00",
        T6: "06:00-22:00",
        T7: "06:00-22:00",
        CN: "08:00-20:00",
      },
    },
    {
      name: "Sân 4",
      active: true,
      priceByDay: {
        T2: "200k",
        T3: "200k",
        T4: "200k",
        T5: "200k",
        T6: "200k",
        T7: "220k",
        CN: "250k",
      },
      operatingHours: {
        T2: "06:00-22:00",
        T3: "06:00-22:00",
        T4: "06:00-22:00",
        T5: "06:00-22:00",
        T6: "06:00-22:00",
        T7: "06:00-22:00",
        CN: "08:00-20:00",
      },
    },
    {
      name: "Sân 5",
      active: true,
      priceByDay: {
        T2: "200k",
        T3: "200k",
        T4: "200k",
        T5: "200k",
        T6: "200k",
        T7: "220k",
        CN: "250k",
      },
      operatingHours: {
        T2: "06:00-22:00",
        T3: "06:00-22:00",
        T4: "06:00-22:00",
        T5: "06:00-22:00",
        T6: "06:00-22:00",
        T7: "06:00-22:00",
        CN: "08:00-20:00",
      },
    },
  ]);

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
          coverImage={coverImage}
          setCoverImage={setCoverImage}
          images={images}
          setImages={setImages}
        />
      )}
      {activeTab === "Sân" && (
        <VenueCourtsSection
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