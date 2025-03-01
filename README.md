# Business AI Platform

A modern web application that helps small businesses leverage the power of AI for business performance, social media marketing, and management.

## Features

- User authentication (login/register)
- Business profile creation
- Multi-step business details form
- AI-powered business analysis using Google's Gemini AI
- Dashboard with business insights
- Modern, responsive UI using Material-UI

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Google Cloud Platform account for Gemini AI API

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd business-ai-platform
```

2. Install dependencies:
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

4. Start the development server:
```bash
# Start both frontend and backend
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
business-ai-platform/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/      # Context providers
│   │   └── App.tsx       # Main application component
├── models/                # MongoDB models
├── routes/               # Express routes
├── server.js            # Express server setup
└── package.json         # Project dependencies
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Business
- POST /api/business/update-details - Update business details
- GET /api/business/details - Get business details

## Technologies Used

- Frontend:
  - React with TypeScript
  - Material-UI
  - Formik & Yup
  - Axios
  - React Router

- Backend:
  - Node.js
  - Express
  - MongoDB with Mongoose
  - JWT Authentication
  - Google's Gemini AI

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 