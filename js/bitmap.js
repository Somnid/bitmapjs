var Bitmap = (function(){
	
	function getHeader(arrayBuffer, start){
		start = start || 0;
		var dataView = new DataView(arrayBuffer, start, 14);
		var header = {};
		header.signature = getString(dataView, 0, 2);				//always "BM"
		header.fileSize = dataView.getUint32(2, true);				//file size (bytes)
		header.reserved = dataView.getUint32(6, true);				//always 0
		header.dataOffset = dataView.getUint32(10, true);			//file offset to image data (bytes)
		return header;
	}
	
	function createHeader(imageSize, infoHeaderSize){
		var header = {};
		header.signature = "BM";				
		header.fileSize = 14 + imageSize + infoHeaderSize;		
		header.reserved = 0;	
		header.dataOffset = 14 + infoHeaderSize;
		return header;
	}
	
	function packHeader(header){
		var arrayBuffer = new ArrayBuffer(14);
		var dataView = new DataView(arrayBuffer);
		
		setString(dataView, 0, header.signature);
		dataView.setUint32(2, header.fileSize, true);
		dataView.setUint32(6, header.reserved, true);
		dataView.setUint32(10, header.dataOffset, true);
		
		return arrayBuffer;
	}
	
	function getInfoHeader(arrayBuffer, start){
		start = start == undefined ? 0 : start;
		var dataView = new DataView(arrayBuffer, start, 40);
		var infoHeader = {};
		infoHeader.size = dataView.getInt32(0, true);				//header Size (40)
		infoHeader.width = dataView.getInt32(4, true);				//image width
		infoHeader.height = dataView.getInt32(8, true);				//image height
		infoHeader.planes = dataView.getInt16(12, true);			//image width
		infoHeader.bitCount = dataView.getInt16(14, true);			//number of bits per pixel
		infoHeader.compression = dataView.getInt32(16, true);
		infoHeader.imageSize = dataView.getInt32(20, true);
		infoHeader.xPixelsPerM = dataView.getInt32(24, true);
		infoHeader.yPixelsPerM = dataView.getInt32(28, true);
		infoHeader.colorsUsed = dataView.getInt32(32, true);
		infoHeader.colorsImportant = dataView.getInt32(36, true);
		if(infoHeader.bitsPerPixel <= 8){
			//infoHeader.colorTable = getColorTable(dataView)
		}
		return infoHeader;
	}
	
	function createInfoHeader(canvas, imageSize){
		var infoHeader = {};
		infoHeader.size = 40;
		infoHeader.width = canvas.width;
		infoHeader.height = canvas.height;
		infoHeader.planes = 1;
		infoHeader.bitCount = 24;
		infoHeader.compression = 0;
		infoHeader.imageSize = imageSize;
		infoHeader.xPixelsPerM = 0;
		infoHeader.yPixelsPerM = 0;
		infoHeader.colorsUsed = 0;
		infoHeader.colorsImportant = 0;
		if(infoHeader.bitsPerPixel <= 8){
			//infoHeader.colorTable = getColorTable(dataView)
		}
		return infoHeader;
	}
	
	function packInfoHeader(infoHeader){
		var arrayBuffer = new ArrayBuffer(40);
		var dataView = new DataView(arrayBuffer);
	
		dataView.setInt32(0, infoHeader.size, true);
		dataView.setInt32(4, infoHeader.width, true);
		dataView.setInt32(8, infoHeader.height, true);
		dataView.setInt16(12, infoHeader.planes, true);
		dataView.setInt16(14, infoHeader.bitCount, true);			
		dataView.setInt32(16, infoHeader.compression, true);
		dataView.setInt32(20, infoHeader.imageSize, true);
		dataView.setInt32(24, infoHeader.xPixelsPerM, true);
		dataView.setInt32(28, infoHeader.yPixelsPerM, true);
		dataView.setInt32(32, infoHeader.colorsUsed, true);
		dataView.setInt32(36, infoHeader.colorsImportant, true);
		if(infoHeader.bitsPerPixel <= 8){
			//infoHeader.colorTable = getColorTable(dataView)
		}
		
		return arrayBuffer;
	}
	
	/*DataManip*/
	function getString(dataView, start, length){
		var newString = ""
		for(var i = 0; i < length; i++){
			newString += String.fromCharCode(dataView.getUint8(start + i));
		}
		return newString;
	}
	
	function setString(dataView, start, value){
		for(var i = 0; i < value.length; i++){
			dataView.setUint8(start + i, value.charCodeAt(i));
		}
	}
	
	function toConsole(){
		console.log(this);
	}
	
	function toCanvas(){
		var self = this;
		var canvas = document.createElement("canvas");
		
		canvas.height = self.infoHeader.height;
		canvas.width = self.infoHeader.width;
		
		var context = canvas.getContext("2d");
		var imageData = context.createImageData(self.infoHeader.width, self.infoHeader.height);
		
		for(var y = 0; y < self.infoHeader.height; y++){
			for(var x = 0; x < self.infoHeader.width; x++){
				var color = getBitmapPixel(self.imageData, self.infoHeader.width, self.infoHeader.height, x, y);
				setCanvasPixel(imageData, x, y, color);
			}
		}
		context.putImageData(imageData, 0, 0);
		
		return canvas;
	}
	
	function toBlob(){
		var self = this;
		var imagePart = self.imageData;
		var infoHeaderPart = packInfoHeader(self.infoHeader);
		var headerPart = packHeader(self.header);
		
		var blob = new Blob([ headerPart, infoHeaderPart, imagePart ], { type : "image/bitmap" });
		
		return blob;
	}
	
	function setCanvasPixel(imageData, x, y, color){
		var offset = ((y * imageData.width) + x) * 4;
		//colors are little endian
		imageData.data[offset + 0] = color.red;
		imageData.data[offset + 1] = color.green;
		imageData.data[offset + 2] = color.blue;
		imageData.data[offset + 3] = color.alpha || 255;
	}
	
	function getCanvasPixel(imageData, x, y){
		var offset = ((y * imageData.width) + x) * 4;
		var color = {};
		//colors are little endian
		color.red = imageData.data[offset + 0];
		color.green = imageData.data[offset + 1];
		color.blue = imageData.data[offset + 2];
		
		return color;
	}
	
	function getBitmapPixel(arrayBuffer, imageWidth, imageHeight, x, y){
		var dataView = new DataView(arrayBuffer);
		y = getScanlineFromY(y, imageHeight);
		var lineRawWidth = (imageWidth * 3);
		var linePadding = lineRawWidth % 4 > 0 ? 4 - (lineRawWidth % 4) : 0;
		var linePaddedWidth = lineRawWidth + linePadding; //must end at 32-bit boundary
		var offset = (y * linePaddedWidth) + (x*3);
		var color = {};
			
		try{
			color.blue = dataView.getUint8(offset + 0);
			color.green = dataView.getUint8(offset + 1);
			color.red = dataView.getUint8(offset + 2);
		}catch(ex){
			console.error("x: " + x, " y: " + y + " offset: " + offset);
		}
		
		return color;
	}
	
	function createBitmapArrayBuffer(canvas){
		var lineRawWidth = (canvas.width * 3);
		var linePadding = lineRawWidth % 4 > 0 ? 4 - (lineRawWidth % 4) : 0;
		var linePaddedWidth = lineRawWidth + linePadding;
		var totalSize = linePaddedWidth * canvas.height;
		var context = canvas.getContext("2d");
		var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		var arrayBuffer = new ArrayBuffer(totalSize);
		var dataView = new DataView(arrayBuffer);
		
		for(var y = 0; y < canvas.height; y++){
			var scanline = getScanlineFromY(y, canvas.height);
			for(var x = 0; x < canvas.width; x++){
				var color = getCanvasPixel(imageData, x, y);
				setBitmapPixel(dataView, x, scanline, canvas.width, canvas.height, linePaddedWidth, color);
			}
			setBitmapPadding(dataView, x, scanline, canvas.width, canvas.height, linePaddedWidth, linePadding);
		}
		
		return arrayBuffer;
	}
	
	function setBitmapPixel(dataView, x, y, imageWidth, imageHeight, linePaddedWidth, color){
		var offset = (y * linePaddedWidth) + (x*3);
		dataView.setUint8(offset + 0, color.blue);
		dataView.setUint8(offset + 1, color.green);
		dataView.setUint8(offset + 2, color.red);
	}
	
	function setBitmapPadding(dataView, x, y, imageWidth, imageHeight, linePaddedWidth, linePadding){
		var offset = (y * linePaddedWidth) + (x*3);
		for(var i = 0; i < linePadding; i++){
			dataView.setUint8(offset + i, 0);
		}
	}
	
	function getScanlineFromY(y, height){
		return height - y - 1;
	}
	
	function createBitmap(newBitmap){
		var bitmap = {};
		bitmap.toConsole = toConsole.bind(bitmap);
		bitmap.toCanvas = toCanvas.bind(bitmap);
		bitmap.toBlob = toBlob.bind(bitmap);
		return bitmap;
	}
	
	function fromArrayBuffer(arrayBuffer){
		var bitmap = createBitmap();
		bitmap.header = getHeader(arrayBuffer, 0);
		bitmap.infoHeader = getInfoHeader(arrayBuffer, 14);
		bitmap.imageData = arrayBuffer.slice(bitmap.header.dataOffset);
		return bitmap;
	}
	
	function fromCanvas(canvas){
		var bitmap = createBitmap();
		bitmap.imageData = createBitmapArrayBuffer(canvas);
		bitmap.infoHeader = createInfoHeader(canvas, bitmap.imageData.byteLength);
		bitmap.header = createHeader(bitmap.infoHeader.imageSize, bitmap.infoHeader.size);
		return bitmap;
	}
	
	return {
		fromArrayBuffer : fromArrayBuffer,
		fromCanvas : fromCanvas,
		_private : {
			createBitmapArrayBuffer : createBitmapArrayBuffer,
			getBitmapPixel : getBitmapPixel,
			getHeader : getHeader,
			getInfoHeader : getInfoHeader,
			getScanlineFromY : getScanlineFromY,
			packHeader : packHeader,
			packInfoHeader : packInfoHeader,
			setCanvasPixel : setCanvasPixel,
			toCanvas : toCanvas
		}
	};
	
})();