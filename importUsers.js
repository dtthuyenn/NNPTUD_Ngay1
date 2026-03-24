const fs = require('fs');
const csv = require('csv-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// DÒNG NÀY ĐỂ KIỂM TRA FILE CÓ CHẠY KHÔNG
console.log('--- CHƯƠNG TRÌNH ĐANG KHỞI ĐỘNG... ---');

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "ID_CỦA_BẠN", // Hãy chắc chắn đã thay ID thật
    pass: "PASS_CỦA_BẠN"  // Hãy chắc chắn đã thay PASS thật
  }
});

const generatePassword = () => crypto.randomBytes(8).toString('hex');

const importUsers = () => {
  const results = [];
  
  // Kiểm tra file tồn tại
  if (!fs.existsSync('users.csv')) {
    console.log('❌ LỖI: Không tìm thấy file users.csv! Bạn hãy kiểm tra lại tên file.');
    return;
  }

  console.log('📂 Đang đọc file users.csv...');

  fs.createReadStream('users.csv')
    .pipe(csv())
    .on('data', (data) => {
      console.log('📍 Đã tìm thấy 1 dòng dữ liệu:', data);
      results.push(data);
    })
    .on('end', async () => {
      console.log(`✅ Đã đọc xong file. Tìm thấy tổng cộng: ${results.length} người.`);
      
      if (results.length === 0) {
        console.log('⚠️ CẢNH BÁO: File CSV đang trống hoặc sai định dạng!');
        return;
      }

      for (const row of results) {
        const username = row.mame; // Phải khớp với chữ 'mame' trong file excel của bạn
        const email = row.email;
        const password = generatePassword();

        console.log(`✉️ Đang gửi email tới: ${email}...`);

        try {
          await transporter.sendMail({
            from: '"Admin" <admin@test.com>',
            to: email,
            subject: "Mật khẩu của bạn",
            html: `<b>Chào ${username}, mật khẩu là: ${password}</b>`
          });
          console.log(`   ✔️ Gửi thành công cho ${email}`);
        } catch (err) {
          console.log(`   ❌ Gửi thất bại cho ${email}: ${err.message}`);
        }
      }
      console.log('🏁 HOÀN TẤT TẤT CẢ!');
    });
};

// GỌI HÀM CHẠY
importUsers();