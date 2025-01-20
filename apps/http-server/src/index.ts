import express, { application } from "express";
import authRoutes from "./routes/authRoutes";
import roomRoutes from "./routes/roomRoutes";
import cors from "cors"
import { verifyJWT } from "./middleware/verifyToken";
const app = express();


const allowedOrigins = [
  'http://localhost:3000',      
  'http://192.168.0.106:3000', 
];

app.use(cors(
{
  origin:allowedOrigins,
  credentials: true,
}
));
app.use(express.json());

app.use("/auth", authRoutes);

app.use("/room", verifyJWT, roomRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "ok",
  });
});
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`app runnig http://localhost:${PORT}`);
});
