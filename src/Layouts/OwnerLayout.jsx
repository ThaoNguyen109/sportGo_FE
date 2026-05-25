import { Box } from "@mui/material";
import OwnerSidebar from "../Components/OwnerSidebar";
import OwnerHeader from "../Components/OwnerHeader";


const OwnerLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      
      {/* SIDEBAR */}
      <OwnerSidebar />

      {/* MAIN CONTENT */}
      <Box
        sx={{
          flex: 1,
          ml: "240px", // 👈 chừa chỗ sidebar
          minHeight: "100vh",
          background: "#f1f5f9",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <OwnerHeader />

        {/* CONTENT */}
        <Box
          sx={{
            flex: 1,
            p: 3,
          }}
        >
          {children}
        </Box>

        
      </Box>
    </Box>
  );
};

export default OwnerLayout;
