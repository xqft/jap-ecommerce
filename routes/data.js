const express = require("express");
const path    = require("path");
const router  = express.Router();

const data = path.join(__dirname, "../data");

router.get("/cats", (_req, res) => {
  res.sendFile(path.join(data, "cats", "cat.json"))
})

router.get("/:dir/:id", (req, res) => {
  const { dir, id } = req.params;
  res.sendFile(path.join(data, dir, id + ".json"),
  err => {
    if (err) { 
      res.sendStatus("404").json({});
    }
  });
})

module.exports = router;
