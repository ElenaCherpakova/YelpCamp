const express = require("express");
const app = express();



app.get('/', (req, res) => {
  res.send('Hello A NEW APP')
})

app.listen(3000, () => {
  console.log("Listening on PORT 3000")
})