# Pratikshalay

A modern healthcare appointment booking mobile application built with React Native and Expo, featuring a complete backend API for managing doctors, appointments, and user authentication.

## 🏗️ Project Overview

Pratikshalay is a comprehensive healthcare platform that connects patients with doctors for seamless appointment booking. The application includes user authentication, doctor discovery, favorites management, booking system, and a dedicated doctor portal for managing appointments.

## 🛠️ Tech Stack

### Frontend (Mobile App)
- **React Native** (v0.81.5) - Cross-platform mobile development
- **Expo** (v54.0.33) - Development platform and toolchain
- **React Navigation** (v7.x) - Navigation and routing
  - Bottom Tabs Navigation
  - Native Stack Navigation
- **React Native Vector Icons** (v10.3.0) - Icon library
- **Async Storage** (v2.2.0) - Local data persistence
- **Safe Area Context** (v5.6.0) - Safe area handling

### Backend API
- **Node.js** - JavaScript runtime
- **Express.js** (v4.19.2) - Web framework
- **SQLite3** (v5.1.7) - Database
- **CORS** (v2.8.5) - Cross-origin resource sharing
- **Morgan** (v1.10.0) - HTTP request logger

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 📱 Features

### Patient Features
- **Authentication**: Secure login and signup system
- **Doctor Discovery**: Search and filter doctors by specialty
- **Doctor Profiles**: View detailed information about doctors
- **Favorites**: Save preferred doctors for quick access
- **Appointment Booking**: Schedule appointments with preferred time slots
- **Booking Management**: View, cancel, and manage upcoming appointments
- **User Profile**: Personal information management

### Doctor Features
- **Doctor Authentication**: Separate authentication for doctors
- **Appointment Management**: View and manage patient bookings
- **Status Updates**: Accept, reject, or mark appointments as completed
- **Statistics**: Track booking metrics and performance

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tajinder2317/Pratikshalay.git
   cd Pratikshalay
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Setup backend**
   ```bash
   cd backend/Pratikshalay
   npm install
   npm run seed  # Initialize database with sample data
   npm run dev   # Start backend server
   ```
   The backend API will start on `http://localhost:4000`

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file to set your API URL:
   ```
   EXPO_PUBLIC_API_URL=http://localhost:4000
   ```

5. **Start the mobile app**
   ```bash
   cd ..  # Return to root directory
   npm start
   ```

## 📱 Running the App

### Development Mode
```bash
# Start the development server
npm start

# Run on Android emulator/device
npm run android

# Run on iOS simulator/device
npm run ios

# Run in web browser
npm run web
```

### Production Build
```bash
# Build for Android
expo build:android

# Build for iOS
expo build:ios
```

## 🗂️ Project Structure

```
Pratikshalay/
├── src/
│   ├── api/           # API client and endpoints
│   ├── components/    # Reusable UI components
│   ├── context/       # React context providers
│   ├── data/          # Static data and constants
│   ├── navigation/    # Navigation configuration
│   ├── screens/       # Screen components
│   └── theme/         # App theming and styles
├── backend/
│   └── Pratikshalay/
│       ├── src/
│       │   ├── database.sqlite  # SQLite database
│       │   ├── db.js           # Database configuration
│       │   ├── index.js        # Express server
│       │   └── seed.js         # Database seeding
│       └── package.json
├── assets/            # App assets (icons, images)
├── App.js            # Main app component
├── app.json          # Expo configuration
└── package.json      # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables
- `EXPO_PUBLIC_API_URL`: Backend API URL (default: https://pratikshalay-backend.onrender.com)

### Expo Configuration
The app is configured in `app.json` with:
- App name: "Pratikshalay"
- Package: `com.tajinder2317.pratikshalay`
- EAS project ID for over-the-air updates

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `PUT /api/auth/profile` - Update user profile
- `POST /api/doctor-auth/signup` - Doctor registration
- `POST /api/doctor-auth/login` - Doctor login

### Doctors
- `GET /api/doctors` - List doctors with filters
- `GET /api/doctors/:id` - Get doctor details
- `POST /api/doctors` - Create new doctor

### Appointments
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/:id` - Cancel booking
- `PATCH /api/doctor/bookings/:id/status` - Update booking status

### Favorites
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:id` - Remove from favorites

### Statistics
- `GET /api/stats` - Get user statistics
- `GET /api/doctor/stats` - Get doctor statistics

## 🎨 UI Components

The app includes several reusable components:
- **DoctorCard**: Display doctor information
- **BookingCard**: Show appointment details
- **SearchBar**: Doctor search functionality
- **FilterModal**: Specialty and sorting filters
- **TabIcon**: Custom tab navigation icons

## 🔒 Authentication Flow

1. **Splash Screen**: Initial loading and user session check
2. **Authentication Stack**: Login/Signup screens for unauthenticated users
3. **Main App**: Bottom tab navigation for authenticated users
4. **User Context**: Global state management for authentication

## 📊 Database Schema

The SQLite database includes:
- **Users**: Patient information and authentication
- **Doctors**: Doctor profiles and specialties
- **Bookings**: Appointment records
- **Favorites**: User favorite doctors
- **AuthTokens**: Session management

## 🚀 Deployment

### Backend Deployment
The backend is deployed on Render.com at `https://pratikshalay-backend.onrender.com`

### Mobile App Deployment
- **Android**: Google Play Store via EAS Build
- **iOS**: Apple App Store via EAS Build
- **OTA Updates**: Enabled via EAS Update

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support or questions:
- Create an issue on GitHub
- Email: tajinder2317@example.com

## 🙏 Acknowledgments

- React Native and Expo teams for the amazing framework
- Healthcare professionals who inspired this application
- Open source community for the valuable libraries and tools
