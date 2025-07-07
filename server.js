require('dotenv').config();
const app = require('./src/app');
const config = require('./src/shared/config');

const PORT = config.port;
const HOST = config.host;;
const ENV = config.environment;;


app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://${HOST}:${PORT}`);
  console.log(`🛠️  Environment: ${ENV}`);
});
