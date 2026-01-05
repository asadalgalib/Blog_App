import express from 'express';
import { postRoutes } from './modules/post/route';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import cors from 'cors';
// * Midlleware
const app = express()
app.use(express.json());
app.use(cors({
    origin: process.env.APP_URL || "http://localhost:5000",
    credentials: true
}))
// * Better auth
app.all('/api/auth/*splat', toNodeHandler(auth));
// * Routes
app.use("/posts", postRoutes);
// * Default route
app.get("/", (req, res) => {
    res.send("app is running")
})
// * Export app
export default app;