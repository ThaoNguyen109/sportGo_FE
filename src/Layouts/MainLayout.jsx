import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div style={{ 
        paddingBottom: "70px",
        background: "#fff", 
        paddingLeft: 16,
        paddingRight: 16,
    
       }}>
        {children}
      </div>
      <BottomNav />
    </>
  );
};

export default MainLayout;
