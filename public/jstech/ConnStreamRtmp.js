
function fail(str){alert(str+"\nUnable to access the camera Please ensure you are on HTTPS and using Firefox or Chrome.");location.replace('http://mozilla.org/firefox');}
	
var output_console=document.getElementById('output_console'),
	output_message=document.getElementById('output_message'),
	output_video=document.getElementById('output_video'),
	option_url=document.getElementById('option_url'),
	socketio_address=document.getElementById('socket.io_address'),
	//option_width=document.getElementById('option_width'),
	//option_height=document.getElementById('option_height'),
	//option_framerate=document.getElementById('option_framerate'),
    //option_bitrate=document.getElementById('option_bitrate'),
	button_start=document.getElementById('button_start'),
	button_start_retrocam=document.getElementById('button_start_retrocam'),
	//height=parseInt(option_height.value),
	//width=parseInt(option_width.value),
	height=120,
	width=120,
	/* framerate=parseInt(option_framerate.value),
	audiobitrate = parseInt(option_bitrate.value), */
	framerate=15,
	audiobitrate=44100,
	//url=option_url.value='rtmp://'+location.host.split(':')[0]+':1935/live/test0';
	url=option_url.value;



console.log("framerate", framerate);
/* option_height.onchange=option_height.onkeyup=function(){height=1*this.value;}
option_width.onchange=option_width.onkeyup=function(){width=1*this.value; console.log("width" +width);} */
/* option_framerate.onchange=option_framerate.onkeyup=function(){framerate=1*this.value; console.log("framerate" 	+framerate);}
option_bitrate.onchange=option_bitrate.onkeyup=function(){audiobitrate=1*this.value; console.log("bitrate" 	+audiobitrate);} */
option_url.onchange=option_url.onkeyup=function(){url=this.value;}
/* button_start.onclick=requestMedia;
button_start_retrocam.onclick=requestMediaRetro; */
button_stop.onclick=stopStream;
button_server.onclick=connect_server;
var oo=document.getElementById("checkbox_Reconection");
	//just start the server
	//connect_server;
	var mediaRecorder;
 	var socket ;
 	var state ="stop";
	console.log("state initiated = " +state); 
 	var t;
	button_start.disabled=true;
	button_start_retrocam.disabled=true;
	button_stop.disabled=true;
	function video_show(stream){
		if ("srcObject" in output_video) {
			output_video.muted = true;
			output_video.srcObject = stream;
		} else {
			output_video.src = window.URL.createObjectURL(stream);
		}
  	  output_video.addEventListener( "loadedmetadata", function (e) {
	  		//console.log(output_video);
			output_message.innerHTML="Local video source size:"+output_video.videoWidth+"x"+output_video.videoHeight ;
		}, false );
	}

	function show_output(str){
		output_console.value+="\n"+str;
		output_console.scrollTop = output_console.scrollHeight;
	};


	function timedCount(){
		var oo=document.getElementById("checkbox_Reconection");
		if(oo.checked) {
			console.log("timed count state = " +state);
 	   	 	if(state=="ready"  ){ 
				console.log("reconnecting and restarting the media stream");
 		  		//do I need to rerun the request media?
			 
				connect_server();
 		   		button_start.disabled=false;
				button_start_retrocam.disabled=false;
				button_server.disabled=true;
				
 	   		}	
 	  		else{
				console.log("not ready yet - wating 1000ms");
  				t=setTimeout("timedCount()",1000);
  		  	    connect_server();
				output_message.innerHTML="try connect server ...";
				button_start.disabled=true;
				button_start_retrocam.disabled=true;
				button_server.disabled=false;
 	   	 }
 		}
 		else
 			{
				//reconnection is off
				console.log("reconnection is off, buttons hcnage and we are done.");
				button_start.disabled=true;
				button_start_retrocam.disabled=true;
				button_server.disabled=false;
 			}
	}

	function connect_server(){
		navigator.getUserMedia = (navigator.mediaDevices.getUserMedia ||
                          navigator.mediaDevices.mozGetUserMedia ||
                          navigator.mediaDevices.msGetUserMedia ||
                          navigator.mediaDevices.webkitGetUserMedia);
		if(!navigator.getUserMedia){fail('No getUserMedia() available.');}
		if(!MediaRecorder){fail('No MediaRecorder available.');}


		var socketOptions = {secure: true, reconnection: true, reconnectionDelay: 1000, timeout:15000, pingTimeout: 15000, pingInterval: 45000,query: {framespersecond: framerate, audioBitrate: audiobitrate}};
		
		//start socket connection
		socket = io.connect(socketio_address.value, socketOptions);
		// console.log("ping interval =", socket.pingInterval, " ping TimeOut" = socket.pingTimeout);
 		//output_message.innerHTML=socket;
		
		socket.on('connect_timeout', (timeout) => {
   			console.log("state on connection timeout= " +timeout);
			output_message.innerHTML="Connection timed out";
			recordingCircle.style.fill='gray';
			
		});
		socket.on('error', (error) => {
   			console.log("state on connection error= " +error);
			output_message.innerHTML="Connection error";
			recordingCircle.style.fill='gray';
		});
		
		socket.on('connect_error', function(){ 
   			console.log("state on connection error= " +state);
			output_message.innerHTML="Connection Failed";
			recordingCircle.style.fill='gray';
		});

		socket.on('message',function(m){
			console.log("state on message= " +state);
			console.log('recv server message',m);
			show_output('SERVER:'+m);
			
		});

		socket.on('fatal',function(m){
			show_output('Fatal ERROR: unexpected:'+m);
			//alert('Error:'+m);
			console.log("fatal socket error!!", m);
			console.log("state on fatal error= " +state);
			//already stopped and inactive
			console.log('media recorder restarted');
			recordingCircle.style.fill='gray';
			
			//mediaRecorder.start();
			//state="stop";
			//button_start.disabled=true;
			//button_server.disabled=false;
			//document.getElementById('button_start').disabled=true;　
			//restart the server
	
			if(oo.checked) {
				//timedCount();
				output_message.innerHTML="server is reload!";
				console.log("server is reloading!");
				recordingCircle.style.fill='gray';
			}
			//should reload?
		});
		
		socket.on('ffmpeg_stderr',function(m){
			//this is the ffmpeg output for each frame
			show_output('FFMPEG:'+m);	
		});

		socket.on('disconnect', function (reason) {
			console.log("state disconec= " +state);
			show_output('ERROR: server disconnected!');
			console.log('ERROR: server disconnected!' +reason);
			recordingCircle.style.fill='gray';
			//reconnect the server
			connect_server();
			
			//socket.open();
			//mediaRecorder.stop();
			//state="stop";
			//button_start.disabled=true;
			//button_server.disabled=false;
			//	document.getElementById('button_start').disabled=true;　
			//var oo=document.getElementById("checkbox_Reconection");
			if(oo.checked) {
				//timedCount();
				output_message.innerHTML="server is reloading!";
				console.log("server is reloading!");
			}
		});
	
		state="ready";
		console.log("state = " +state);
		button_start.disabled=false;
		button_start_retrocam.disabled=false;
		button_stop.disabled=false;
		button_server.disabled=true;
		output_message.innerHTML="connect server successful";
}


function requestMedia(devicePosition){

	let constraintsFront;

	if(devicePosition=='fronte'){        
        constraints = {
            audio: {sampleRate: audiobitrate, echoCancellation: true},
			video:{
	        	width: { min: 100, ideal: width, max: 1920 },
	        	height: { min: 100, ideal: height, max: 1080 },
				frameRate: {ideal: framerate}
	    	}
        }; 
    }
    else if(devicePosition=='retro')
    {
		constraints = { 
			audio: {sampleRate: audiobitrate, echoCancellation: true},
			video:{
	        	width: { min: 100, ideal: width, max: 1920 },
	        	height: { min: 100, ideal: height, max: 1080 },
				frameRate: {ideal: framerate},
				facingMode: {exact: 'environment'} 
	    	}        
                       
        };
    }
	
	console.log(constraints);
	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		//let supported = navigator.mediaDevices.getSupportedConstraints();
		//console.log(supported);
		video_show(stream);//only show locally, not remotely
		recordingCircle.style.fill='red';
		socket.emit('config_rtmpDestination',url);
		socket.emit('start','start');
		mediaRecorder = new MediaRecorder(stream);
		mediaRecorder.start(250);
		button_stop.disabled=false;
	 	button_start.disabled=true;
		button_start_retrocam.disabled=true;
		button_server.disabled=true;
		
		//show remote stream
		var livestream = document.getElementsByClassName("Livestream");
		console.log("adding live stream");
		livestream.innerHtml = "test";

		mediaRecorder.onstop = function(e) {
			console.log("stopped!");
			console.log(e);
			//stream.stop();
				
		}
		
		mediaRecorder.onpause = function(e) {
			console.log("media recorder paused!!");
			console.log(e);
			//stream.stop();
				
		}
		
		mediaRecorder.onerror = function(event) {
			let error = event.error;
			console.log("error", error.name);

  	  };	
		//document.getElementById('button_start').disabled=false;　

		mediaRecorder.ondataavailable = function(e) {
			console.log(e.data);
		  socket.emit("binarystream",e.data);
		  state="start";
		  //chunks.push(e.data);
		}
	}).catch(function(err) {
		console.log('The following error occured: ' + err);
		show_output('Local getUserMedia ERROR:'+err);
		output_message.innerHTML="Local video source size is not support or No camera ?"+output_video.videoWidth+"x"+output_video.videoHeight;
		state="stop";
		button_start.disabled=true;
		button_start_retrocam.disabled=true;
		button_server.disabled=false;
	});
}

function stopStream(){
	console.log("stop pressed:");
	//stream.getTracks().forEach(track => track.stop())
	mediaRecorder.stop();
	recordingCircle.style.fill='gray';
	button_stop.disabled=true;
 	button_start.disabled=true;
	button_start_retrocam.disabled=true;
	button_server.disabled=false;

	//Funzione per player flv.js (in pratica distrugge lo stream in NodeMediaServer)
	flv_destroy();
}