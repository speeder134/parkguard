// backend/src/index.ts
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    status: "ok", 
    message: "ParkGuard backend is running" 
  });
});

// Port dynamique pour Render.com
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});