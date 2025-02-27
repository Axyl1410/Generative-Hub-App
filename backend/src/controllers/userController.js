const jwt = require("jsonwebtoken");
const User = require("../models/users");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ImageService = require('../services/imageService');
const UserService = require('../services/userService');

// Cấu hình Multer để lưu trữ ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const wallet_address = req.body.wallet_address;
      const imageType = file.fieldname;
      const dir = path.join(__dirname, '..', 'uploads', wallet_address, 'images', imageType);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '.jpg');
    }
  });
  
  const upload = multer({ storage: storage }).fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]);


// Hàm đăng nhập hoặc đăng ký người dùng bằng địa chỉ ví
const walletLogin = async (req, res) => {
    const { wallet_address } = req.body;

    // Kiểm tra xem địa chỉ ví có được cung cấp không
    if (!wallet_address) {
        return res.status(400).json({ error: "Wallet address is required" });
    }

    console.log("Received wallet address:", wallet_address);  // Log để kiểm tra ví

    try {
        // Tìm người dùng bằng địa chỉ ví
        let user = await User.findOne({ where: { wallet_address } });

        console.log("Found user:", user); // Log thông tin người dùng

        // Nếu người dùng không tồn tại, tạo mới người dùng
        if (!user) {
          const uniqueSuffix = Date.now() + Math.round(Math.random() * 1000); // Tạo giá trị duy nhất
          user = await User.create({
              wallet_address,
              username: `Unknown_${uniqueSuffix}`, // Username mặc định với giá trị duy nhất
          });
          console.log("Created user:", user); // Log thông tin người dùng mới
      }

        // Tạo token JWT
        const token = jwt.sign(
            { id: user.id, wallet_address: user.wallet_address }, // Payload (dữ liệu trong token)
            process.env.JWT_SECRET, // Secret key cho việc mã hóa token
            { expiresIn: "3h" } // Thời gian hết hạn của token (1 giờ trong trường hợp này)
        );

        // Trả về thông báo đăng nhập thành công cùng với token
        res.json({ message: "Login successful", token, user });
    } catch (error) {
        console.error("Error during wallet login:", error);
        res.status(500).json({ error: error.message });
    }
};

// Hàm lấy thông tin người dùng theo địa chỉ ví
const getUserByWalletAddress = async (req, res) => {
    const { wallet_address } = req.params;

    // Kiểm tra xem địa chỉ ví có được cung cấp không
    if (!wallet_address) {
        return res.status(400).json({ error: "Wallet address is required" });
    }

    try {
        // Tìm người dùng bằng địa chỉ ví
        const user = await User.findOne({ where: { wallet_address } });
        // Nếu không tìm thấy người dùng
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Trả về thông tin người dùng
        res.json({ user });
    } catch (error) {
        console.error("Error fetching user by wallet address:", error);
        res.status(500).json({ error: error.message });
    }
};


const updateUser = async (req, res) => {
    console.log("Request body:", req.body);
  console.log("Request files:", req.files);
  const { wallet_address, username, email, avatar_url, cover_url } = req.body;

  if (!wallet_address) {
    return res.status(400).json({ error: "Wallet address is required" });
  }

  try {
    const user = await UserService.findUserByWalletAddress(wallet_address);

    // Xử lý ảnh avatar
    const avatarFile = req.files?.avatar?.[0];
    let finalAvatarUrl = user.avatar_url;
    if (avatarFile) {
      finalAvatarUrl = await ImageService.uploadAndOptimizeImage(avatarFile, wallet_address, 'avatar');
      ImageService.deleteOldImage(user.avatar_url);
    } else if (avatar_url === null || avatar_url === '') {
      ImageService.deleteOldImage(user.avatar_url);
      finalAvatarUrl = null;
    } else if (avatar_url) {
      ImageService.deleteOldImage(user.avatar_url);
      finalAvatarUrl = avatar_url;
    }

    // Xử lý ảnh cover
    const coverFile = req.files?.cover?.[0];
    let finalCoverUrl = user.cover_url;
    if (coverFile) {
      finalCoverUrl = await ImageService.uploadAndOptimizeImage(coverFile, wallet_address, 'cover');
      ImageService.deleteOldImage(user.cover_url);
    } else if (cover_url === null || cover_url === '') {
      ImageService.deleteOldImage(user.cover_url);
      finalCoverUrl = null;
    } else if (cover_url) {
      ImageService.deleteOldImage(user.cover_url);
      finalCoverUrl = cover_url;
    }

    // Cập nhật thông tin người dùng
    const updatedUser = await UserService.updateUser(wallet_address, {
      username,
      email,
      avatar_url: finalAvatarUrl,
      cover_url: finalCoverUrl
    });

    res.json({ message: "User information updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(error.message === 'User not found' ? 404 : 500).json({ error: error.message });
  }
};

// Tìm kiếm người dùng theo username hoặc địa chỉ ví
const searchUser = async (req, res) => {
    const { query } = req.params;

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    try {
        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { username: query },
                    { wallet_address: query }
                ]
            }
        });

        if (users.length === 0) {
            return res.status(404).json({ error: "No user found" });
        }

        res.json({ users });
    } catch (error) {
        console.error("Error searching user:", error);
        res.status(500).json({ error: error.message });
    }
};



module.exports = {  walletLogin ,getUserByWalletAddress , searchUser, updateUser, upload};
