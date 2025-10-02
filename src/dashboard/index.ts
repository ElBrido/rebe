import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { connectDatabase } from '../database';
import { logger } from '../bot/utils/logger';

// Import routes
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import apiRoutes from './routes/api';
import devRoutes from './routes/dev';

const app = express();
const PORT = process.env.DASHBOARD_PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'aura-bot-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Passport
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID!,
  clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  callbackURL: process.env.DISCORD_CALLBACK_URL!,
  scope: ['identify', 'guilds']
}, (accessToken: any, refreshToken: any, profile: any, done: any) => {
  return done(null, profile);
}));

app.use(passport.initialize());
app.use(passport.session());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/api', apiRoutes);
app.use('/dev', devRoutes);

// Home page
app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

// Premium page
app.get('/premium', (req, res) => {
  res.render('premium', { user: req.user });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { user: req.user });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Dashboard error:', err);
  res.status(500).render('error', { error: err, user: req.user });
});

async function start() {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      logger.info(`🌐 Dashboard running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start dashboard:', error);
    process.exit(1);
  }
}

start();
