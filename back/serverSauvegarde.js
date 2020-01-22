// You just need to set a mysql db with a three column table:
// first column : id (type: int(11) )
// second column : tache (type: varchar(100) )
// third column : done (type: tinyint(1) )

var express = require('express');
var bodyParser = require("body-parser");
var mysql = require('mysql');
const cors = require('cors');


var server = express();
server.use(bodyParser.urlencoded({ extended: false }));
server.listen(8080);
server.use(cors());

var con = mysql.createConnection({
    host: "localhost",
    database: "test",
    user: "root",
    password: ""
});
    


  


// Get All Todos
server.get("/",function(req,res){

    con.connect(function(err) {
      if (err) {
          console.error('Error:- ' + err.stack);
          return;
      }
  
      console.log('Connected Id:- ' + con.threadId);
  });
  
    con.query('SELECT * from TODO', function(err, rows, fields) {
    // con.end();
      if(!err){
        console.log('The solution is: ', rows);
        let toRender = rows.map(item=>{
          if(item.done===0){
            return {
              text: item.tache,
              done:false,
              id: item.id
          }
        } else {
          return {
            text: item.tache,
            done:true,
            id: item.id
        }
        }
        })
        res.send(toRender);
      }
      else {
        console.log('Error while performing Query.');
    }
      });
    });

// Add todo
// It works with get and params (I could do it with post but I'm lazy)
server.get("/add/:todo",function(req, res){
  console.log(req.params.todo);



  con.connect(function(err) {
    if (err) {
        console.error('Error:- ' + err.stack);
        return;
    }

    console.log('Connected Id:- ' + con.threadId);
});

    var sql = "INSERT INTO todo (id,tache,done) VALUES(?,?,?)";
    var inserts = [new Date().getMilliseconds(), req.params.todo,false];
    sql = mysql.format(sql,inserts);

      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Un todo a été inséré.");
            });
  
});


// Toggle done/undone

server.get("/toggle/:id",function(req, res){
  console.log(req.params.id);



  con.connect(function(err) {
    if (err) {
        console.error('Error:- ' + err.stack);
        return;
    }

    console.log('Connected Id:- ' + con.threadId);
});

    var sql = "UPDATE todo SET done = 1 WHERE id="+req.params.id;

      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Toggle done");
            });
  
});

//delete todo
server.get("/delete/:id",function(req, res){
  console.log(req.params.id);



  con.connect(function(err) {
    if (err) {
        console.error('Error:- ' + err.stack);
        return;
    }

    console.log('Connected Id:- ' + con.threadId);
});

    var sql = "DELETE FROM `todo` WHERE `todo`.`id`="+req.params.id;

      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("todo deleted");
            });
  
});

