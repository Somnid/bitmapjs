document.addEventListener("DOMContentLoaded", function(){
	var body = document.getElementsByTagName("body")[0];
	
	body.addEventListener("dragover", function(e){
		e.preventDefault();
		e.stopPropagation();
	},true);
	
	body.addEventListener("drop", function(e){
		e.preventDefault();
		e.stopPropagation();
	
		var files = e.dataTransfer.files;
		
		for(var i = 0; i < files.length; i++){
			var file = files[i];
			var reader = new FileReader();
			reader.onload = function(e){
				var arrayBuffer = e.target.result;
				var bitmap = Bitmap.fromArrayBuffer(arrayBuffer);
				
				bitmap.toConsole();
				
				var canvas = bitmap.toCanvas();
				canvas.style.width = canvas.width;
				canvas.style.height = canvas.height;
				
				canvas.addEventListener("click", function(e){
					var exportBitmap = Bitmap.fromCanvas(e.currentTarget);
					var exportBlob =  exportBitmap.toBlob();
					var exportUrl = URL.createObjectURL(exportBlob);
					window.open(exportUrl);
				}, true);
				
				body.appendChild(canvas);
			};
			reader.onerror = function(e){ console.log(e); }
			reader.readAsArrayBuffer(file);
		}
	
	},true);
}, true);