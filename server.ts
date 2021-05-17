import express from "express";
import path from "path";
import routes from './routes'

const app = express();
const port = process.env.PORT || 8000

app.use('/api', routes)
app.get("/health", (_, res) => res.sendStatus(200));

app.use(express.static(path.join(__dirname, "./client")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/index.html"));
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
