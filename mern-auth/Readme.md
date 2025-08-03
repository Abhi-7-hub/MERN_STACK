# Speakly - Fullstack Authentication System



Speakly is a modern fullstack authentication system built with the MERN stack, featuring secure JWT authentication, email verification, password recovery, and social features.

## 🚀 Features

- **User Authentication**:
  - Secure JWT-based login/logout
  - Email verification with OTP
  - Password reset functionality
  - Protected routes

- **User Management**:
  - Profile management
  - Account verification status
  - Session persistence

- **Additional Features**:
  - Gemini AI integration
  - Community feed
  - User profiles

## 🛠 Tech Stack

### Frontend
| Technology | Description |
|------------|-------------|
| React 18   | Frontend JavaScript library for building user interfaces |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first CSS framework for styling |
| Framer Motion | Animation library for React |
| React Icons | Popular icons library |
| React Toastify | Toast notifications |
| Axios | HTTP client for API requests |

### Backend
| Technology | Description |
|------------|-------------|
| Node.js | JavaScript runtime environment |
| Express.js | Web application framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modeling |
| JSON Web Tokens (JWT) | Secure user authentication |
| Bcrypt.js | Password hashing |
| Nodemailer | Email sending functionality |
| Dotenv | Environment variable management |
| CORS | Cross-origin resource sharing |

### Database
| Technology | Description |
|------------|-------------|
| MongoDB Atlas | Cloud database service |
| Mongoose ODM | Schema-based solution to model application data |

### APIs & Services
| Service | Usage |
|---------|-------|
| Gemini AI API | AI-powered search functionality |
| SMTP (Brevo) | Email delivery service |

## 📂 Project Structure
speakly/
├── client/ # Frontend React application
│ ├── public/ # Static assets
│ └── src/ # React source code
│ ├── assets/ # Images, icons
│ ├── components/ # Reusable components
│ ├── context/ # React context providers
│ ├── pages/ # Application pages
│ └── App.js # Main application component
│
├── server/ # Backend Node.js application
│ ├── config/ # Configuration files
│ ├── controllers/ # Route controllers
│ ├── middleware/ # Custom middleware
│ ├── models/ # MongoDB models
│ ├── routes/ # API routes
│ ├── server.js # Main server file
│ └── .env # Environment variables
│
├── .gitignore
└── README.md

text

## 🔧 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/speakly.git
   cd speakly
Backend Setup:

bash
cd server
npm install
cp .env.example .env
# Update .env with your credentials
Frontend Setup:

bash
cd ../client
npm install
cp .env.example .env
# Update .env with your API URLs
Run Development Servers:

Backend:

bash
cd ../server
npm start
Frontend:

bash
cd ../clientt
npm start
🌐 Deployment
The application is designed for deployment with:

Frontend: Netlify
Backend: Render
Database: MongoDB Atlas


