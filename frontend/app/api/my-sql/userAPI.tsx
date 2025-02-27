import axios from "axios";

// Định nghĩa kiểu dữ liệu cho phản hồi từ API
interface LoginResponse {
  token: string;
  user: {
    id: number;
    username?: string;
    email?: string | null;
    wallet_address: string;
    avatar_url?: string | null;
    cover_url?: string | null;
  };
}

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

if (!NEXT_PUBLIC_SERVER_URL) {
  console.error("Server URL is not defined.");
}

const walletLoginAPI = async (walletAddress: string): Promise<LoginResponse | null> => {
  try {
    console.log("Logging in with wallet address:", walletAddress);
    const response = await axios.post<LoginResponse>(
      `${NEXT_PUBLIC_SERVER_URL}/api/user/wallet-login`,
      { wallet_address: walletAddress },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token") || ""}`,
        },
      }
    );

    if (response.data.token) {
      localStorage.setItem("jwt_token", response.data.token);
      console.log("Login successful!", response.data.user);
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error during login:", axios.isAxiosError(error) ? error.response?.data || error.message : error);
    return null;
  }
};

const getUserByWalletAddress = async (walletAddress: string) => {
  try {
    const response = await axios.get(`${NEXT_PUBLIC_SERVER_URL}/api/user/${walletAddress}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token") || ""}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", axios.isAxiosError(error) ? error.response?.data || error.message : error);
    return null;
  }
};

const updateUser = async (userData: FormData) => {
  try {
    const response = await axios.put(`${NEXT_PUBLIC_SERVER_URL}/api/user/update`, userData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("jwt_token") || ""}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", axios.isAxiosError(error) ? error.response?.data || error.message : error);
    return null;
  }
};

const searchUser = async (query: string) => {
  try {
    const response = await axios.get(`${NEXT_PUBLIC_SERVER_URL}/api/user/search/${query}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token") || ""}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching user:", axios.isAxiosError(error) ? error.response?.data || error.message : error);
    return null;
  }
};

export { walletLoginAPI, getUserByWalletAddress, updateUser, searchUser };
