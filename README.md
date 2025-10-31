# 🍎 Free Fruit - Sports Intelligence Platform

A professional-grade sports analytics platform designed with Steve Jobs aesthetic philosophy, Billy Walters data discipline, and MIT algorithmic intelligence. **NO BETTING REFERENCES** - purely analytical and educational.

## 🎯 Vision

Create the world's most accurate daily sports performance engine — simple on the outside, genius on the inside.

### Guiding Principles
- **Steve Jobs Philosophy**: Elegant simplicity. Data is only powerful when it's understandable in seconds.
- **Billy Walters Mindset**: Precision, consistency, and pattern recognition through numbers.
- **MIT Blackjack Logic**: Statistically optimized decision-making through pattern aggregation and probability calibration.

## 🌟 Core Features

- **Daily Auto-Refresh**: Automated NBA and NFL roster updates at 6AM, 12PM, 5PM Central Time
- **Fruit Score Intelligence**: Confidence metrics (0-100) for every projection
- **Today's Ripe Fruit**: Top 10 most confident daily projections
- **Real-time Updates**: Live Central Time clock and instant data refresh
- **Mobile-First Design**: React Native mobile app + React web interface
- **Advanced Analytics**: MIT-style projection algorithm with weighted averages

## 📱 Screenshots

### Mobile App Screenshots
<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="docs/screenshots/mobile-home.png" width="250" alt="Mobile Home Screen">
        <br><strong>Home Dashboard</strong>
      </td>
      <td align="center">
        <img src="docs/screenshots/mobile-player-detail.png" width="250" alt="Mobile Player Detail">
        <br><strong>Player Analytics</strong>
      </td>
      <td align="center">
        <img src="docs/screenshots/mobile-search.png" width="250" alt="Mobile Search">
        <br><strong>Player Search</strong>
      </td>
    </tr>
  </table>
</div>

### Web Application Screenshots
<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="docs/screenshots/web-home.png" width="400" alt="Web Dashboard">
        <br><strong>Web Dashboard</strong>
      </td>
      <td align="center">
        <img src="docs/screenshots/web-player-detail.png" width="400" alt="Web Player Detail">
        <br><strong>Player Analytics</strong>
      </td>
    </tr>
  </table>
</div>

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- SportsData.io API key

### Complete Setup Guide
For detailed setup instructions, see **[SETUP.md](./SETUP.md)**:

### Docker Setup (Recommended)
```bash
# Start all services with Docker
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
```

### Manual Setup
```bash
# 1. Backend Setup
cd backend
npm install
cp .env.example .env
# Configure your database and API keys in .env
npm run migrate
npm run dev

# 2. Mobile App Setup (new terminal)
cd mobile
npm install
npx expo start

# 3. Web App Setup (new terminal)
cd web
npm install
npm run dev
```

## 🏗️ Architecture

### Technology Stack
- **Backend**: Node.js + Express + PostgreSQL + Redis
- **Mobile**: React Native (Expo) for iOS/Android
- **Web**: React + Vite + Tailwind CSS
- **Database**: PostgreSQL (primary) + Redis (caching)
- **Scheduling**: node-cron for automated data refresh
- **Data Sources**: SportsData.io / Sportradar API

### Project Structure
```
free-fruit/
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── server.js          # Main Express server
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Projection engine & data service
│   │   ├── database/          # PostgreSQL & Redis connections
│   │   ├── scheduler/         # Automated daily refresh jobs
│   │   └── middleware/        # Error handling & logging
│   └── package.json
├── mobile/                     # React Native mobile app (Expo)
│   ├── src/
│   │   ├── screens/           # Home, Search, PlayerDetail, Watchlist, Settings
│   │   ├── components/        # FruitScore, TopFruitList, CentralTimeClock
│   │   └── constants/         # Steve Jobs minimalist theme
│   └── package.json
├── web/                        # React web application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Main application pages
│   │   ├── App.jsx            # Main app component
│   │   └── App.css            # Custom styles with Tailwind
│   └── package.json
├── SETUP.md                   # Detailed setup instructions
├── DEPLOYMENT.md              # Production deployment guide
├── docker-compose.yml         # Docker development environment
└── .gitignore                 # Git ignore rules
```

## 📊 Projection Algorithm

### MIT-Style Mathematical Model
```javascript
// Weighted average of recent performance
weights = [0.40, 0.30, 0.20, 0.07, 0.03]  // Last 5 NBA games
weightedAvg = recentStats.reduce((sum, stat, i) => sum + (stat * weights[i]), 0)

// Contextual adjustments
opponentAdj = 1 + ((leagueAvg - opponentRank) * 0.01)
homeAdj = game.isHome ? 1.03 : 0.97
restAdj = game.restDays >= 2 ? 1.05 : 1.00
injuryAdj = {Active: 1, Limited: 0.85, Questionable: 0.7, Out: 0}[player.status]

finalProjection = weightedAvg * opponentAdj * homeAdj * restAdj * injuryAdj

// Fruit Score (confidence)
fruitScore = 100 - (stdDev * volatilityFactor)
```

### Daily Refresh Schedule
- **6:00 AM CT**: Full roster and projection refresh
- **12:00 PM CT**: Midday injury updates
- **5:00 PM CT**: Pre-game final adjustments

## 🎨 Design Philosophy

### Color Palette (Steve Jobs Minimalist)
- **Primary**: `#1CE5C8` (Electric teal)
- **Background**: `#0B132B` (Midnight navy)
- **Surface**: `#1a2332` (Darker navy)
- **Text Primary**: `#F2F5FA` (White)
- **Text Secondary**: `#8B9DC3` (Muted teal)

### Fruit Score Intelligence
- **90-100**: Exceptional confidence (Green)
- **80-89**: High confidence (Teal)
- **65-79**: Medium confidence (Yellow)
- **50-64**: Low confidence (Orange)
- **Below 50**: Very low confidence (Red)

## 📱 Mobile Features

### Key Screens
- **Home**: Today's Ripe Fruit with Central Time clock
- **Search**: Player search with autocomplete and filters
- **Player Detail**: Detailed analytics and recent performance
- **Watchlist**: Personal player tracking with AsyncStorage
- **Settings**: App configuration and preferences

### UI Components
- Fruit Score displays with color-coded confidence
- Real-time Central Time clock
- Hamburger navigation drawer
- Mobile-optimized card layouts
- Pull-to-refresh functionality

### Platform Support
- **iOS**: iPhone and iPad (iOS 13+)
- **Android**: Phone and tablet (Android 8+)
- **Web**: PWA capabilities for mobile browsers

## 🌐 Web Features

### Key Features
- Sidebar navigation with live stats
- Advanced search and filtering
- Detailed player analytics with charts
- Responsive desktop layout
- Real-time data updates

### Architecture
- Vite + React + Tailwind CSS
- Component-based architecture
- Mobile-responsive design
- API integration with backend
- Progressive Web App (PWA) features

## 📈 Data Sources

### Primary APIs
- **SportsData.io**: NBA/NFL player stats and schedules
- **Sportradar**: Real-time game data and injuries
- **Team Sites**: Official roster and injury reports

### Data Processing
- Automated daily ingestion at specified CT times
- Real-time cache updates via Redis
- Historical trend analysis
- Contextual adjustment calculations

## 🚀 Deployment

For complete deployment instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**:

### Quick Deployment Options

#### Backend (Render)
```bash
# Connect GitHub repository
# Deploy to Render with PostgreSQL + Redis add-ons
# Configure environment variables
```

#### Web (Vercel)
```bash
cd web
npm run build
# Deploy to Vercel from GitHub
```

#### Mobile (Expo EAS)
```bash
eas build --platform ios
eas build --platform android
eas submit --platform ios
eas submit --platform android
```

### Production Checklist
- [ ] Configure production environment variables
- [ ] Set up SSL certificates
- [ ] Enable database backups
- [ ] Configure monitoring and logging
- [ ] Test all deployment procedures
- [ ] Set up CI/CD pipeline

## 🧪 Testing

### Manual Testing
```bash
# Backend API testing
curl http://localhost:3000/health
curl http://localhost:3000/api/fruit/today?sport=NBA

# Mobile app testing
cd mobile && npm run test

# Web app testing
cd web && npm run test
```

### Automated Testing
```bash
# Backend tests
cd backend && npm test

# Mobile E2E tests
cd mobile && npx detox test

# Web E2E tests  
cd web && npx cypress run
```

## 📚 API Documentation

### Core Endpoints
- `GET /api/fruit/today?sport=NBA` - Today's projections
- `GET /api/fruit/player/:id` - Player details
- `GET /api/fruit/search?q=player_name` - Player search
- `GET /health` - Service health check

### Response Format
```json
{
  "success": true,
  "data": {
    "ripeFruit": [...],
    "totalProjections": 156,
    "lastUpdated": "2024-01-15T12:00:00Z"
  }
}
```

### API Testing
Import the Postman collection from `docs/api/Free-Fruit-API.postman_collection.json` for comprehensive API testing.

## 🎯 Success Metrics

### Key Performance Indicators
- **Daily Active Users**: Track mobile and web usage
- **Projection Accuracy**: Compare predictions vs. actual results
- **Data Freshness**: Monitor automated refresh success rates
- **User Engagement**: Watchlist additions and player detail views

### Analytics Integration
```javascript
// Google Analytics events
gtag('event', 'player_view', {
  'player_name': 'LeBron James',
  'sport': 'NBA',
  'fruit_score': 94
});
```

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details

## 👥 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make changes following the Fortune 5000 quality standards
4. Test thoroughly across mobile and web platforms
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Submit a pull request

### Code Standards
- **ESLint**: Enforced JavaScript/React standards
- **Prettier**: Consistent code formatting
- **TypeScript**: Type safety for critical components
- **Testing**: Minimum 80% code coverage
- **Documentation**: Comprehensive inline documentation

## 🏆 Fortune 5000 Quality Standards

This platform is built to enterprise-grade standards with:
- ✅ Professional error handling and logging
- ✅ Comprehensive API documentation
- ✅ Automated testing and CI/CD
- ✅ Scalable architecture design
- ✅ Mobile-first responsive design
- ✅ Real-time data processing
- ✅ Enterprise security practices
- ✅ Docker containerization
- ✅ Production-ready deployment guides

## 📖 Documentation

### Available Documentation
- **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[API.md](./docs/api/API.md)** - Complete API documentation
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System architecture details

### Development Tools
- **Storybook**: Component documentation (`npm run storybook`)
- **Swagger UI**: API documentation (served at `/docs`)
- **Postman Collection**: API testing ([Download](./docs/api/Free-Fruit-API.postman_collection.json))

## 🔧 Troubleshooting

### Common Issues

#### Backend won't start
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check Redis status
redis-cli ping

# View backend logs
docker-compose logs -f backend
```

#### Mobile app can't connect
- Ensure backend is running on port 3000
- Update API_BASE_URL in `mobile/src/screens/HomeScreen.js`
- Check network connectivity between devices

#### Database connection errors
```bash
# Test database connection
psql -h localhost -U postgres -d free_fruit

# Check PostgreSQL logs
docker-compose logs -f postgres
```

### Getting Help
1. Check the troubleshooting section in [SETUP.md](./SETUP.md)
2. Review backend logs in `backend/logs/`
3. Use browser developer tools for web app issues
4. Check Expo CLI logs for mobile app problems

## 🌍 System Requirements

### Development
- **OS**: macOS, Linux, or Windows 10/11
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space
- **Node.js**: 18.0.0 or later

### Production
- **Server**: 2GB RAM minimum, 4GB recommended
- **Database**: PostgreSQL 13+, 2GB storage
- **Cache**: Redis 6+, 1GB memory
- **Network**: SSL certificate, domain name

---

**Built with precision. Designed for insight. Trusted by analysts.**

### Support
For technical support or questions:
- Create an [Issue](https://github.com/your-username/free-fruit/issues)
- Review the [Documentation](./docs/)
- Check [Troubleshooting Guide](./SETUP.md#troubleshooting)

### Release Information
- **Version**: 1.0.0
- **Last Updated**: October 31, 2024
- **Compatibility**: Node.js 18+, React Native 0.72+, React 18+