const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./database/db');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const acceptMultimedia = require('connect-multiparty');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const WebSocket = require('ws');
const http = require('http');

// Setting up express app
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// dotenv config
dotenv.config();

// cloudinary config
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(acceptMultimedia());

// cors config to accept requests from frontend
const corsOptions = {
    origin: true,
    credentials: true,
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));

// mongodb connection
connectDB();

// Accepting json data
app.use(express.json());

// Define routes
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/cart', cartRoutes);
app.use('/api/product', productRoutes);
app.use('/api/orders', orderRoutes);

// WebSocket setup
wss.on('connection', ws => {
  console.log('New client connected');
  ws.on('message', message => {
    console.log('Received:', message);
    // Handle received messages here
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.send('Welcome to the WebSocket server');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/test', (req, res) => {
    res.send("Hello From the Server");
});
