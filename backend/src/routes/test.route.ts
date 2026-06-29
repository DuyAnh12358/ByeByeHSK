import { Router, type Request, type Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  // Các trạng thái kết nối của Mongoose: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbStates = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const currentStateCode = mongoose.connection.readyState;
  const stateMessage = dbStates[currentStateCode] || 'Unknown';

  // Nếu Mongoose báo đã kết nối (code = 1)
  if (currentStateCode === 1) {
    try {
      // Thực hiện một lệnh ping thực tế tới MongoDB Admin để chắc chắn DB phản hồi
      if (mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
        
        res.status(200).json({
          status: 'success',
          database: {
            state: stateMessage,
            name: mongoose.connection.name,
            host: mongoose.connection.host,
          },
          message: 'Kết nối MongoDB hoạt động hoàn hảo! 🍃'
        });
        return;
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        database: { state: stateMessage },
        message: 'Mongoose báo Connected nhưng không thể truy cập ping tới DB.',
        error: (error as Error).message
      });
      return;
    }
  }

  // Trường hợp chưa kết nối thành công
  res.status(503).json({
    status: 'error',
    database: { state: stateMessage },
    message: 'Hệ thống chưa kết nối được tới MongoDB. Vui lòng kiểm tra lại MONGO_URI trong file .env!'
  });
});

export default router;