var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8080);






// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var term = require('term.js');

app.use(term.middleware());

io.sockets.on('connection', function (socket) {
	
	var tty = require('tty');
	console.log(process.stdout.getWindowSize());


	// when the client emits 'adduser', this listens and executes
	socket.on('ls', function(){
		var str
		//var spawn = require('child_process').spawn;
    	
    	//ls    = spawn('ls', ['-l']);
    	

     				/*ls = spawn('sh',['airmon.sh']);
					ls.stdout.on('data', function (data) {
		 				str = data.toString();
  						socket.volatile.emit('message', str);
  				  
  						console.log('' + data);
					});*/
		var exec = require('child_process').exec;
		var child = exec('sudo airmon-ng start wlan0');
		//var child = exec('iwlist wlan0 scan');
		child.stdout.on('data', function(data) {
			str = data.toString();
  			socket.emit('message', str);
   			 console.log('stdout: ' + data);
		});

	});


	//functioning on long running processes 
	socket.on('test', function(){
		
		console.log('test');
		var spawn = require('pty.js').spawn;			//requires pty.js "$sudo npm install pty.js"
		var myProcess = spawn('sh', ['airmon.sh']);		//simple shell script

		myProcess.stdout.setEncoding('utf-8');			//set stdout buffer encoding, otherwise binary data is sent

		//process.stdin.resume();

		//process.stdin.setRawMode();

		myProcess.on('data', function(data){			//socket listener 
			socket.emit('airodumpOut', data);			//send clientside event with encoded data stream
			console.log(data);							//log data stream
		});

     				


    	


		
	});

	var notes = []
	var isInitNotes = false
	
	socket.on('submitAdminCreds', function(data){

		var str = data.toString();
		console.log('test');

		notes.push(data)
        io.sockets.emit('new note', data)
        
        db.query('INSERT INTO notes (note) VALUES (?)', data.note)

	});

	socket.on('airodump',function(){
		/*var sudo = require('sudo');
		var options = {
    		cachePassword: true,
    		prompt: 'Enter Password:',
    		spawnOptions: { pipe:1 }
		};
		var child = sudo([ 'iwlist', 'wlan0', 'scan' ], options);
		child.stdout.on('data', function (data) {
    		console.log(data.toString());
		//res.json(data);
		socket.emit('airodumpOut', data);
		});*/
		var exec = require('child_process').exec;
		//var child = exec('sudo airmon-ng start wlan0');
		var child = exec('./a.out');
		child.stdout.on('data', function(data) {
			str = data.toString();
  			socket.emit('airodumpOut', str);
   			console.log('stdout: ' + data);
		});
    			
    			


	});
	
	
});
