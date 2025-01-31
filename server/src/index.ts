import express from 'express';
import router from './routes';

const app = express();

app.use('/api', router);
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

app.listen(5000, () => {
  console.log('Server running on port 5000');
});