import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req,res) => {
    res.send("Hello Altaf!")
})

app.get('/api/status', (req,res) => {
    res.json({
        success: true,
        message: "API is working fine"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})