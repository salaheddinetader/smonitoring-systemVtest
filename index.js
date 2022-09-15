const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
require("dotenv").config();
var fs = require("fs");
// set the view engine to ejs
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
const http = require("http");
const server = http.createServer();

//fonction save to folder public/data/data.json
function saveToPublicFolder(file, type, callback) {
  const dirPath = path.join(__dirname, "/public/data/");
  fs.writeFile(dirPath + type + ".json", JSON.stringify(file), callback);
}
// push file to server
server
  .on("request", (request, response) => {
    let body = [];
    request
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();

        console.log(`==== ${request.method} ${request.url}`);
        console.log("> Body");
        console.log(body);
        if (body) {
          const obj = JSON.parse(body);
          console.log(obj);

          saveToPublicFolder(obj, "data", function (err) {
            if (err) {
              console.log("File not saved" + err);
              return;
            }
          });
        } else {
          response.writeHead(301, {
            Location: `http://localhost:${process.env.PORTGET}`,
          });
        }
        response.end();
      });
  })
  .listen(process.env.PORTPOST),
  () => {
    console.log(`Server is running on port  ${process.env.PORTGET}`);
  };
// index page

app.get("/", function (req, res) {
  const dirPath = path.join(__dirname, "/public/data/data.json"); //à remplacer par data
  let dataFile = fs.readFileSync(dirPath);
  let data = JSON.parse(dataFile);
  console.log(data);
  res.render("pages/index", { data: data });
});

app.use("/", router);

app.listen(process.env.PORTGET, () => {
  console.log(`Server is running on port ${process.env.PORTGET}`);
});
