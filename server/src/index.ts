import express from 'express';
import router from './routes';

const app = express();
const PORT = 5000;

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});