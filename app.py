import os

# Base directory
BASE_DIR = "naesam-pets-backend"

# File contents based on your inputs
files = {
    "package.json": """{
  "name": "naesam-pets-backend",
  "version": "1.0.0",
  "description": "Ethical Pet Rescue & Adoption Platform Backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "seed": "node scripts/seedDatabase.js",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "keywords": ["pet", "rescue", "adoption", "ethical", "tamil"],
  "author": "Naesam Pets Team",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^1.40.0",
    "socket.io": "^4.7.2",
    "node-cron": "^3.0.2",
    "nodemailer": "^6.9.4",
    "twilio": "^4.15.0",
    "express-rate-limit": "^6.8.1",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express-validator": "^7.0.1",
    "winston": "^3.10.0",
    "compression": "^1.7.4",
    "swagger-ui-express": "^5.0.0",
    "swagger-jsdoc": "^6.2.8",
    "joi": "^17.9.2",
    "sharp": "^0.32.5",
    "moment": "^2.29.4",
    "uuid": "^9.0.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.2",
    "supertest": "^6.3.3",
    "eslint": "^8.47.0",
    "eslint-config-standard": "^17.1.0",
    "eslint-plugin-node": "^11.1.0"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}""",

    "server.js": """const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');
require('dotenv').config();

const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');
const adoptionRoutes = require('./routes/adoptions');
const rescueRoutes = require('./routes/rescue');
const vetRoutes = require('./routes/veterinary');
const volunteerRoutes = require('./routes/volunteer');
const donationRoutes = require('./routes/donations');
const chatRoutes = require('./routes/chat');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Naesam Pets API',
      version: '1.0.0',
      description: 'Ethical Pet Rescue & Adoption Platform API',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js', './models/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/naesam-pets', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  logger.info('Connected to MongoDB');
  console.log('✅ Database connected successfully');
})
.catch(err => {
  logger.error('MongoDB connection error:', err);
  console.error('❌ Database connection failed:', err.message);
  process.exit(1);
});

// Socket.IO for real-time features
const connectedUsers = new Map();

io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);
   
  socket.on('user-online', (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.userId = userId;
    socket.broadcast.emit('user-status', { userId, status: 'online' });
  });
   
  socket.on('join-chat', (chatId) => {
    socket.join(`chat-${chatId}`);
  });
   
  socket.on('join-rescue-team', (teamId) => {
    socket.join(`team-${teamId}`);
  });
   
  socket.on('send-message', (data) => {
    socket.to(`chat-${data.chatId}`).emit('new-message', data);
  });
   
  socket.on('emergency-alert', (data) => {
    // Broadcast to all rescue teams in the area
    socket.broadcast.emit('emergency-alert', data);
  });
   
  socket.on('adoption-update', (data) => {
    io.to(`user-${data.userId}`).emit('adoption-status-changed', data);
  });
   
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      socket.broadcast.emit('user-status', { 
        userId: socket.userId, 
        status: 'offline' 
      });
    }
  });
});

// Make io accessible to routes
app.set('io', io);
app.set('connectedUsers', connectedUsers);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/rescue', rescueRoutes);
app.use('/api/veterinary', vetRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Naesam Pets API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health'
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
🚀 Naesam Pets Server is running!
📍 Port: ${PORT}
🌐 Environment: ${process.env.NODE_ENV || 'development'}
📚 API Documentation: http://localhost:${PORT}/api-docs
💚 Health Check: http://localhost:${PORT}/health
  `);
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  server.close(() => {
    logger.info('Process terminated');
    mongoose.connection.close();
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received');
  server.close(() => {
    logger.info('Process terminated');
    mongoose.connection.close();
    process.exit(0);
  });
});

module.exports = app;""",

    ".env.example": """# Server Configuration
NODE_ENV=development
PORT=5000
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/naesam-pets

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_make_it_strong_and_unique

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@naesamepets.com

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Payment Gateway (Optional)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Admin Configuration
ADMIN_EMAIL=admin@naesamepets.com
ADMIN_PHONE=+919876543210

# File Upload Limits
MAX_FILE_SIZE=10485760
MAX_FILES_PER_UPLOAD=5

# Cache Configuration
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log""",

    "models/User.js": """const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^(\+91|0)?[6789]\d{9}$/, 'Please enter a valid Indian phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['adopter', 'rescuer', 'volunteer', 'veterinarian', 'admin'],
    default: 'adopter'
  },
  avatar: {
    url: String,
    publicId: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  verificationDocuments: [{
    url: String,
    publicId: String,
    documentType: {
      type: String,
      enum: ['aadhar', 'pan', 'driving_license', 'passport', 'voter_id']
    },
    verified: { type: Boolean, default: false },
    uploadDate: { type: Date, default: Date.now }
  }],
  preferences: {
    language: {
      type: String,
      enum: ['en', 'ta', 'hi'],
      default: 'en'
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    },
    petPreferences: {
      species: [{ type: String, enum: ['dog', 'cat', 'bird', 'rabbit', 'other'] }],
      size: [{ type: String, enum: ['small', 'medium', 'large'] }],
      age: { min: Number, max: Number },
      specialNeeds: { type: Boolean, default: false }
    },
    locationRadius: { type: Number, default: 50 } // km
  },
  stats: {
    adoptionCount: { type: Number, default: 0 },
    donationTotal: { type: Number, default: 0 },
    volunteerHours: { type: Number, default: 0 },
    rescueCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 }
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  loginHistory: [{
    date: { type: Date, default: Date.now },
    ip: String,
    userAgent: String
  }],
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ "address.coordinates": "2dsphere" });
userSchema.index({ role: 1, isActive: 1 });

// Virtual for full address
userSchema.virtual('fullAddress').get(function() {
  const parts = [this.address?.street, this.address?.city, this.address?.state, this.address?.pincode].filter(Boolean);
  return parts.join(', ');
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
   
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate verification token
userSchema.methods.generateVerificationToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  this.verificationToken = token;
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return token;
};

// Remove sensitive data from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.verificationToken;
  delete userObject.resetPasswordToken;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);""",

    "models/Pet.js": """const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pet name is required'],
    trim: true,
    maxlength: [30, 'Pet name cannot exceed 30 characters']
  },
  species: {
    type: String,
    required: [true, 'Species is required'],
    enum: ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'guinea_pig', 'other']
  },
  breed: {
    type: String,
    required: [true, 'Breed is required'],
    trim: true
  },
  age: {
    years: { type: Number, min: 0, max: 30, default: 0 },
    months: { type: Number, min: 0, max: 11, default: 0 },
    estimated: { type: Boolean, default: true }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    required: true
  },
  size: {
    type: String,
    enum: ['tiny', 'small', 'medium', 'large', 'extra-large'],
    required: true
  },
  weight: {
    value: { type: Number, min: 0.1, max: 200 },
    unit: { type: String, default: 'kg', enum: ['kg', 'g', 'lbs'] },
    lastUpdated: { type: Date, default: Date.now }
  },
  color: {
    primary: { type: String, required: true },
    secondary: String,
    pattern: { type: String, enum: ['solid', 'spotted', 'striped', 'mixed'] }
  },
  images: [{
    url: { type: String, required: true },
    publicId: String,
    isPrimary: { type: Boolean, default: false },
    caption: String,
    uploadDate: { type: Date, default: Date.now }
  }],
  description: {
    type: String,
    required: [true, 'Pet description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  rescueStory: {
    type: String,
    maxlength: [2000, 'Rescue story cannot exceed 2000 characters']
  },
  location: {
    address: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: String,
    country: { type: String, default: 'India' },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  rescueTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RescueTeam',
    required: true
  },
  fosterer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  medicalInfo: {
    vaccinations: [{
      name: { type: String, required: true },
      date: { type: Date, required: true },
      nextDue: Date,
      veterinarian: String,
      batchNumber: String,
      notes: String
    }],
    spayedNeutered: {
      status: { type: Boolean, default: false },
      date: Date,
      veterinarian: String
    },
    medicalConditions: [{
      condition: String,
      severity: { type: String, enum: ['mild', 'moderate', 'severe'] },
      treatmentStatus: { type: String, enum: ['ongoing', 'completed', 'monitoring'] },
      notes: String
    }],
    medications: [{
      name: { type: String, required: true },
      dosage: String,
      frequency: String,
      startDate: { type: Date, required: true },
      endDate: Date,
      prescribedBy: String,
      notes: String
    }],
    allergies: [String],
    lastVetVisit: Date,
    nextVetVisit: Date,
    vetRecords: [{
      date: { type: Date, required: true },
      veterinarian: String,
      clinic: String,
      reason: String,
      diagnosis: String,
      treatment: String,
      notes: String,
      cost: Number,
      documents: [String] // Cloudinary URLs
    }],
    microchip: {
      hasChip: { type: Boolean, default: false },
      chipId: String,
      registeredTo: String,
      implantDate: Date
    }
  },
  behavior: {
    temperament: [{
      type: String,
      enum: ['friendly', 'calm', 'energetic', 'playful', 'gentle', 'protective', 'independent', 'social', 'shy', 'aggressive']
    }],
    energyLevel: {
      type: String,
      enum: ['very-low', 'low', 'medium', 'high', 'very-high'],
      required: true
    },
    socialBehavior: {
      goodWithKids: { type: Boolean, default: false },
      kidAgeRecommendation: { type: String, enum: ['toddlers', 'school-age', 'teenagers', 'all-ages'] },
      goodWithDogs: { type: Boolean, default: false },
      goodWithCats: { type: Boolean, default: false },
      goodWithOtherPets: { type: Boolean, default: false },
      goodWithStrangers: { type: Boolean, default: false }
    },
    training: {
      houseTrained: { type: Boolean, default: false },
      leashTrained: { type: Boolean, default: false },
      crateTrained: { type: Boolean, default: false },
      basicCommands: [String],
      behaviorIssues: [String],
      trainingNotes: String
    },
    activityLevel: {
      exerciseNeeds: { type: String, enum: ['minimal', 'moderate', 'high', 'very-high'] },
      playfulness: { type: Number, min: 1, max: 5 },
      mentalStimulation: { type: String, enum: ['low', 'moderate', 'high'] }
    }
  },
  specialNeeds: {
    hasSpecialNeeds: { type: Boolean, default: false },
    requirements: [String],
    careInstructions: String,
    estimatedMonthlyCost: Number,
    equipmentNeeded: [String]
  },
  adoptionInfo: {
    status: {
      type: String,
      enum: ['available', 'pending', 'adopted', 'not_ready', 'hold', 'medical_hold'],
      default: 'available'
    },
    fee: {
      type: Number,
      default: 0,
      min: 0
    },
    requirements: [String],
    idealHome: {
      type: String,
      maxlength: [500, 'Ideal home description cannot exceed 500 characters']
    },
    adoptionProcess: {
      applicationRequired: { type: Boolean, default: true },
      homeVisitRequired: { type: Boolean, default: true },
      meetAndGreetRequired: { type: Boolean, default: true },
      trialPeriod: { type: Number, default: 0 } // days
    }
  },
  priority: {
    emergency: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    urgent: { type: Boolean, default: false },
    reason: String
  },
  engagement: {
    views: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    inquiries: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      date: { type: Date, default: Date.now },
      message: String,
      responded: { type: Boolean, default: false },
      responseDate: Date
    }],
    shares: { type: Number, default: 0 }
  },
  timeline: [{
    event: {
      type: String,
      enum: ['rescued', 'medical_checkup', 'vaccination', 'foster_placed', 'available_for_adoption', 'application_received', 'adopted', 'returned']
    },
    date: { type: Date, default: Date.now },
    notes: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  rescueDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
petSchema.index({ "location.coordinates": "2dsphere" });
petSchema.index({ species: 1, "adoptionInfo.status": 1 });
petSchema.index({ rescueTeam: 1 });
petSchema.index({ "priority.emergency": 1 });
petSchema.index({ "priority.featured": 1 });
petSchema.index({ createdAt: -1 });

// Virtual for age display
petSchema.virtual('ageDisplay').get(function() {
  if (!this.age) return 'Unknown';
   
  const { years, months } = this.age;
   
  if (years === 0 && months === 0) return 'Under 1 month';
  if (years === 0) return `${months} month${months !== 1 ? 's' : ''}`;
  if (months === 0) return `${years} year${years !== 1 ? 's' : ''}`;
   
  return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
});

// Virtual for primary image
petSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg ? primaryImg.url : (this.images[0] ? this.images[0].url : null);
});

// Virtual for distance (to be calculated dynamically)
petSchema.virtual('distance').get(function() {
  return this._distance;
});

petSchema.set('toJSON', { virtuals: true });
petSchema.set('toObject', { virtuals: true });

// Pre-save middleware
petSchema.pre('save', function(next) {
  // Ensure only one primary image
  if (this.images && this.images.length > 0) {
    let primaryCount = 0;
    this.images.forEach((img, index) => {
      if (img.isPrimary) {
        primaryCount++;
        if (primaryCount > 1) {
          img.isPrimary = false;
        }
      }
    });
     
    // If no primary image, make the first one primary
    if (primaryCount === 0) {
      this.images[0].isPrimary = true;
    }
  }
   
  next();
});

// Method to calculate distance from coordinates
petSchema.methods.calculateDistance = function(lat, lng) {
  if (!this.location.coordinates.latitude || !this.location.coordinates.longitude) {
    return null;
  }
   
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat - this.location.coordinates.latitude) * Math.PI / 180;
  const dLng = (lng - this.location.coordinates.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.location.coordinates.latitude * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
   
  this._distance = Math.round(distance * 100) / 100; // Round to 2 decimal places
  return this._distance;
};

module.exports = mongoose.model('Pet', petSchema);""",

    "models/RescueTeam.js": """const mongoose = require('mongoose');

const rescueTeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Team name cannot exceed 100 characters']
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true
  },
  establishedYear: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear()
  },
  logo: {
    url: String,
    publicId: String
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  contactInfo: {
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: true,
      match: [/^(\+91|0)?[6789]\d{9}$/, 'Please enter a valid Indian phone number']
    },
    emergencyPhone: {
      type: String,
      match: [/^(\+91|0)?[6789]\d{9}$/, 'Please enter a valid Indian phone number']
    },
    whatsapp: {
      type: String,
      match: [/^(\+91|0)?[6789]\d{9}$/, 'Please enter a valid WhatsApp number']
    },
    website: String,
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      youtube: String
    }
  },
  address: {
    street: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  operatingAreas: [{
    city: String,
    state: String,
    radius: { type: Number, default: 50 }, // km
    priority: { type: String, enum: ['primary', 'secondary'], default: 'secondary' }
  }],
  specializations: [{
    type: String,
    enum: ['dogs', 'cats', 'wildlife', 'farm_animals', 'birds', 'exotic_pets', 'emergency_rescue', 'medical_care', 'rehabilitation', 'adoption_services']
  }],
  services: [{
    name: String,
    description: String,
    available: { type: Boolean, default: true },
    cost: { type: Number, default: 0 }
  }],
  certifications: [{
    name: { type: String, required: true },
    issuedBy: String,
    issueDate: Date,
    expiryDate: Date,
    documentUrl: String,
    verified: { type: Boolean, default: false }
  }],
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: {
      type: String,
      enum: ['founder', 'co_founder', 'coordinator', 'rescuer', 'volunteer', 'veterinarian', 'foster_coordinator', 'admin'],
      required: true
    },
    permissions: [{
      type: String,
      enum: ['manage_pets', 'manage_adoptions', 'manage_volunteers', 'manage_donations', 'emergency_response', 'medical_decisions']
    }],
    joinDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    contactInfo: {
      phone: String,
      email: String,
      emergencyContact: Boolean
    }
  }],
  capacity: {
    currentAnimals: { type: Number, default: 0 },
    maxCapacity: { type: Number, required: true },
    temporaryCapacity: { type: Number, default: 0 },
    bySpecies: {
      dogs: { current: { type: Number, default: 0 }, max: Number },
      cats: { current: { type: Number, default: 0 }, max: Number },
      others: { current: { type: Number, default: 0 }, max: Number }
    }
  },
  resources: {
    hasVehicle: { type: Boolean, default: false },
    vehicleDetails: [{
      type: { type: String, enum: ['car', 'van', 'truck', 'ambulance'] },
      capacity: Number,
      available: { type: Boolean, default: true }
    }],
    hasVetSupport: { type: Boolean, default: false },
    vetPartners: [{
      name: String,
      clinic: String,
      phone: String,
      specialization: String,
      emergency: Boolean
    }],
    hasFosterNetwork: { type: Boolean, default: false },
    fosterCount: { type: Number, default: 0 },
    emergencyFunds: { type: Number, default: 0 },
    equipment: [{
      item: String,
      quantity: Number,
      condition: { type: String, enum: ['excellent', 'good', 'fair', 'needs_replacement'] }
    }]
  },
  verification: {
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verificationDate: Date,
    verificationLevel: { type: String, enum: ['basic', 'standard', 'premium'], default: 'basic' },
    documents: [{
      type: { type: String, enum: ['registration', 'tax_exemption', 'insurance', 'license'] },
      url: String,
      verified: Boolean,
      verificationDate: Date
    }],
    backgroundCheck: {
      completed: { type: Boolean, default: false },
      completedDate: Date,
      score: { type: Number, min: 0, max: 100 }
    }
  },
  stats: {
    totalRescues: { type: Number, default: 0 },
    successfulAdoptions: { type: Number, default: 0 },
    currentlyFostering: { type: Number, default: 0 },
    totalVolunteers: { type: Number, default: 0 },
    responseTime: { type: Number, default: 0 }, // Average response time in minutes
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    monthlyRescues: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 } // Percentage of successful rescues
  },
  availability: {
    isActive: { type: Boolean, default: true },
    emergencyAvailable: { type: Boolean, default: true },
    operatingHours: {
      monday: { start: String, end: String, closed: { type: Boolean, default: false } },
      tuesday: { start: String, end: String, closed: { type: Boolean, default: false } },
      wednesday: { start: String, end: String, closed: { type: Boolean, default: false } },
      thursday: { start: String, end: String, closed: { type: Boolean, default: false } },
      friday: { start: String, end: String, closed: { type: Boolean, default: false } },
      saturday: { start: String, end: String, closed: { type: Boolean, default: false } },
      sunday: { start: String, end: String, closed: { type: Boolean, default: false } }
    },
    emergencyHours: {
      available247: { type: Boolean, default: false },
      emergencyPhone: String,
      emergencyEmail: String
    }
  },
  financials: {
    bankAccount: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      accountHolder: String
    },
    donations: {
      totalReceived: { type: Number, default: 0 },
      monthlyGoal: { type: Number, default: 0 },
      transparencyReport: String // URL to financial transparency report
    },
    expenses: {
      monthly: { type: Number, default: 0 },
      medical: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      shelter: { type: Number, default: 0 },
      transport: { type: Number, default: 0 }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
rescueTeamSchema.index({ "address.coordinates": "2dsphere" });
rescueTeamSchema.index({ operatingAreas: 1 });
rescueTeamSchema.index({ "verification.isVerified": 1 });
rescueTeamSchema.index({ "availability.isActive": 1 });
rescueTeamSchema.index({ specializations: 1 });

// Virtual for capacity utilization
rescueTeamSchema.virtual('capacityUtilization').get(function() {
  if (this.capacity.maxCapacity === 0) return 0;
  return Math.round((this.capacity.currentAnimals / this.capacity.maxCapacity) * 100);
});

// Virtual for emergency contact
rescueTeamSchema.virtual('emergencyContact').get(function() {
  const emergencyMember = this.members.find(member => 
    member.contactInfo && member.contactInfo.emergencyContact && member.isActive
  );
  return emergencyMember || null;
});

module.exports = mongoose.model('RescueTeam', rescueTeamSchema);""",

    "models/Adoption.js": """const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  adopter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  rescueTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RescueTeam',
    required: true
  },
  applicationId: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'completed', 'cancelled', 'returned'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  applicationForm: {
    personalInfo: {
      occupation: String,
      income: {
        range: { type: String, enum: ['below_25k', '25k_50k', '50k_100k', '100k_plus'] },
        verified: { type: Boolean, default: false }
      },
      familySize: Number,
      familyMembers: [{
        name: String,
        age: Number,
        relationship: String,
        petAllergies: Boolean
      }]
    },
    livingSituation: {
      type: { type: String, enum: ['house', 'apartment', 'farm', 'hostel', 'other'], required: true },
      ownership: { type: String, enum: ['owned', 'rented', 'family_owned'] },
      size: { type: String, enum: ['small', 'medium', 'large'] },
      hasYard: Boolean,
      yardSize: String,
      fenced: Boolean,
      petFriendly: Boolean,
      landlordApproval: String // URL to approval document
    },
    petExperience: {
      hasPetExperience: Boolean,
      experienceYears: Number,
      experienceDetails: String,
      previousPets: [{
        species: String,
        breed: String,
        ageWhenAdopted: String,
        lifespan: String,
        whatHappened: String
      }],
      currentPets: [{
        species: String,
        breed: String,
        age: String,
        vaccinated: Boolean,
        spayedNeutered: Boolean
      }]
    },
    careCommitment: {
      dailyTimeAvailable: Number, // hours
      exerciseCommitment: String,
      groomingExperience: Boolean,
      trainingExperience: Boolean,
      specialNeedsCare: Boolean,
      lifetimeCommitment: { type: Boolean, required: true },
      financialCommitment: { type: Boolean, required: true },
      timeCommitment: { type: Boolean, required: true }
    },
    workSchedule: {
      workType: { type: String, enum: ['office', 'work_from_home', 'shift_work', 'student', 'retired', 'unemployed'] },
      hoursPerDay: Number,
      daysPerWeek: Number,
      petCareArrangements: String,
      backupCarePlan: String
    },
    veterinaryInfo: {
      hasVet: Boolean,
      vetName: String,
      clinicName: String,
      clinicPhone: String,
      clinicAddress: String,
      estimatedMonthlyCost: Number
    },
    references: [{
      name: { type: String, required: true },
      relationship: String,
      phone: String,
      email: String,
      contacted: { type: Boolean, default: false },
      contactedDate: Date,
      feedback: String,
      approved: Boolean
    }],
    motivation: {
      reasonForAdoption: { type: String, required: true },
      specificPetReason: String,
      expectations: String,
      dealBreakers: [String],
      returnPolicy: { type: Boolean, required: true }
    }
  },
  homeVisit: {
    required: { type: Boolean, default: true },
    scheduled: Boolean,
    scheduledDate: Date,
    conductedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    completedDate: Date,
    duration: Number, // minutes
    report: {
      livingConditions: String,
      safety: String,
      spaceAdequacy: String,
      familyInteraction: String,
      preparedness: String,
      concerns: [String],
      recommendations: [String],
      approved: Boolean,
      score: { type: Number, min: 0, max: 100 }
    },
    photos: [String], // URLs
    notes: String
  },
  meetAndGreet: {
    required: { type: Boolean, default: true },
    scheduled: Boolean,
    scheduledDate: Date,
    location: String,
    conductedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    completedDate: Date,
    duration: Number, // minutes
    interaction: {
      petResponse: String,
      adopterResponse: String,
      familyResponse: String,
      compatibility: { type: Number, min: 1, max: 5 },
      concerns: [String],
      approved: Boolean
    },
    notes: String
  },
  trialPeriod: {
    required: Boolean,
    duration: Number, // days
    startDate: Date,
    endDate: Date,
    checkIns: [{
      date: Date,
      method: { type: String, enum: ['phone', 'visit', 'video_call'] },
      feedback: String,
      issues: [String],
      satisfactionScore: { type: Number, min: 1, max: 5 }
    }],
    outcome: { type: String, enum: ['successful', 'returned', 'extended'] },
    notes: String
  },
  reviewProcess: {
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewStartDate: Date,
    reviewCompletedDate: Date,
    documentsVerified: Boolean,
    referencesChecked: Boolean,
    backgroundCheck: {
      completed: Boolean,
      completedDate: Date,
      cleared: Boolean,
      notes: String
    },
    finalScore: { type: Number, min: 0, max: 100 },
    reviewNotes: String,
    rejectionReason: String
  },
  adoptionFee: {
    amount: { type: Number, default: 0 },
    breakdown: {
      medical: Number,
      vaccination: Number,
      spayNeuter: Number,
      microchip: Number,
      processing: Number
    },
    paid: { type: Boolean, default: false },
    paymentDate: Date,
    paymentMethod: { type: String, enum: ['cash', 'card', 'upi', 'bank_transfer', 'cheque'] },
    transactionId: String,
    receipt: String // URL
  },
  followUp: [{
    scheduledDate: Date,
    completedDate: Date,
    method: { type: String, enum: ['phone', 'visit', 'video_call', 'form'] },
    contactedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    petHealth: String,
    petBehavior: String,
    adopterSatisfaction: { type: Number, min: 1, max: 5 },
    issues: [String],
    recommendations: [String],
    notes: String,
    photos: [String], // URLs
    nextFollowUp: Date
  }],
  documents: [{
    type: { type: String, enum: ['id_proof', 'address_proof', 'income_proof', 'landlord_approval', 'vet_records', 'photos', 'contract'] },
    url: String,
    uploadDate: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verificationDate: Date
  }],
  contract: {
    signed: Boolean,
    signedDate: Date,
    contractUrl: String,
    terms: [{
      term: String,
      agreed: Boolean
    }],
    witnesses: [{
      name: String,
      signature: String,
      date: Date
    }]
  },
  timeline: [{
    event: {
      type: String,
      enum: ['application_submitted', 'under_review', 'documents_requested', 'home_visit_scheduled', 'home_visit_completed', 'meet_greet_scheduled', 'meet_greet_completed', 'approved', 'rejected', 'adopted', 'trial_started', 'trial_completed', 'returned', 'follow_up']
    },
    date: { type: Date, default: Date.now },
    notes: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    visibility: { type: String, enum: ['public', 'internal'], default: 'public' }
  }],
  communication: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    type: { type: String, enum: ['message', 'update', 'reminder', 'alert'] }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
adoptionSchema.index({ adopter: 1, status: 1 });
adoptionSchema.index({ pet: 1 });
adoptionSchema.index({ rescueTeam: 1, status: 1 });
adoptionSchema.index({ applicationId: 1 });
adoptionSchema.index({ createdAt: -1 });

// Virtual for processing time
adoptionSchema.virtual('processingTime').get(function() {
  if (this.status === 'pending') {
    return Date.now() - this.createdAt.getTime();
  }
  const completedEvent = this.timeline.find(event => 
    ['approved', 'rejected', 'completed'].includes(event.event)
  );
  if (completedEvent) {
    return completedEvent.date.getTime() - this.createdAt.getTime();
  }
  return null;
});

// Generate unique application ID
adoptionSchema.pre('save', async function(next) {
  if (!this.applicationId) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.applicationId = `NP${year}${month}${random}`;
  }
  next();
});

module.exports = mongoose.model('Adoption', adoptionSchema);""",

    "middleware/auth.js": """const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
     
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.userId).select('-password');
     
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token is not valid.' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account has been deactivated.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid.' 
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    next();
  };
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
     
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      const user = await User.findById(decoded.userId).select('-password');
       
      if (user && user.isActive) {
        req.user = user;
      }
    }
     
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = { auth, authorize, optionalAuth };""",

    "middleware/errorHandler.js": """const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`Error ${err.message}`, {
    error: err,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;""",

    "utils/logger.js": """const winston = require('winston');
const path = require('path');

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = 'logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'naesam-pets-api' },
  transports: [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log') 
    })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;""",

    "utils/email.js": """const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production email configuration
    return nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // Development: Use Ethereal for testing
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'ethereal.user@ethereal.email',
          pass: 'ethereal.pass'
      }
    });
  }
};

const transporter = createTransporter();

// Email templates
const templates = {
  welcome: (data) => ({
    subject: `Welcome to Naesam Pets, ${data.name}! 🐾`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Welcome to Naesam Pets! 🐾</h2>
        <p>Dear ${data.name},</p>
        <p>Thank you for joining our ethical pet rescue and adoption community!</p>
        <p>At Naesam Pets, we believe every animal deserves a loving home. You're now part of a community dedicated to ending illegal pet sales and supporting ethical rescue operations.</p>
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>What's next?</h3>
          <ul>
            <li>Complete your profile verification</li>
            <li>Browse available pets for adoption</li>
            <li>Connect with rescue teams in your area</li>
            <li>Consider volunteering or donating</li>
          </ul>
        </div>
        <p>If you have any questions, our support team is here to help!</p>
        <p>With love,<br>The Naesam Pets Team</p>
      </div>
    `
  }),
   
  adoptionApproved: (data) => ({
    subject: `🎉 Your adoption application has been approved!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Congratulations! 🎉</h2>
        <p>Dear ${data.adopterName},</p>
        <p>Great news! Your adoption application for <strong>${data.petName}</strong> has been approved!</p>
        <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Next Steps:</h3>
          <ol>
            <li>Check your account for the adoption contract.</li>
            <li>Schedule the final pickup/meeting.</li>
          </ol>
        </div>
        <p>We are so happy for you and ${data.petName}!</p>
        <p>With love,<br>The Naesam Pets Team</p>
      </div>
    `
  })
};

module.exports = { transporter, templates };"""
}

# --- PLACEHOLDERS FOR MISSING FILES ---
# To ensure the server starts without crashing, we create simple router stubs
# for files that were imported in server.js but not provided in the prompt.

stub_routes = [
    'auth', 'pets', 'adoptions', 'rescue', 'veterinary', 
    'volunteer', 'donations', 'chat', 'notifications', 'admin'
]

for route in stub_routes:
    files[f"routes/{route}.js"] = f"""const express = require('express');
const router = express.Router();

// Placeholder route for {route}
router.get('/', (req, res) => {{
    res.json({{ message: '{route} route working' }});
}});

module.exports = router;
"""

# Other missing folder structures
files["uploads/.gitkeep"] = ""
files["config/database.js"] = "// Database config moved to server.js in this setup\nmodule.exports = {};"
files["scripts/seedDatabase.js"] = "console.log('Seed script placeholder');"

# --- EXECUTION ---

def create_project_structure():
    print(f"🚀 Generating project: {BASE_DIR}...")
    
    for file_path, content in files.items():
        full_path = os.path.join(BASE_DIR, file_path)
        
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        # Write content to file
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
            
    print(f"✅ Project created successfully at ./{BASE_DIR}")
    print("\nNext steps:")
    print(f"1. cd {BASE_DIR}")
    print("2. npm install")
    print("3. npm run dev")

if __name__ == "__main__":
    create_project_structure()