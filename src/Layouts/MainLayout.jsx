import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div style={{ paddingBottom: "70px" }}>
        {children}
      </div>
      <BottomNav />
    </>
  );
};

export default MainLayout;
