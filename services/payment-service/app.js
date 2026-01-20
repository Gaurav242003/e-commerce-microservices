require('dotenv').config();
const express = require('express');
const router = require('./routes/route');
const { connectRedis } = require('./database/connectionRedis');
const { pool, query } = require('./database/connectionDB');
const app = express();

app.use(express.json());
app.use('/', router);
/* Global Error Handler */
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

const PORT = process.env.PORT || 3004;


/* Startup */
const startServer = async () => {
  try {
    // Verify PostgreSQL
     await pool.query("SELECT 1");

    // Verify Redis
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`Payment Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
};

startServer();