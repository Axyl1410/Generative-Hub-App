const User = require('../models/users');

class UserService {
  // Tìm người dùng theo wallet_address
  static async findUserByWalletAddress(wallet_address) {
    const user = await User.findOne({ where: { wallet_address } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Kiểm tra username đã tồn tại chưa
  static async checkUsernameAvailability(username, wallet_address) {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser && existingUser.wallet_address !== wallet_address) {
      throw new Error('Username already exists');
    }
  }

  // Cập nhật thông tin người dùng
  static async updateUser(wallet_address, updates) {
    const user = await this.findUserByWalletAddress(wallet_address);

    const { username, email, avatar_url, cover_url } = updates;

    if (username) {
      await this.checkUsernameAvailability(username, wallet_address);
      user.username = username;
    }
    if (email) user.email = email;
    if (avatar_url !== undefined) user.avatar_url = avatar_url;
    if (cover_url !== undefined) user.cover_url = cover_url;

    await user.save();
    return user;
  }
}

module.exports = UserService;