# SpaceLink - Real-Time Unified Rental Platform

A comprehensive MERN stack application for property rentals, featuring real-time filtering, user authentication, booking system, and property management.

## 🏗️ Project Structure

```
spacelink/
├── client/          # React frontend (Vite + Bootstrap)
├── server/          # Node.js backend (Express + MongoDB)
├── README.md
└── package.json     # Root package.json for workspace
```

## ✨ Features

### 🏠 Property Management

- **Categories**: Property Rentals, Commercial, Land, Parking, Events
- **Smart Filtering**: Real-time search by category, price, location, availability
- **Owner Tools**: Add, edit, disable properties, view bookings
- **Image Support**: Base64 image storage with preview

### 👤 User System

- **JWT Authentication**: Secure login/register system
- **Profile Management**: Complete profile required for bookings
- **Protected Routes**: Authentication-based access control

### 📅 Booking System

- **Real-time Availability**: Check property availability for date ranges
- **Multiple Rent Types**: Hourly, Monthly, Yearly rentals
- **Booking Management**: View, track, and cancel bookings
- **Payment**: On-spot payment system

### 🎨 UI/UX

- **Responsive Design**: Bootstrap-based mobile-first design
- **Modern Interface**: Clean, intuitive user experience
- **Real-time Updates**: Dynamic content loading and filtering

## 🚀 Quick Start

### Prerequisites

- Node.js (v20.12.2 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone and setup the project:**

```bash
git clone <repository-url>
cd spacelink
```

2. **Backend Setup:**

```bash
cd server
npm install
```

3. **Frontend Setup:**

```bash
cd ../client
npm install
```

4. **Environment Configuration:**
   Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/spacelink
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### Running the Application

1. **Start the backend server:**

```bash
cd server
npm run dev
```

2. **Start the frontend (in a new terminal):**

```bash
cd client
npm run dev
```

3. **Access the application:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📊 Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  contact: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  profileComplete: Boolean,
  timestamps: true
}
```

### Properties Collection

```javascript
{
  _id: ObjectId,
  ownerId: ObjectId (ref: User),
  category: String (enum),
  subtype: String,
  title: String,
  description: String,
  price: Number,
  size: String,
  rentType: [String],
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  contact: String,
  image: String (Base64),
  isDisabled: Boolean,
  timestamps: true
}
```

### Bookings Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  propertyId: ObjectId (ref: Property),
  fromDate: Date,
  toDate: Date,
  totalPrice: Number,
  status: String (enum),
  paymentMode: String,
  bookingType: String,
  notes: String,
  timestamps: true
}
```

## 🛣️ API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Properties

- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/featured` - Get featured properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (protected)
- `PUT /api/properties/:id` - Update property (protected)
- `PATCH /api/properties/:id/disable` - Disable property (protected)

### Bookings

- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings/my-bookings` - Get user bookings (protected)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (protected)
- `POST /api/bookings/check-availability` - Check availability

### Users

- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update profile (protected)

## 🏛️ Architecture

### Frontend (React + Vite)

- **React Router**: Client-side routing
- **Bootstrap**: UI components and styling
- **Axios**: HTTP client for API calls
- **Context API**: Global state management

### Backend (Node.js + Express)

- **Express**: Web application framework
- **MongoDB + Mongoose**: Database and ODM
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **Multer**: File upload handling

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Protected Routes**: Middleware-based route protection
- **Input Validation**: Server-side validation for all inputs
- **CORS**: Cross-origin resource sharing configuration

## 📱 Category Rules

| Category         | Subtypes                      | Rent Types     | Description            |
| ---------------- | ----------------------------- | -------------- | ---------------------- |
| Property Rentals | Apartments, Flats, Houses     | Monthly/Yearly | Residential properties |
| Commercial       | Offices, Shops, Warehouses    | Monthly/Yearly | Business spaces        |
| Land             | Agricultural, Commercial Plot | Yearly only    | Land rentals           |
| Parking          | Car, Bike, Garage             | Monthly only   | Parking spaces         |
| Event            | Banquet, Gardens, Halls       | Hourly only    | Event venues           |

## 🚀 Deployment

### Backend (Render/Railway)

1. Create account on Render or Railway
2. Connect GitHub repository
3. Set environment variables
4. Deploy automatically

### Frontend (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables

### Database (MongoDB Atlas)

1. Create MongoDB Atlas account
2. Create cluster and database
3. Update MONGODB_URI in environment

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

For support and questions:

- Create an issue in the repository
- Contact the development team

---

**SpaceLink** - Connecting spaces with people, one rental at a time! 🏠✨
