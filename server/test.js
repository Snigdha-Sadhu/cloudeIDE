import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("OK");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working" });
});

app.listen(9000, () => {
  console.log("Server running on 9000");
});
