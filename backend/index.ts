import express, { type Request, type Response } from 'express';

const app = express();
const PORT = Bun.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Base Route
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Hello from Bun + Express! 🚀',
    runtime: `Bun ${Bun.version}`
  });
});

// Example API Route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    uptime: process.uptime(),
    timestamp: new Date().toISOString() 
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🦊 Bun-Express server running at http://localhost:${PORT}`);
});