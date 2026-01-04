import express from 'express';
import { postRoutes } from './modules/post/route';
// * Midlleware
const app = express()
app.use(express.json());
// * Routes
app.use("/posts", postRoutes);
// * Default route
app.get("/", (req, res) => {
    res.send("app is running")
})
// * Export app
export default app;