import axios from "axios";

// Định nghĩa kiểu dữ liệu cho phản hồi từ API
interface LoginResponse {
  token: string;
  user: {
    id: number;
    username?: string | "Anonymous";
    email?: string | null;
    wallet_address: string;
    avatar_url?: string | null;
    cover_url?: string | null;
  };
}

const walletLoginAPI = async (walletAddress: string): Promise<void> => {
  const NEXT_PUBLIC_SERVER_ULR = process.env.NEXT_PUBLIC_SERVER_ULR;
  // const NEXT_PUBLIC_SERVER_LOCATION_ULR = process.env.NEXT_PUBLIC_SERVER_LOCATION_ULR | "http://localhost:5000";
  try {
    console.log("Logging in with wallet address:", walletAddress);
    const response = await axios.post<LoginResponse>(
      `${NEXT_PUBLIC_SERVER_ULR}/api/user/wallet-login`,
      { wallet_address: walletAddress },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token") || ""}`, // Gửi token kèm theo yêu cầu
        },
      }
    );

    if (response.data.token) {
      localStorage.setItem("jwt_token", response.data.token);
      console.log("Login successful!", response.data.user);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error during login:", error.response?.data || error.message);
  }
};

export default walletLoginAPI;
