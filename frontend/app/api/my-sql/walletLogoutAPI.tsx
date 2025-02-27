

const walletLogoutAPI = (): void => {
    try {
      localStorage.removeItem("jwt_token"); // Xóa token
      console.log("Logout successful!");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  
  export default walletLogoutAPI;