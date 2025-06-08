const next = require('next');
const https = require('https');
const fs = require('fs');
const express = require('express');
const path = require('path');

const app = next({ dev: true });
const handle = app.getRequestHandler();

const options = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem'),
};

app.prepare().then(() => {
  const server = express();

  // Statischen public-Ordner bereitstellen
  server.use(express.static(path.join(__dirname, 'public')));

  // Alle anderen Anfragen an Next.js weiterleiten (ohne Pattern!)
  server.use((req, res) => {
    return handle(req, res);
  });

  https.createServer(options, server).listen(3001, () => {
    console.log('> Ready on https://localhost:3001');
  });
});