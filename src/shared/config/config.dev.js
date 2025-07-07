module.exports = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  environment: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'secret_dev',
  },
  database: {
    mongo: {
      social: process.env.MONGO_URI_SOCIAL || 'mongodb://localhost:27017/social',
      main: process.env.MONGO_URI_MAIN || 'mongodb://localhost:27017/main'
    }
  },
  mongo: {
    uri: process.env.MONGO_URI || '',
  },
  bucket: {
    local: [
      // '/Users/xiaoqing/Library/Mobile Documents/com~apple~CloudDocs/Qing/myProfile/hoi.co.mat.nhu.mu',
      '/Users/xiaoqing/Downloads/Projects/CRX/CRX-One-Finger-Zen/assets/images'
    ],
    gdriveFolders: ['gdrive-folder-id-1', 'gdrive-folder-id-2'],
    s3Buckets: [
      {
        bucketName: 'your-s3-bucket-name',
        prefix: 'optional-folder-prefix/'
      }
    ]
  },
  features: {
    enableDebugMode: true,
  },
  system: {
    environment: 'development',
  },
  email: {
    service: 'gmail',
    user: 'send.yrx@gmail.com',
    pass: 'pylj nswv zlck zomc', // Use App Password here
  },
  thirdParty: {
    imgbb: {
      enabled: true,
      apiKey: process.env.IMGBB_API_KEY,
      endpoint: 'https://api.imgbb.com/1/upload',
    },
    transfersh: {
      enabled: true,
      endpoint: 'https://temp.sh/upload',
    },
    sightengine: {
      enabled: true,
      apiUser: process.env.SIGHTENGINE_API_USER,
      apiSecret: process.env.SIGHTENGINE_API_SECRET,
      endpoint: 'https://api.sightengine.com/1.0/check.json',
    },
    rapidapi: {
      rapidapi_key: process.env.RAPIDAPI_KEY || '',
      tiktok_api: {
        host: process.env.RAPIDAPI_TIKTOK_API_HOST || 'tiktok-api23.p.rapidapi.com',
        endpoint: '/api/post/trending',
      },
      tiktok_scraper: {
        host: process.env.RAPIDAPI_TIKTOK_SCRAPER_HOST || 'tiktok-scraper7.p.rapidapi.com',
        endpoint: '/feed/search',
      },
    },
  },
  ngrok: {
    authtoken: process.env.NGROK_AUTH_TOKEN ,
  },
};
