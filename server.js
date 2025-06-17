import express from 'express';
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import sequelize from "./models/db.js";
import path from 'node:path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const __dirname = import.meta.dirname;
dotenv.config();
const app = express();

app.use(express.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());
const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('DB connected')
  } catch (error) {
    console.error(error);
  }
};
await start();

app.use("/api", authRoutes);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
