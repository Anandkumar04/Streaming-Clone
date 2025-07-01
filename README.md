# Appointment Booking Platform - MERN Stack

A complete appointment booking platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring modern UI design and comprehensive booking functionality.

## 🚀 Features

### For Customers
- Browse available services by category
- View detailed service information and provider profiles
- Book appointments with real-time availability checking
- Manage bookings through personal dashboard
- Secure user authentication and profile management

### For Service Providers
- Create and manage service listings
- Set availability schedules
- Confirm/cancel appointments
- Track booking statistics
- Manage customer interactions

### Technical Features
- **Responsive Design**: Mobile-first approach with Material-UI components
- **Real-time Updates**: Live availability checking and booking management
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **RESTful API**: Well-structured backend with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Modern UI**: Clean, professional design with Material-UI
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error management

## 🛠️ Tech Stack

### Frontend
- **React 18+** with functional components and hooks
- **Material-UI** for modern component library
- **React Router** for navigation
- **Axios** for API communication
- **Context API** for state management

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Express Validator** for input validation
- **CORS** for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anandkumar04/Streaming-Clone.git
   cd Streaming-Clone
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   npm run install-server
   
   # Install client dependencies
   npm run install-client
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file in server directory
   cp server/.env.example server/.env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/appointment-booking
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the application**
   ```bash
   # Start both frontend and backend concurrently
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000


