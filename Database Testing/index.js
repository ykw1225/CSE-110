var cassandra = require('cassandra-driver');
var async = require('async');

var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'grad'});

/*
const query = 'INSERT INTO courses (department, number, description, prereqs) VALUES (?,?,?,?)';
const params = ["CSE", "100", "stuffs", [["CSE 30"], ["CSE 21"]]];

client.execute(query, params, function(err) {
  //assert.ifError(err);
  if(err) console.log(err);
  else console.log("inserted");
})*/

const query2 = "SELECT * FROM courses WHERE department = 'CSE' AND number = '100'";
client.execute(query2, function(err, result) {
  console.log(result);
  console.log(result['rows'][0]);
})
