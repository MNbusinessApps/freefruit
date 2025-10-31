# Project Free Fruit - Setup Guide

## Prerequisites

Before setting up Project Free Fruit, ensure you have the following installed:

### Required Software
- **Node.js** (v18.0.0 or later) - [Download here](https://nodejs.org/)
- **npm** (v8.0.0 or later) - Usually comes with Node.js
- **PostgreSQL** (v13 or later) - [Download here](https://www.postgresql.org/download/)
- **Redis** (v6.0 or later) - [Download here](https://redis.io/download)
- **Expo CLI** - Install with: `npm install -g @expo/cli`

### Development Tools (Optional)
- **Visual Studio Code** - [Download here](https://code.visualstudio.com/)
- **Postman** - For API testing [Download here](https://www.postman.com/)
- **pgAdmin** - PostgreSQL GUI tool [Download here](https://www.pgadmin.org/)

## Project Structure

```
free-fruit/
├── backend/          # Express.js API server
├── mobile/           # React Native mobile app
├── web/              # React web application
├── README.md
├── SETUP.md
├── DEPLOYMENT.md
├── docker-compose.yml
└── .gitignore
```

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd free-fruit/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

#### Create PostgreSQL Database
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database and user
CREATE DATABASE free_fruit;
CREATE USER free_fruit_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE free_fruit TO free_fruit_user;
\q
```

#### Run Database Migrations
```bash
npm run migrate
```

#### Seed Initial Data (Optional)
```bash
npm run seed
```

### 4. Redis Setup

#### Start Redis Server
```bash
# On macOS with Homebrew
brew services start redis

# On Ubuntu/Debian
sudo systemctl start redis-server

# On Windows with WSL
redis-server
```

### 5. Environment Variables

Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=free_fruit
DB_USER=free_fruit_user
DB_PASSWORD=your_secure_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Sports Data API
SPORTSDATA_API_KEY=your_api_key_here
SPORTSDATA_BASE_URL=https://api.sportsdata.io/v3

# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:19006

# Feature Flags
ENABLE_DAILY_REFRESH=true
ENABLE_CACHE=true
```

### 6. Start Backend Server
```bash
npm run dev
```

The backend API will be available at `http://localhost:3000`

## Mobile App Setup

### 1. Navigate to Mobile Directory
```bash
cd free-fruit/mobile
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Base URL

The mobile app expects the backend API to be running. Update the API base URL in `src/screens/HomeScreen.js` if needed:

```javascript
const API_BASE = 'http://localhost:3000/api';
```

### 4. Start Expo Development Server
```bash
npm start
```

This will start the Expo development server and show a QR code for testing on your phone.

### 5. Testing on Device

#### Option 1: Physical Device
1. Download the "Expo Go" app from App Store (iOS) or Google Play (Android)
2. Scan the QR code shown in the terminal with Expo Go

#### Option 2: Simulator
```bash
# iOS Simulator (macOS only)
npm run ios

# Android Emulator
npm run android
```

## Web App Setup

### 1. Navigate to Web Directory
```bash
cd free-fruit/web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The web app will be available at `http://localhost:5173`

### 4. Production Build
```bash
npm run build
```

## Environment Variables Summary

### Backend (.env)
- `DB_HOST` - PostgreSQL host (default: localhost)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name (default: free_fruit)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `REDIS_HOST` - Redis host (default: localhost)
- `REDIS_PORT` - Redis port (default: 6379)
- `SPORTSDATA_API_KEY` - Sports data API key
- `PORT` - Backend server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

### Mobile (src/screens/HomeScreen.js)
- Update `API_BASE` to match your backend URL

### Web (vite.config.js)
- No additional environment variables needed for development

## Testing the Setup

### 1. Test Backend API
```bash
# Check server health
curl http://localhost:3000/health

# Test fruit projections endpoint
curl http://localhost:3000/api/fruit/today?sport=NBA
```

### 2. Test Mobile App
1. Start backend server
2. Start Expo development server
3. Open app on device or simulator
4. Verify "Today's Ripe Fruit" loads with data

### 3. Test Web App
1. Start backend server
2. Start Vite development server
3. Open browser to `http://localhost:5173`
4. Verify dashboard loads and displays player cards

## Troubleshooting

### Common Issues

#### Backend Won't Start
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Check Redis is running: `redis-cli ping`
- Verify database credentials in `.env`
- Check port 3000 is available

#### Mobile App Can't Connect to Backend
- Ensure backend is running on port 3000
- Check network connectivity
- On physical device, ensure both devices are on same network
- Update API_BASE URL in mobile app

#### Web App Shows "Network Error"
- Check browser console for CORS errors
- Ensure backend CORS is configured correctly
- Verify backend is running

#### Database Connection Issues
- Check PostgreSQL service status
- Verify database exists: `psql -l`
- Test connection: `psql -h localhost -U free_fruit_user -d free_fruit`

### Getting Help

1. Check the console output for error messages
2. Verify all services are running (`npm run status`)
3. Review the backend logs in `backend/logs/`
4. Check network connectivity between components
5. Ensure all environment variables are correctly set

## Next Steps

After successful setup:

1. **Development**: Start coding features and fixes
2. **Testing**: Run comprehensive tests across all platforms
3. **API Integration**: Add real sports data API integration
4. **Deployment**: Follow the DEPLOYMENT.md guide for production setup

---

**Need Help?** Refer to the README.md for project overview or DEPLOYMENT.md for production setup instructions.