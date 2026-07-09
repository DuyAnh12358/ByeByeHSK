// PHẢI là import/side-effect ĐẦU TIÊN của cả file - đảm bảo .env được nạp vào
// process.env TRƯỚC KHI bất kỳ module nào khác (đặc biệt @clerk/express) chạy code
// khởi tạo của nó. Import thường thực thi theo thứ tự viết trong file, trước cả
// các dòng code phía dưới - nên nếu để configDotenv() ở dưới các import khác như
// trước đây, "@clerk/express" có thể đã đọc process.env.CLERK_SECRET_KEY trước khi
// nó được nạp, dẫn tới verify token luôn thất bại trong im lặng.
import 'dotenv/config';

import express, { type Request, type Response } from 'express';
import { clerkMiddleware } from '@clerk/express';
import { connectDB } from './config/db';
import testDbRouter from './routes/test.route';
import vocabulariesRouter from './routes/vocabulary.route';
import { configDotenv } from 'dotenv';

configDotenv();

const app = express();
const PORT = Bun.env.PORT || 3000;

connectDB();

app.use(express.json());


// 2. Kích hoạt Endpoint test kết nối database
app.use('/api/test-db', testDbRouter);
app.use('/api/vocabularies', vocabulariesRouter);

app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'success', message: 'Bun + Express MVC Server' });
});

app.listen(PORT, () => {
  console.log(` Foxes Bun-Express running at http://localhost:${PORT}`);
});