<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">TechShop E-commerce Backend</h1>

<p align="center">
  A robust, scalable, and modern REST API backend for the TechShop E-commerce platform, built with <a href="https://nestjs.com/">NestJS</a> and <a href="https://www.mongodb.com/">MongoDB</a>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-11.0-red" alt="NestJS">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/MongoDB-7.0-green" alt="MongoDB">
  <img src="https://img.shields.io/badge/Redis-Caching-red" alt="Redis">
</p>

## 📋 Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Testing](#testing)
- [Deployment](#deployment)

## 📝 Introduction

The **TechShop Backend** serves as the core engine for the TechShop e-commerce ecosystem. It manages users, products, orders, and integrates advanced features like AI-powered recommendations, real-time inventory management, and secure payments. Built with a modular architecture using NestJS, it ensures maintainability and scalability.

## ✨ Features

### 🔐 Authentication & Authorization
- **Multi-method Auth**: JWT-based authentication, Google OAuth 2.0 (`passport-google-oauth20`).
- **Security**: OTP verification (`otp-generator`), Password hashing (`bcrypt`).
- **RBAC**: Role-Based Access Control using **CASL** (`@casl/ability`) for fine-grained permissions.

### 🛍️ Product Management
- **Catalog**: Full CRUD for Products, Categories, Brands.
- **Search & Filter**: Advanced search capabilities using `api-query-params`.
- **Inventory**: Real-time stock tracking and management.
- **Reviews**: User reviews and ratings system.

### 🤖 AI & Recommendations
- **Smart Recommendations**: Product recommendation engine.
- **TF-IDF**: Content-based filtering using TF-IDF algorithm (`tfidf-mode`).
- **GenAI Integration**: Integration with Google Generative AI (`@google/generative-ai`) for enhanced content or chat features.

### 🛒 Order & Payment
- **Cart**: Persistent shopping cart management.
- **Order Processing**: Order creation, status tracking, and history.
- **Payments**: Integration with payment gateways.

### ☁️ Media & Communication
- **Cloud Storage**: Image uploads and management via **Cloudinary**.
- **Email Service**: Automated emails (welcome, order confirmation) using **Nodemailer**.

### ⚡ Performance & System
- **Caching**: Redis integration (`ioredis`) for high-performance caching.
- **Scheduling**: Cron jobs and scheduled tasks (`@nestjs/schedule`).
- **Validation**: Robust DTO validation using `class-validator` and `class-transformer`.

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Caching**: Redis
- **Authentication**: Passport.js (JWT, Google), CASL
- **File Storage**: Cloudinary
- **AI/ML**: Google Generative AI, Natural (NLP)
- **Testing**: Jest, Supertest

## 📂 Project Structure

The project follows a modular structure:

```
src/
├── auth/           # Authentication logic (Login, Register, OTP, Google)
├── user/           # User management
├── product/        # Product catalog
├── category/       # Product categories
├── brand/          # Product brands
├── inventory/      # Stock management
├── order/          # Order processing
├── cart/           # Shopping cart
├── payment/        # Payment integration
├── recommendation/ # Recommendation engine
├── tfidf-mode/     # TF-IDF algorithm implementation
├── cloudinary/     # Image upload service
├── mail/           # Email service
├── casl/           # Permission management
├── common/         # Shared decorators, guards, filters
└── ...
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn**
- **MongoDB**: Local instance or Atlas URI
- **Redis**: Local instance or cloud URI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/techshop_backend-nestjs.git
   cd techshop_backend-nestjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
# App
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/techshop

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Mail
MAIL_HOST=smtp.example.com
MAIL_USER=your_email
MAIL_PASS=your_password
```

### Running the App

```bash
# Development mode (watch)
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🚢 Deployment

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory. You can then run the application using:

```bash
node dist/main
```

---


