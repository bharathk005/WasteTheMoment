console.log('server running');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.use(express.static('public'));

let db;

const url =  'mongodb://localhost:27017/countdb';

function getReg(){
  var temp = Math.floor(Math.random() * Math.floor(3)) + 1;
  switch(temp){
    case 1: return "IND";
    case 2: return "AUS";
    case 3: return "USA";
  }
}

MongoClient.connect(url, (err, database) => {
    if(err) {
      return console.log(err);
    }
    db = database;
    app.listen(8080, () => {
      console.log('listening on 8080');
    });
  });

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

 
app.post('/clicked', (req, res) => {
    const click = {clickTime: new Date()};

    db.collection('clicks').updateOne({},{ $inc: {gt:1}}, (err, result) => {
        if (err) {
          return console.log(err);
        }
        console.log('click added to db');
        
      });
    var reg = getReg();
    console.log(reg);
    db.collection('reg').updateOne({"name": reg},{ $inc: {"val":1}},{ upsert : true }, (err, result) => {
        if (err) {
          return console.log(err);
        }
        console.log('reg added to db');
        
      });
    
      var table;
      var avg = 1;
      db.collection('clicks').findOne({}, function(err,result){
          if(err) return console.log(err);
          avg = result.gt/result.tusers;
          db.collection('clicks').updateOne({},{ $set: {av:avg}}, (err, result) => {
              if (err) {
                return console.log(err);
              }
              console.log('average updated in db');
              
            });
      });

      res.sendStatus(201);
    
  });

  app.post('/addUser', (req, res) => {
    db.collection('clicks').updateOne({},{ $inc: {tusers:1}}, (err, result) => {
      if (err) {
        return console.log(err);
      }
      console.log('user added to db');
    });

    var table;
    var avg = 1;
    db.collection('clicks').findOne({}, function(err,result){
        if(err) return console.log(err);
        avg = result.gt/result.tusers;
        db.collection('clicks').updateOne({},{ $set: {av:avg}}, (err, result) => {
            if (err) {
              return console.log(err);
            }
            console.log('average updated in db');
            
          });
    });

    //  var addr = req.headers['x-forwarded-for'] || 
    //  req.connection.remoteAddress || 
    //  req.socket.remoteAddress ||
    //  (req.connection.socket ? req.connection.socket.remoteAddress : null);

    //  db.collection('addr').save(addr, (err, result) => {
    //     if (err) {
    //       return console.log(err);
    //     }
    //     console.log('click added to db');
    //     res.sendStatus(201);
    //   });

    res.sendStatus(201);
    
  });

  app.get('/clicks', (req, res) => {

    db.collection('clicks').find().toArray((err, result) => {
      if (err) return console.log(err);
      res.send(result);
    });
  });

  app.get('/reg', (req, res) => {

    db.collection('reg').find().toArray((err, result) => {
      if (err) return console.log(err);
      res.send(result);
    });
  });