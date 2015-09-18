
function saveData(data){
	//console.log(" paht to elastic " + elasticsearch);
	console.dir(process.env);
}


var i = 0;
var data = {};

setInterval(function(){
	data = {};
	data["toto" + i] = i;
	saveData(data);
	console.log("alive");
},5000);
