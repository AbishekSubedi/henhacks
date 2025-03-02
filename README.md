# Business AI Platform

A comprehensive solution for small businesses to leverage AI for insights and growth.

## Features

- User Authentication with Firebase
- Business Management (Create, Read, Update, Delete)
- AI-powered Business Insights using Gemini Pro
- Modern UI with Material-UI
- Real-time Data with Firebase Realtime Database

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase Account
- Google Cloud Account (for Gemini Pro API)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd business-ai-platform
```

2. Install dependencies:
```bash
npm run install-deps
```

3. Configure environment variables:

Frontend (.env):
- Copy `frontend/.env.example` to `frontend/.env`
- Fill in your Firebase configuration values

Backend (.env):
- Copy `backend/.env.example` to `backend/.env`
- Set your PORT and GEMINI_API_KEY

4. Set up Firebase:
- Create a new Firebase project
- Enable Authentication and Realtime Database
- Download your service account key and save it as `backend/config/firebase-service-account.json`

## Development

Start both frontend and backend in development mode:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5174` and the backend at `http://localhost:5001`.

## Project Structure

```
business-ai-platform/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── config/         # Firebase configuration
│   │   └── ...
│   └── .env                # Frontend environment variables
├── backend/                 # Express backend server
│   ├── routes/             # API routes
│   ├── config/             # Backend configuration
│   └── .env               # Backend environment variables
└── package.json           # Root package.json
```

## Security

- All sensitive information (API keys, tokens) should be stored in environment variables
- The `.env` files and `firebase-service-account.json` are git-ignored for security
- Make sure to never commit sensitive information to the repository

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

MIT 