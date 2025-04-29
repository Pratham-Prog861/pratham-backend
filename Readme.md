# Pratham Backend

A robust backend system built with modern Node.js technologies for handling video content and user management.

## 🚀 Tech Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js (v5.1.0)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **File Handling:** Multer
- **Cloud Storage:** Cloudinary
- **Security:** bcrypt for password hashing
- **API Features:** CORS enabled, Cookie Parser

## 📦 Key Dependencies

- **express:** ^5.1.0 - Fast, unopinionated web framework
- **mongoose:** ^8.14.0 - MongoDB object modeling tool
- **jsonwebtoken:** ^9.0.2 - Implementation of JSON Web Tokens
- **bcrypt:** ^5.1.1 - Password hashing
- **cloudinary:** ^2.6.0 - Cloud storage for media files
- **multer:** ^1.4.5-lts.2 - Middleware for handling multipart/form-data
- **cookie-parser:** ^1.4.7 - Parse Cookie header
- **cors:** ^2.8.5 - Enable Cross-Origin Resource Sharing
- **mongoose-aggregate-paginate-v2:** ^1.1.4 - Pagination support
- **dotenv:** ^16.3.1 - Load environment variables from .env file
- **nodemon:** ^3.0.1 - Monitor for changes and automatically restart server

## 🏗️ Project Structure

```
src/
├── controllers/      # Request handlers
├── models/          # Database schemas
├── middlewares/     # Custom middleware functions
├── routes/          # API routes
├── utils/           # Helper utilities
└── db/             # Database configuration
```

## 🔑 Key Feature

 1. User Management
    - User registration and authentication
    - Profile management with avatar and cover image
    - Password change functionality
    - Watch history tracking

 2. Security Features
    - JWT-based authentication
    - Password hashing
    - Protected routes
    - Refresh token mechanism

 3. File Handling
    - Support for avatar and cover image uploads
    - Cloudinary integration for media storage
    - Temporary file management

 4. API Features
    - RESTful architecture
    - Error handling middleware
    - Async operation support
    - Response standardization

## 🚀 Getting Started

 1. Clone the repository

 2. Install dependencies:

  ```bash
  npm install
  ```


 3. Create a .env file with required environment variables:
```
- MONGODB_URI
- PORT
- CORS_ORIGIN
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- ACCESS_TOKEN_SECRET
- ACCESS_TOKEN_EXPIRY
- REFRESH_TOKEN_SECRET
- REFRESH_TOKEN_EXPIRY

```

 4. Start the development server:
```bash
npm run dev
```


## 🛣️ API Routes
 1. Authentication
  
    - POST /api/v1/users/register - Register new user
    - POST /api/v1/users/login - User login
    - POST /api/v1/users/logout - User logout
    - POST /api/v1/users/refresh-token - Refresh access token

 2. User Management
  
    - GET /api/v1/users/current-user - Get current user details
    - POST /api/v1/users/change-password - Change password
    - PATCH /api/v1/users/update-account - Update account details
    - PATCH /api/v1/users/update-avatar - Update avatar
    - PATCH /api/v1/users/update-cover-image - Update cover image
    - Channel Features
  
    - GET /api/v1/users/c/:username - Get channel profile
    - GET /api/v1/users/history - Get watch history