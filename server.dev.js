
const { exec, spawn } = require('child_process');
const waitOn = require('wait-on');
const axios = require('axios');

const config = require('./src/shared/config');


const PORT = 3000;

(async () => {
  try {
    const child = exec('nodemon server.js', { env: process.env });
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    console.log(`⏳ Waiting for http://${config.host}:${config.port}/ to be ready...`);
    await waitOn({ resources: [`http-get://${config.host}:${config.port}/`] });
    console.log(`✅ Local server is ready on port ${config.port}`);

    // Mở ngrok CLI
    const ngrokProcess = spawn('ngrok', ['http', PORT]);
    ngrokProcess.stdout.pipe(process.stdout);
    ngrokProcess.stderr.pipe(process.stderr);

    console.log(`⏳ Waiting for ngrok Web Interface...`);
    await waitOn({ resources: ['http-get://localhost:4040/api/tunnels'] });
    console.log(`✅ ngrok Web Interface ready`);

    // Thử nhiều lần (ngrok có thể chưa có tunnel ngay lập tức)
    let publicUrl;
    for (let i = 0; i < 5; i++) {
      try {
        const res = await axios.get('http://localhost:4040/api/tunnels');
        const tunnels = res.data.tunnels;
        console.log('🌐 Ngrok tunnels:', tunnels.map(t => `${t.name || 'no-name'} (${t.proto}) → ${t.public_url}`));

        publicUrl = tunnels.find(t => t.proto === 'https')?.public_url;
        if (publicUrl) break;
      } catch (e) {
        console.warn(`🔁 Retry ${i + 1}: Failed to fetch tunnels`, e.message);
      }
      await new Promise(r => setTimeout(r, 1000)); // đợi 1 giây rồi thử lại
    }

    if (!publicUrl) {
      console.error('❌ Ngrok public URL not found');
    } else {
      console.log(`🌍 Public URL: ${publicUrl}`);
      process.env.PUBLIC_URL = publicUrl;
    }
  } catch (err) {
    console.error('❌ Ngrok setup failed:', err.message);
  }
})();
