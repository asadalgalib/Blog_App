import express from 'express';
import { postRoutes } from './modules/post/route';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import cors from 'cors';
import { commentRoutes } from './modules/comment/route';
// * Midlleware
const app = express()
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5000',
    credentials: true
}));


// * Routes
// ? Better auth Route
app.all('/api/auth/*splat', toNodeHandler(auth));
// ? Post Route
app.use("/posts", postRoutes);
// ? Comment Route
app.use("/comments", commentRoutes)


// * Default route
app.get("/", (req, res) => {
    res.send("app is running")
})
// * Export app
export default app;