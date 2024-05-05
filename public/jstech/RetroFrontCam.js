//------------------- Verifica dispositivi -------------------------------
let listaDispositivi = async function listaDispositivi (){  
    document.getElementById("button_start_retrocam").style.display = "none"; 
    let checkRetroCam=false; 
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log("enumerateDevices() not supported.");
        return;
    }
    else{            
        // List cameras and microphones.                
        await navigator.mediaDevices.enumerateDevices()
        .then(function(devices) {
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            videoDevices.forEach(function(devices) {               
                //Check retro cam
                if(devices.label.indexOf('facing back') > 0 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){   
                    deviceIdRetroCam=devices.deviceId;                         
                    checkRetroCam=true; 
                    document.getElementById("button_start_retrocam").style.display = "block";                                                                            
                }                        
            }); 
                                      
        })
        .catch(function(err) {
            console.log(err.name + ": " + err.message);
        });
    }

    console.log("retroCam:" +checkRetroCam);    
    return checkRetroCam; 
}



