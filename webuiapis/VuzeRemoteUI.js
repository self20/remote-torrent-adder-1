function addTorrentToVuzeRemoteUI(data) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http"+((localStorage["hostsecure"]=='true')?"s":"")+"://"+localStorage["host"]+":"+localStorage["port"]+"/transmission/upload?paused=false", true, localStorage["login"], localStorage["password"]);
	xhr.onreadystatechange = function(data) {
		if(xhr.readyState == 4 && xhr.status == 200) {
			if(/.*<h1>200: OK<\/h1>.*/.exec(xhr.responseText)) {
				displayResponse("Success", "Torrent added successfully.");
			} else {
				displayResponse("Failure", "Server didn't accept data:\n"+xhr.status+": "+xhr.responseText);
			}
		} else if(xhr.readyState == 4 && xhr.status != 200) {
			displayResponse("Failure", "Server responded with an irregular HTTP error code:\n"+xhr.status+": "+xhr.responseText);
		}
	};
	
	if(data.substring(0,7) == "magnet:") {
		var jobj = {"method":"torrent-add", "arguments":{"paused":"false", "filename": data}};
		var message = JSON.stringify(jobj);
		xhr.send(message);
	} else {
		// mostly stolen from https://github.com/igstan/ajax-file-upload/blob/master/complex/uploader.js
		var boundary = "AJAX-----------------------"+(new Date).getTime();
		xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
		var message = "--" + boundary + "\r\n";
		    message += "Content-Disposition: form-data; name=\"torrent_files[]\"; filename=\"file.torrent\"\r\n";
		    message += "Content-Type: application/x-bittorrent\r\n\r\n";
		    message += data + "\r\n";
		    message += "--" + boundary + "--\r\n";
		
		xhr.sendAsBinary(message);
	}
}