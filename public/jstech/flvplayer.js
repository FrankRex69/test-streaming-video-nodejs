		//let flvjs1 = require('./flv.js');	

		let idVarEglassesInFunction;
        let idVarVideoZoomInFunction;
		
		
 function funzioneplayer(valore,urlrtmp){         	
			//alert('dato:'+urlrtmp);

			const words = urlrtmp.split('/');
			let startString = (urlrtmp.search(words[3]));
			let suffissoUrlStream = (urlrtmp.substring(startString,urlrtmp.length));
			let urlstream = 'wss://www.chop.click:8471/'+suffissoUrlStream+'.flv';					
			let secRefresh = 30;        				
                  	 	
			switch(valore) {
  				   			
    			case 1: //dispositivo secondario via "ws o wss" (Cellulare via Websocket)					
				
    				//urlstream = 'wss://www.chop.click:8471/test/a.flv';   				
    				if(idVarEglassesInFunction != ''){
						clearInterval(idVarEglassesInFunction); 
    				}    				
    				idVarVideoZoomInFunction = setInterval(function(){flv_load_mds(urlstream);}, secRefresh*1000); //Variabile per refresh; //Variabile per refresh  					
    								 							
    			break;    				
			}			
			
			if(valore==1){
				flv_load_mds(urlstream);		
			}

			return idVarEglassesInFunction;
			
		 }		
		
 function flv_load_mds(urlstream){			 
							
				 /* let element = document.getElementById('videoElementPlayer'); */
				 let element = document.getElementById('output_video');
				 
            	 
            	 if (typeof player !== "undefined") {                	
                	if (player != null) {
                	    player.unload();
                	    player.detachMediaElement();
                	    player.destroy();
                	    player = null;               	   
                	}            	 
            	 }            	 
            	 
            	 player = flvjs.createPlayer({				           		
            	    type: 'flv',
            	    url: urlstream
				 }
            	 ,
            	 {            	    
            	    enableWorker: false,
            		enableStashBuffer: false,
            		stashInitialSize: 1,
            		isLive: true,
            		autoCleanupSourceBuffer: true            	    
            	 });            	 
            	          		           		 
            	 player.attachMediaElement(element);        	
            	 player.load();            	
            	 player.play();							
		}
			        	
 function flv_destroy() {
				console.log("destroy1");
            	player.pause();
            	player.unload();
            	player.detachMediaElement();
            	player.destroy();
            	player = null;
				console.log("destroy22");
		}   
		
	