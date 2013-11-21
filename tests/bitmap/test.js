test("Bitmap gets scanline from y coord", function(){
	var scanline1 = Bitmap._private.getScanlineFromY(0, 10);
	equal(scanline1, 9, "Got bottom");
	
	var scanline2 = Bitmap._private.getScanlineFromY(5, 10);
	equal(scanline2, 4, "Got mid");
	
	var scanline3 = Bitmap._private.getScanlineFromY(9, 10);
	equal(scanline3, 0, "Got top");
});

test("Bitmap gets bitmap pixel (1 line)", function(){
	var imageData = bt.byteArrayToArrayBuffer([255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0]);
	
	var color1 = Bitmap._private.getBitmapPixel(imageData, 3, 1, 0, 0);
	deepEqual(color1, { red: 0, green: 0, blue: 255}, "Got first");
	
	var color2 = Bitmap._private.getBitmapPixel(imageData, 3, 1, 1, 0);
	deepEqual(color2, { red: 0, green: 255, blue: 0}, "Got second");
	
	var color3 = Bitmap._private.getBitmapPixel(imageData, 3, 1, 2, 0);
	deepEqual(color3, { red: 255, green: 0, blue: 0}, "Got third");
});

test("Bitmap gets bitmap pixel (2 line, padded)", function(){
	var imageData = bt.byteArrayToArrayBuffer([255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0,
											   0, 255, 255, 255, 255, 0, 255, 0, 255, 0, 0, 0]);
	
	var color1 = Bitmap._private.getBitmapPixel(imageData, 3, 2, 0, 0);
	deepEqual(color1, { red: 255, green: 255, blue: 0}, "Got [0,0]");
	
	var color2 = Bitmap._private.getBitmapPixel(imageData, 3, 2, 1, 0);
	deepEqual(color2, { red: 0, green: 255, blue: 255}, "Got [1,0]");
	
	var color3 = Bitmap._private.getBitmapPixel(imageData, 3, 2, 2, 0);
	deepEqual(color3, { red: 255, green: 0, blue: 255}, "Got [2,0]");
	
	var color4 = Bitmap._private.getBitmapPixel(imageData, 3, 2, 0, 1);
	deepEqual(color4, { red: 0, green: 0, blue: 255}, "Got [0,1]");
	
	var color5 = Bitmap._private.getBitmapPixel(imageData, 3, 2, 1, 1);
	deepEqual(color5, { red: 0, green: 255, blue: 0}, "Got [1,1]");
	
	var color6 = Bitmap._private.getBitmapPixel(imageData, 3, 2, 2, 1);
	deepEqual(color6, { red: 255, green: 0, blue: 0}, "Got [2,1");
});

test("Bitmap sets canvas pixel [0,0]", function(){
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	var imageData = context.createImageData(3, 1);
	var color = {
		red : 100,
		green : 200,
		blue: 40
	};
	
	Bitmap._private.setCanvasPixel(imageData, 0, 0, color);
	
	equal(imageData.data[2], 40, "Set Red");
	equal(imageData.data[1], 200, "Set Green");
	equal(imageData.data[0], 100, "Set Blue");
});

test("Canvas is exported to ArrayBuffer (1 pixel)", function(){
	var canvas = document.createElement("canvas");
	canvas.width = 1;
	canvas.height = 1;
	var context = canvas.getContext("2d");
	context.fillStyle = "#FF0000";
	context.fillRect(0, 0, 1, 1);
	
	var arrayBuffer = Bitmap._private.createBitmapArrayBuffer(canvas);
	equal(bt.arrayBufferToHex(arrayBuffer), "0000ff00");
});

test("Canvas is exported to ArrayBuffer (2 pixel row)", function(){
	var canvas = document.createElement("canvas");
	canvas.width = 2;
	canvas.height = 1;
	var context = canvas.getContext("2d");
	context.fillStyle = "#FF0000";
	context.fillRect(0, 0, 1, 1);
	context.fillStyle = "#0000FF";
	context.fillRect(1, 0, 1, 1);
	
	var arrayBuffer = Bitmap._private.createBitmapArrayBuffer(canvas);
	equal(bt.arrayBufferToHex(arrayBuffer), "0000ffff00000000");
});

test("Canvas is exported to ArrayBuffer (2 pixel column)", function(){
	var canvas = document.createElement("canvas");
	canvas.width = 1;
	canvas.height = 2;
	var context = canvas.getContext("2d");
	context.fillStyle = "#FF0000";
	context.fillRect(0, 0, 1, 1);
	context.fillStyle = "#0000FF";
	context.fillRect(0, 1, 1, 1);
	
	var arrayBuffer = Bitmap._private.createBitmapArrayBuffer(canvas);
	equal(bt.arrayBufferToHex(arrayBuffer), "ff0000000000ff00");
});

test("Bitmap packs header", function(){
	var header = {
		signature : "BM",
		fileSize : 576056,
		reserved : 0,
		dataOffset : 54
	};

	var arrayBuffer = Bitmap._private.packHeader(header);
	//var controlValue = bt.byteArrayToArrayBuffer([0x42, 0x4D, 0x38, 0xCA, 0x08, 0, 0, 0, 0, 0, 0x36, 0, 0, 0]);
	var readHeader = Bitmap._private.getHeader(arrayBuffer);
	deepEqual(readHeader, header);
	//equal(bt.arrayBufferToHex(arrayBuffer), bt.arrayBufferToHex(controlValue));
});

test("Bitmap packs info header", function(){
	var infoHeader = {
		bitCount : 24,
		colorsImportant : 0,
		colorsUsed : 0,
		compression : 0,
		height : 480,
		imageSize : 576002,
		planes : 1,
		size : 40,
		width : 400,
		xPixelsPerM : 2834,
		yPixelsPerM : 2834
	};

	var arrayBuffer = Bitmap._private.packInfoHeader(infoHeader);
	//var controlValue = bt.byteArrayToArrayBuffer([0x28, 0, 0, 0, 0x90, 0x01, 0, 0, 0xe0, 0x01, 0, 0, 0x01, 0, 0x18, 0, 0, 0, 0, 0, 0x02, 0xca, 0x08, 0, 0x12, 0x0b, 0, 0, 0x12, 0x0b, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	var readHeader = Bitmap._private.getInfoHeader(arrayBuffer, 0);
	deepEqual(readHeader, infoHeader);
	//equal(bt.arrayBufferToHex(arrayBuffer), bt.arrayBufferToHex(controlValue));
});