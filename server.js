const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const host = 'http://localhost';
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/static', express.static(path.join(__dirname, 'dist')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('*', (req, res) => {
  console.log("to: " + req.path);
  console.log(Object.keys(req.body)[0]);
  res.end();
});

app.listen(port, 'localhost', (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.info('==> Listening on port %s. Open up %s:%s/ in your browser.', port, host, port);
});
