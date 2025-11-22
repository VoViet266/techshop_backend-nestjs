<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">TechShop E-commerce Backend</h1>

<p align="center">
  REST API backend mạnh mẽ, có khả năng mở rộng và hiện đại cho nền tảng thương mại điện tử TechShop, được xây dựng bằng <a href="https://nestjs.com/">NestJS</a> và <a href="https://www.mongodb.com/">MongoDB</a>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-11.0-red" alt="NestJS">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/MongoDB-7.0-green" alt="MongoDB">
  <img src="https://img.shields.io/badge/Redis-Caching-red" alt="Redis">
</p>

---

---

## Mục Lục

- [Giới Thiệu](#giới-thiệu)
- [Tính Năng](#tính-năng)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Bắt Đầu](#bắt-đầu)
  - [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
  - [Cài Đặt](#cài-đặt)
  - [Biến Môi Trường](#biến-môi-trường)
  - [Chạy Ứng Dụng](#chạy-ứng-dụng)
- [Kiểm Thử](#kiểm-thử)
- [Triển Khai](#triển-khai)

## Giới Thiệu

**TechShop Backend** đóng vai trò là động cơ cốt lõi cho hệ sinh thái thương mại điện tử TechShop. Nó quản lý người dùng, sản phẩm, đơn hàng và tích hợp các tính năng nâng cao như gợi ý sản phẩm dựa trên AI, quản lý tồn kho theo thời gian thực và thanh toán bảo mật. Được xây dựng với kiến trúc module hóa sử dụng NestJS, đảm bảo tính bảo trì và khả năng mở rộng.

## Tính Năng

### Xác Thực & Phân Quyền

- **Đa phương thức xác thực**: Xác thực dựa trên JWT, Google OAuth 2.0 (`passport-google-oauth20`).
- **Bảo mật**: Xác minh OTP (`otp-generator`), Mã hóa mật khẩu (`bcrypt`).
- **RBAC**: Kiểm soát truy cập dựa trên vai trò sử dụng **CASL** (`@casl/ability`) để phân quyền chi tiết.

### Quản Lý Sản Phẩm

- **Danh mục**: CRUD đầy đủ cho Sản phẩm, Danh mục, Thương hiệu.
- **Tìm kiếm & Lọc**: Khả năng tìm kiếm nâng cao sử dụng `api-query-params`.
- **Tồn kho**: Theo dõi và quản lý tồn kho theo thời gian thực.
- **Đánh giá**: Hệ thống đánh giá và xếp hạng của người dùng.

### Gợi Ý

- **Gợi ý thông minh**: Công cụ gợi ý sản phẩm.
- **TF-IDF**: Lọc dựa trên nội dung sử dụng thuật toán TF-IDF (`tfidf-mode`).

### Đơn Hàng & Thanh Toán

- **Giỏ hàng**: Quản lý giỏ hàng lưu trữ lâu dài.
- **Xử lý đơn hàng**: Tạo đơn hàng, theo dõi trạng thái và lịch sử.
- **Thanh toán**: Tích hợp với các cổng thanh toán.

### Media & Giao Tiếp

- **Lưu trữ đám mây**: Tải lên và quản lý hình ảnh qua **Cloudinary**.
- **Dịch vụ email**: Email tự động (chào mừng, xác nhận đơn hàng) sử dụng **Nodemailer**.

### Hiệu Suất & Hệ Thống

- **Bộ nhớ đệm**: Tích hợp Redis (`ioredis`) cho bộ nhớ đệm hiệu suất cao.
- **Lập lịch**: Cron jobs và các tác vụ theo lịch trình (`@nestjs/schedule`).
- **Xác thực**: Xác thực DTO mạnh mẽ sử dụng `class-validator` và `class-transformer`.

## Công Nghệ Sử Dụng

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Ngôn ngữ**: TypeScript
- **Cơ sở dữ liệu**: MongoDB (via Mongoose)
- **Bộ nhớ đệm**: Redis
- **Xác thực**: Passport.js (JWT, Google), CASL
- **Lưu trữ tệp**: Cloudinary
- **AI/ML**: Google Generative AI, Natural (NLP)
- **Kiểm thử**: Jest, Supertest

## Cấu Trúc Dự Án

Dự án tuân theo cấu trúc module hóa:

```
src/
├── auth/           # Logic xác thực (Đăng nhập, Đăng ký, OTP, Google)
├── user/           # Quản lý người dùng
├── product/        # Danh mục sản phẩm
├── category/       # Danh mục sản phẩm
├── brand/          # Thương hiệu sản phẩm
├── inventory/      # Quản lý tồn kho
├── order/          # Xử lý đơn hàng
├── cart/           # Giỏ hàng
├── payment/        # Tích hợp thanh toán
├── recommendation/ # Công cụ gợi ý
├── tfidf-mode/     # Triển khai thuật toán TF-IDF
├── cloudinary/     # Dịch vụ tải lên hình ảnh
├── mail/           # Dịch vụ email
├── casl/           # Quản lý quyền
├── common/         # Decorators, guards, filters dùng chung
└── ...
```

## Bắt Đầu

### Yêu Cầu Hệ Thống

- **Node.js**: phiên bản 18 trở lên
- **npm** hoặc **yarn**
- **MongoDB**: Instance local hoặc Atlas URI
- **Redis**: Instance local hoặc cloud URI

### Cài Đặt

1. **Clone repository**

   ```bash
   git clone https://github.com/your-repo/techshop_backend-nestjs.git
   cd techshop_backend-nestjs
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

### Biến Môi Trường

Tạo file `.env` trong thư mục gốc và cấu hình các biến sau:

```env
# Ứng dụng
PORT=3000
NODE_ENV=development

# Cơ sở dữ liệu
MONGO_URI=mongodb://localhost:27017/techshop

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Xác thực
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
MAIL_HOST=smtp.example.com
MAIL_USER=your_email
MAIL_PASS=your_password
```

### Chạy Ứng Dụng

```bash
# Chế độ development (watch)
npm run start:dev

# Chế độ production
npm run start:prod

# Chế độ debug
npm run start:debug
```

## Kiểm Thử

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Triển Khai

Để build ứng dụng cho production:

```bash
npm run build
```

Các tệp build sẽ được lưu trong thư mục `dist/`. Sau đó bạn có thể chạy ứng dụng bằng:

```bash
node dist/main
```

---

Dự án được phát triển bởi Võ Quốc Việt
