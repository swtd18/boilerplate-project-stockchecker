const mongoose = require("mongoose");
const db = mongoose.connect(process.env.DB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

console.log(db);
module.exports = db;