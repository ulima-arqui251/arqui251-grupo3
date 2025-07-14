const Redis = require('ioredis');
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

const redisClient = new Redis({
  host: 'localhost',
  port: 6379,
  // password: 'tu_password_si_tiene'
});

// Límite por IP: 100 intentos cada 15 min
const loginRateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
    prefix: 'login_attempts:',
  }),
  windowMs: 15* 60 * 1000, // 15 minutos
  max: 100,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    return res.status(429).json({
      error: 'Demasiados intentos de login. Intenta más tarde.',
      captchaRequired: true, // Avisamos al frontend que active CAPTCHA
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginRateLimiter };
