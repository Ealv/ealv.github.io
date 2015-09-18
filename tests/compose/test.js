
var sys = require('sys')
var exec = require('child_process').exec;

function saveData(){
	var data = {};
	data["toto_" + i] = "value" + i;
	console.log("curl -XPOST elasticsearch:9200/data/" + i + " -d '" + JSON.stringify(data) + "'");
 	exec("curl -XPOST elasticsearch:9200/data/" + i + " -d '" + JSON.stringify(data) + "'");
}

var i = 0;

setInterval(function(){
	i++;
	saveData();
	console.log("alive");
},5000);
