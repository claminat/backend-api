module.exports = {
  env: 'production',
  port: process.env.PORT || 8080,
  mongoUri: process.env.MONGO_URI_PROD,
  jwtSecret: process.env.JWT_SECRET,
  logLevel: 'warn',
};