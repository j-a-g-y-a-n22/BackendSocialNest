# 📌 SocialNest Backend

This is the **backend service** for **SocialNest**, a social media–style MERN application where users can sign up, share content, follow others, and interact socially.  
The backend provides secure authentication, profile management, file uploads, following system, and a REST API for frontend integration.

**GitHub Repo:** [SocialNest Backend](https://github.com/j-a-g-y-a-n22/BackendSocialNest.git)

---

## 🚀 Tech Stack

- **Node.js** & **Express.js** — REST API server
- **MongoDB Atlas** — NoSQL cloud database
- **Mongoose** — Object Data Modeling (ODM)
- **Cloudinary** — Cloud media storage
- **Multer** & **multer-storage-cloudinary** — File upload handling
- **JWT (jsonwebtoken)** — Authentication & authorization
- **bcryptjs** — Password hashing
- **Nodemailer** — Email OTP sending
- **Sharp** — Image processing
- **dotenv** — Environment variable management
- **CORS** — Cross-origin request handling

---

## 🗂 Architecture Overview

```text
        ┌────────────────────┐
        │     Frontend       │  (React)
        └─────────┬──────────┘
                  │  HTTP Requests (JSON)
                  ▼
        ┌────────────────────┐
        │  Express.js Server │
        └─────────┬──────────┘
                  │
      ┌───────────┼─────────────────────────┐
      │           │                         │
      ▼           ▼                         ▼
┌──────────┐ ┌───────────┐          ┌─────────────────┐
│ MongoDB  │ │ Cloudinary│          │ Nodemailer/OTP  │
│ Atlas    │ │  Storage  │          │ Email Service   │
└──────────┘ └───────────┘          └─────────────────┘


backend/
│   .env                # Environment variables
│   .gitignore
│   databse.js          # MongoDB connection
│   otpsender.js        # OTP email sender
│   package.json
│   package-lock.json
│   server.js           # Entry point
│
├───middleware
│       getuser.js      # Auth middleware
│
├───models              # Mongoose schemas
│       follow.js
│       profilepic.js
│       serverdb.js
│       uploadpic.js
│
├───routes              # API endpoints
│       auth.js
│       follow.js
│       home.js
│       like.js
│       profile.js
│       search.js
│       upload.js
│
└───utils
        cloudinary.js   # Cloudinary config



```
## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/j-a-g-y-a-n22/BackendSocialNest.git
cd Backend

```
### 2️⃣ Install Dependencies
```bash
npm install
```
### 3️⃣ Configure Environment Variables
Create a .env file in the root directory and add:
### Server
PORT=5000

### JWT
JWT_SECRET=your_jwt_secret

### MongoDB
MONGOOSE_URL=your_mongodb_atlas_connection_string

### Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

### Email (Nodemailer) (Currently not implimented in this app)
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password

⚠️ Important: Never commit .env to GitHub.

### 4️⃣ Run in Development
```bash
npm run dev
```
###5️⃣ Run in Production
```bash
npm start
```


## 📌 API Documentation
### 🔑 Authentication
Method	Endpoint	Description	Auth Required
POST	/api/auth/signup	Register new user	❌
POST	/api/auth/login	Login & receive JWT	❌

### 👤 Profile
Method	Endpoint	Description	Auth Required
GET	/api/profile	Get logged-in user profile	✅
PUT	/api/profile	Update profile details	✅
POST	/api/upload	Upload/change profile picture	✅

### 🤝 Social Features
Method	Endpoint	Description	Auth Required
POST	/api/follow/:id	Follow a user	✅
DELETE	/api/follow/:id	Unfollow a user	✅
GET	/api/search	Search for users	✅
POST	/api/like/:postId	Like a post	✅
DELETE	/api/like/:postId	Unlike a post	✅

## 🌐 Deployment

This backend is deployed for free using:

- Render — API & backend hosting

- Cloudinary — Cloud-based image storage

- MongoDB Atlas — Database hosting

Deployment Steps:

- Push your code to GitHub.

- Connect GitHub repo to Render.

- Add all .env variables to Render's dashboard.

Deploy the service.

## 🛡 License
This project is licensed under the ISC License.

# 👨‍💻 Author
**Jagyandutta Sahoo**

**GitHub: j-a-g-y-a-n22****

**LinkedIn: (Add your profile link here)****
