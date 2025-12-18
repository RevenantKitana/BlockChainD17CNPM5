# 📝 Message Board DApp - Blockchain Project

Dự án blockchain đơn giản với Smart Contract Solidity và Frontend tương tác. Ứng dụng cho phép người dùng gửi và xem tin nhắn trên blockchain Ethereum.

## 🚀 Khởi động nhanh (Quick Start)

```bash
# 1. Cài đặt dependencies
npm install

# 2. Compile smart contract
npm run compile

# 3. Khởi động blockchain local (Terminal 1)
npm run node

# 4. Deploy contract (Terminal 2)
npm run deploy

# 5. Chạy frontend (Terminal 3 hoặc double-click)
start-frontend.bat
# Hoặc: cd frontend && python -m http.server 8000

# 6. Mở trình duyệt tại http://localhost:8000
```

**⚠️ Lưu ý:** Đọc hướng dẫn chi tiết bên dưới để cấu hình MetaMask!

---

## 🎯 Tính năng

- ✅ Gửi tin nhắn lên blockchain
- ✅ Xem tất cả tin nhắn
- ✅ Xem tin nhắn của bản thân
- ✅ Thống kê số lượng tin nhắn
- ✅ Kết nối với MetaMask
- ✅ Giao diện đẹp và thân thiện
- ✅ Hướng dẫn cài đặt MetaMask tự động
- ✅ Phát hiện MetaMask thông minh (retry mechanism)
- ✅ Sử dụng Ethers.js local (không phụ thuộc CDN)

## 🛠️ Công nghệ sử dụng

- **Blockchain**: Ethereum
- **Smart Contract**: Solidity ^0.8.0
- **Development Framework**: Hardhat
- **Frontend**: HTML, CSS, JavaScript
- **Web3 Library**: Ethers.js v5 (local)
- **Wallet**: MetaMask

## 📋 Yêu cầu

Trước khi bắt đầu, đảm bảo bạn đã cài đặt:

1. **Node.js** (v16 trở lên): [Download](https://nodejs.org/)
2. **Python** (để chạy local server): [Download](https://www.python.org/)
3. **MetaMask Browser Extension**: [Install](https://metamask.io/)
4. **Git** (optional): [Download](https://git-scm.com/)

## 🚀 Hướng dẫn cài đặt chi tiết

### Bước 1: Cài đặt dependencies

```bash
npm install
```

Lệnh này sẽ cài đặt:
- Hardhat và các plugin
- Ethers.js
- Các dependencies khác

### Bước 2: Compile Smart Contract

```bash
npm run compile
```

Lệnh này sẽ:
- Compile file `contracts/MessageBoard.sol`
- Tạo artifacts trong thư mục `artifacts/`

### Bước 3: Khởi động Hardhat Network (Blockchain local)

Mở terminal mới và chạy:

```bash
npm run node
```

**Giữ terminal này chạy!** Bạn sẽ thấy:
- Danh sách 20 accounts với private keys
- Mỗi account có 10000 ETH
- Blockchain chạy tại `http://127.0.0.1:8545`

### Bước 4: Import tài khoản vào MetaMask

1. Mở MetaMask extension
2. Click vào icon tài khoản → "Import Account"
3. Copy **Private Key** của Account #0 từ terminal (bắt đầu bằng "0x...")
4. Paste vào MetaMask và import

### Bước 5: Kết nối MetaMask với Hardhat Network

1. Mở MetaMask
2. Click vào dropdown network (ở trên cùng)
3. Chọn "Add Network" → "Add a network manually"
4. Nhập thông tin:
   - **Network Name**: Hardhat Local
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: ETH
5. Click "Save"
6. Chuyển sang network "Hardhat Local"

### Bước 6: Deploy Smart Contract

Mở terminal mới (giữ terminal Hardhat node chạy) và chạy:

```bash
npm run deploy
```

Sau khi deploy thành công:
- Địa chỉ contract sẽ được tự động lưu vào `frontend/config.js`
- ABI sẽ được lưu vào `frontend/MessageBoard.json`

### Bước 7: Chạy Frontend

⚠️ **QUAN TRỌNG**: MetaMask chỉ hoạt động với `http://localhost`, KHÔNG hoạt động khi mở trực tiếp file HTML!

#### Cách 1: Sử dụng script (Dễ nhất - Khuyến nghị) ⭐
```bash
# Windows: Double-click vào file
start-frontend.bat

# Hoặc chạy từ terminal:
cd frontend
python -m http.server 8000
```
**Sau đó truy cập:** http://localhost:8000

#### Cách 2: Sử dụng Live Server trong VS Code
1. Cài extension "Live Server" trong VS Code
2. Right-click vào `frontend/index.html` → "Open with Live Server"
3. Truy cập URL Live Server hiển thị (thường là http://127.0.0.1:5500)

#### Cách 3: Sử dụng Node.js http-server
```bash
npx http-server frontend -p 8000
```
**Sau đó truy cập:** http://localhost:8000

---

### Bước 8: Sử dụng ứng dụng

1. **Trang web sẽ tự động kiểm tra MetaMask:**
   - Nếu chưa cài: Hiển thị modal hướng dẫn cài đặt
   - Nếu đã cài: Hiển thị nút kết nối ví

2. **Kết nối MetaMask:**
   - Click "🦊 Kết nối MetaMask"
   - Chọn account đã import ở Bước 4
   - Xác nhận kết nối

3. **Bắt đầu sử dụng:**
   - Gửi tin nhắn mới
   - Xem danh sách tin nhắn
   - Kiểm tra thống kê

## 📖 Hướng dẫn sử dụng

### 1. Kết nối ví

- Click button "🦊 Kết nối MetaMask"
- MetaMask sẽ hiện popup yêu cầu kết nối
- Chọn account và click "Connect"

### 2. Gửi tin nhắn

- Nhập nội dung tin nhắn vào textarea (tối đa 500 ký tự)
- Click "✉️ Gửi Tin Nhắn"
- Xác nhận transaction trong MetaMask
- Đợi transaction được xác nhận (~3-5 giây)
- Gas fee sẽ được trừ từ ví

### 3. Xem tin nhắn

- Tất cả tin nhắn sẽ hiển thị tự động sau khi kết nối ví
- Click "🔄 Làm mới" để load lại danh sách tin nhắn
- Tin nhắn của bạn sẽ có màu nền khác biệt (gradient tím)
- Tin nhắn mới nhất hiển thị trước

## 📁 Cấu trúc dự án

```
BlockChain/
├── contracts/              # Smart contracts
│   └── MessageBoard.sol   # Contract chính
├── scripts/               # Scripts
│   └── deploy.js         # Script deploy contract
├── frontend/             # Frontend files
│   ├── index.html       # Trang chính
│   ├── style.css        # Styles
│   ├── app.js           # Logic JavaScript
│   ├── ethers.min.js    # Ethers.js library (local)
│   ├── config.js        # Config (tự động tạo)
│   └── MessageBoard.json # ABI (tự động tạo)
├── hardhat.config.js    # Cấu hình Hardhat
├── package.json         # Dependencies
├── start-frontend.bat   # Script khởi động frontend (Windows)
└── README.md           # File này
```

## 🔧 Các lệnh hữu ích

```bash
# Compile contracts
npm run compile

# Deploy contracts
npm run deploy

# Khởi động Hardhat node
npm run node

# Run tests (nếu có)
npm run test

# Clean cache và artifacts
npx hardhat clean
```

## 🎨 Smart Contract API

### Struct Message
```solidity
struct Message {
    uint256 id;
    address sender;
    string content;
    uint256 timestamp;
}
```

### Functions

#### `sendMessage(string memory _content)`
Gửi tin nhắn mới lên blockchain.
- **Params**: `_content` - Nội dung tin nhắn (1-500 ký tự)
- **Returns**: None
- **Events**: `MessageSent(id, sender, content, timestamp)`
- **Gas**: ~50,000 - 100,000 gas

#### `getAllMessages()`
Lấy tất cả tin nhắn.
- **Returns**: `Message[]` - Mảng tất cả tin nhắn
- **Gas**: View function (free)

#### `getMessage(uint256 _id)`
Lấy tin nhắn theo ID.
- **Params**: `_id` - ID của tin nhắn
- **Returns**: `(id, sender, content, timestamp)`
- **Gas**: View function (free)

#### `getMessagesBySender(address _sender)`
Lấy tất cả tin nhắn của một địa chỉ.
- **Params**: `_sender` - Địa chỉ ví
- **Returns**: `Message[]` - Mảng tin nhắn
- **Gas**: View function (free)

#### `getMessageCount()`
Lấy tổng số tin nhắn.
- **Returns**: `uint256` - Số lượng tin nhắn
- **Gas**: View function (free)

## ❗ Xử lý sự cố

### 1. MetaMask không được phát hiện (window.ethereum undefined)
**Nguyên nhân:** Mở trực tiếp file HTML thay vì qua localhost

**Giải pháp:**
- ❌ KHÔNG mở bằng cách double-click file `index.html`
- ✅ SỬ DỤNG local server:
  ```bash
  # Chạy từ thư mục gốc dự án
  start-frontend.bat
  
  # Hoặc
  cd frontend
  python -m http.server 8000
  ```
- Truy cập qua `http://localhost:8000`
- Nếu vẫn không phát hiện, click nút "✅ Tôi đã cài MetaMask" trong modal

### 2. Lỗi "Failed to load resource: ERR_BLOCKED_BY_CLIENT"
**Nguyên nhân:** Ad blocker hoặc extension bảo mật chặn CDN

**Giải pháp:** 
✅ **Đã giải quyết!** Dự án giờ sử dụng ethers.js local, không còn phụ thuộc CDN!
- File `frontend/ethers.min.js` đã được tích hợp sẵn
- Không cần tắt Ad Blocker nữa

### 3. Lỗi "ethers is not defined"
**Nguyên nhân:** Thiếu file ethers.min.js trong frontend

**Giải pháp:**
```bash
# Copy ethers.js từ node_modules vào frontend
Copy-Item "node_modules\ethers\dist\ethers.umd.min.js" -Destination "frontend\ethers.min.js"
```

### 4. "Nonce too high" error
**Giải pháp:**
- Reset MetaMask account:
  - MetaMask → Settings → Advanced → Clear activity tab data
- Hoặc restart Hardhat node và deploy lại contract

### 5. Contract không tồn tại
**Giải pháp:**
- Đảm bảo Hardhat node đang chạy: `npm run node`
- Deploy lại contract: `npm run deploy`
- Kiểm tra file `frontend/config.js` có địa chỉ contract đúng

### 6. MetaMask không kết nối được
**Giải pháp:**
- Kiểm tra network trong MetaMask (phải là "Hardhat Local" - Chain ID: 31337)
- Đảm bảo MetaMask extension đã được enable
- Refresh trang web (Ctrl + Shift + R)
- Thử click nút retry trong modal nếu hiển thị

### 7. Transaction failed
**Giải pháp:**
- Kiểm tra balance trong ví (phải có ETH)
- Kiểm tra nội dung tin nhắn (1-500 ký tự)
- Đảm bảo đang kết nối đúng network
- Kiểm tra gas price không quá thấp

## 🌐 Deploy lên Testnet (Optional)

Để deploy lên testnet thực (ví dụ: Sepolia), làm theo các bước:

1. Tạo file `.env`:
```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=your_alchemy_or_infura_url
```

2. Cài dotenv:
```bash
npm install dotenv
```

3. Cập nhật `hardhat.config.js`:
```javascript
require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

4. Deploy:
```bash
npm run deploy -- --network sepolia
```

5. Cập nhật `frontend/config.js` với địa chỉ contract mới và đổi network sang Sepolia trong MetaMask.

## 📚 Học thêm

- [Solidity Documentation](https://docs.soliditylang.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/v5/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Ethereum Development Tutorial](https://ethereum.org/en/developers/tutorials/)

## 👨‍💻 Phát triển thêm

Một số ý tưởng để mở rộng dự án:

- ✨ Thêm tính năng like/unlike tin nhắn
- ✨ Thêm tính năng xóa tin nhắn (chỉ người gửi)
- ✨ Thêm tính năng edit tin nhắn
- ✨ Thêm hình ảnh/emoji
- ✨ Thêm phân trang
- ✨ Thêm tìm kiếm tin nhắn
- ✨ Thêm profile người dùng
- ✨ Token reward cho người gửi tin nhắn
- ✨ Thêm comment cho mỗi tin nhắn
- ✨ Thêm hashtag và trending topics
- ✨ Thêm notification system

## 📝 License

MIT License - Tự do sử dụng cho mục đích học tập và thương mại.

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Feel free to fork và submit pull requests.

## 📞 Liên hệ & Hỗ trợ

Nếu gặp vấn đề hoặc có câu hỏi:
1. Kiểm tra phần [Xử lý sự cố](#-xử-lý-sự-cố)
2. Xem lại các bước trong [Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt-chi-tiết)
3. Kiểm tra Console trong trình duyệt (F12) để xem lỗi chi tiết

---

**Made with ❤️ using Ethereum & Solidity**

Chúc bạn học tập vui vẻ! 🚀
