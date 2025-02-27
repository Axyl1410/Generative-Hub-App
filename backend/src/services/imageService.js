const sharp = require('sharp');
const path = require('path'); // Đảm bảo import path
const fs = require('fs');

class ImageService {
  static async uploadAndOptimizeImage(file, wallet_address, imageType) {
    if (!file || !['image/jpeg', 'image/png'].includes(file.mimetype)) {
      throw new Error(`Invalid file type for ${imageType}`);
    }

    const filePath = file.path; // Tệp gốc từ Multer
    const tempFilePath = `${filePath}-temp`; // Tạo đường dẫn tạm

    try {
      if (imageType === 'avatar') {
        await sharp(filePath)
          .resize(200, 200, { fit: 'cover' })
          .jpeg({ quality: 80 })
          .toFile(tempFilePath);
      } else if (imageType === 'cover') {
        await sharp(filePath)
          .resize(800, 400, { fit: 'cover' })
          .jpeg({ quality: 80 })
          .toFile(tempFilePath);
      }

      // Thay thế tệp gốc bằng tệp đã tối ưu
      fs.renameSync(tempFilePath, filePath);

      return `/uploads/${wallet_address}/images/${imageType}/${path.basename(filePath)}`;
    } catch (error) {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath); // Xóa tệp tạm nếu lỗi
      }
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Xóa tệp gốc nếu cần
      }
      throw new Error(`Error processing ${imageType}: ${error.message}`);
    }
  }

  static deleteOldImage(imageUrl) {
    if (imageUrl && imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', imageUrl.substr(1));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
}

module.exports = ImageService;