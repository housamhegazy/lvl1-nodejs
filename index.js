const express = require("express");
const app = express();
const port = 3000;
//هاستدعي ال مونجوز للربط بين مشروعي والداتابيز
const mongoose = require("mongoose");

// app.post('/', (req, res) => {
//   res.send('Got a POST request')
// })
// app.put('/user', (req, res) => {
//   res.send('Got a PUT request at /user')
// })
// app.delete('/user', (req, res) => {
//   res.send('Got a DELETE request at /user')
// })
app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
// link between my project and mongooDB
mongoose
  .connect(
    "mongodb+srv://geohousam_db:sHSV85O1kMDD5njC@hegazystart2025.kx8h76l.mongodb.net/all-data?retryWrites=true&w=majority&appName=hegazystart2025"
  )
  .then(() => {
    //express
    app.get("/", (req, res) => {
      res.sendFile("./views/home.html", { root: __dirname });
    });
  })
  .catch((err) => {
    console.log(err);
  });
