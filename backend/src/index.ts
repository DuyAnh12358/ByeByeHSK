import express, { type Request, type Response } from 'express';
import { connectDB } from './config/db';
import testDbRouter from './routes/test.route';

const app = express();
const PORT = Bun.env.PORT || 3000;

connectDB();

app.use(express.json());

// 2. Kích hoạt Endpoint test kết nối database
app.use('/api/test-db', testDbRouter);

app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'success', message: 'Bun + Express MVC Server' });
});

app.listen(PORT, () => {
  console.log(` Foxes Bun-Express running at http://localhost:${PORT}`);
});