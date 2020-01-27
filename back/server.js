// You just need to set a mysql db with a three column table:
// first column : id (type: int(11) )
// second column : tache (type: varchar(100) )
// third column : done (type: tinyint(1) )

/* Ok, bug tout con : je crée un id dans la bdd en faisant new Date().getMilliseconds().
Je fais la même chose, auparavant, dans le state React. Mais, forcément, ce n'est pas la même milliseconde...
Par contre, la deuxième fois, ça marche parce que je réactualise la page : donc mon front va chercher les todos dans la bdd et s'aligne sur l'id du back...*/

/* Que reste-t-il à faire ?
      1/ la gestion des mdp
      2/ le login
      3/ le logout*/

var express = require('express');
var bodyParser = require("body-parser");
var mysql = require('mysql');
var session = require('client-sessions');
const cors = require('cors');

var server = express();
server.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));
server.use(bodyParser.urlencoded({ extended: false }));
server.listen(8080);
server.use(cors());

var con = mysql.createConnection({
    host: "localhost",
    database: "test",
    user: "root",
    password: ""
});
    

con.connect(function(err) {
  if (err) {
      console.error('Error:- ' + err.stack);
      return;
  }

  console.log('Connected Id:- ' + con.threadId);
});
  


// Get All Todos
server.get("/get/:user",function(req,res){
  console.log("querying all todos from db");

  
    con.query('SELECT * from TODO where user="'+req.params.user+'"', function(err, rows, fields) {
    // con.end();
      if(!err){
        res.status(200);
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

// Get All Todos
server.get("/getpwd/:user",function(req,res){
  console.log("querying all todos from db");

  
    con.query('SELECT motdepasse from UTILISATEURS where email="'+req.params.user+'"', function(err, rows, fields) {
    // con.end();
      if(!err){
        res.status(200);
        // console.log('The solution is: ', rows[0].motdepasse);
       
        if(rows[0]===undefined){
          return "error : user doesn't exist";
        }

        res.send(rows[0].motdepasse);
      }
      else {
        console.log('Error while performing Query.');
        throw(err);
    }
      });
    });
    

// Add todo
// It works with get and params (I could do it with post but I'm lazy)
server.get("/add/:todo/:id/:user",function(req, res){
  console.log(req.params.todo);
  console.log(req.params.id);
  console.log(req.params.user);







    var sql = "INSERT INTO todo (id,user,tache,done) VALUES(?,?,?,?)";
    var inserts = [req.params.id, req.params.user,req.params.todo,false];
    sql = mysql.format(sql,inserts);

      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Un todo a été inséré.");
        res.status(200);

            });
  
});


// Toggle done/undone

server.get("/toggle/:id",function(req, res){
  console.log("id du todo à toggle "+req.params.id);




    var sql = "UPDATE todo SET done = 1 WHERE id="+req.params.id;

      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Toggle done");
        res.status(200);

            });
  
});

//delete todo
server.get("/delete/:iddelete",function(req, res){
  console.log(req.params.iddelete);





    var sql = "DELETE FROM `todo` WHERE `todo`.`id`="+req.params.iddelete;

      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("todo deleted");
        res.status(200);

            });
  
});

//sign in
server.post('/createuser', function(req, res){
  var lol = req.body
  console.log(req.body);
  console.log(req.body.emailsubmit);

  console.log('create user ?');

    console.log("Connecté pour enregistrer un utilisateur");
    var sql = "INSERT INTO utilisateurs (id,email,motdepasse) VALUES(?,?,?)";
    var inserts = [new Date().getMilliseconds(),req.body.emailsubmit,req.body.pwdSubmit];
    sql = mysql.format(sql,inserts);
    
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Un utilisateur a été enregistré");

        });
  res.redirect('http://localhost:3000/')
});