import Header from "../Components/Header";


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
      
    </>
  );
};

export default MainLayout;
