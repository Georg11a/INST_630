// server.js
// where your node app starts

// init project
import express from "express";
import fetch from "node-fetch";
import path from "path";
import bodyParser from 'body-parser';

import fs from 'fs';
const legoBrickData = JSON.parse(fs.readFileSync('./data/lego_bricks.json', 'utf8'));


const app = express();
const __dirname = path.resolve();

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// Parse request.body and make it available
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// Demo of how to write api
app.get("/api", (request, response) => {
  console.log('heard a call on api')
  response.send({reply: "yeah"})
});


// Demo of how to write a POST endpoint to store data
app.post("/api", (request, response) => {
  console.log('heard a POST call on API')
  
  // in here anything you want with a post call
  console.log(request.body);
  
  // In HERE, you can now write whatever you like
  // to, ie, a sqlite database, or a flat file
  
  response.send('Close Post Call')
});


// Demo of a static data set rather than a SQL call
app.get("/lego", async (req, res) => {
  try {
    
    // Right now we're sending static server-side data!
    res.send({"lego": legoBrickData})
  } catch (err) {
    console.log(err);
  }
})

// 新增: /color 端点 - 返回颜色选项的总数
app.get("/color", async (req, res) => {
  try {
    // 获取所有唯一颜色的集合
    const uniqueColors = new Set();
    
    // 遍历乐高积木数据
    legoBrickData.forEach(brick => {
      // 只计算有color_name的数据
      if (brick.color_name) {
        uniqueColors.add(brick.color_name);
      }
    });
    
    // 返回唯一颜色的数量
    res.json({ count: uniqueColors.size });
  } catch (error) {
    console.error('Error in /color endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// 新增: /brick 端点 - 返回积木的总数
app.get("/brick", async (req, res) => {
  try {
    // 使用reduce计算积木总数
    const totalBricks = legoBrickData.reduce((total, brick) => {
      // 确保total_bricks存在且是数字
      const brickCount = brick.total_bricks || 0;
      return total + brickCount;
    }, 0);
    
    // 返回积木总数
    res.json({ count: totalBricks });
  } catch (error) {
    console.error('Error in /brick endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});


// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});


