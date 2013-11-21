test("ArrayBuffer exports to Hex", function(){
	var arrayBuffer = bt.byteArrayToArrayBuffer([0, 0, 255, 0, 0, 255, 0, 0, 255]);  //not kosher unit testing but we need a function to test results
	var hex = bt.arrayBufferToHex(arrayBuffer);
	equal(hex, "0000ff0000ff0000ff");
});

test("ArrayBuffer exports to Hex with split", function(){
	var arrayBuffer = bt.byteArrayToArrayBuffer([0, 0, 255, 0, 0, 255, 0, 0, 255]);  //not kosher unit testing but we need a function to test results
	var hex = bt.arrayBufferToHex(arrayBuffer, { splitLength : 3 });
	equal(hex, "0000ff, 0000ff, 0000ff");
	
	var hex2 = bt.arrayBufferToHex(arrayBuffer, { splitLength : 1 });
	equal(hex2, "00, 00, ff, 00, 00, ff, 00, 00, ff");
});

test("ArrayBuffer exports to Hex with from", function(){
	var arrayBuffer = bt.byteArrayToArrayBuffer([0, 0, 255, 0, 0, 255, 0, 0, 255]);  //not kosher unit testing but we need a function to test results
	var hex = bt.arrayBufferToHex(arrayBuffer, { from : 2 });
	equal(hex, "ff0000ff0000ff");
});

test("ArrayBuffer exports to Hex with to", function(){
	var arrayBuffer = bt.byteArrayToArrayBuffer([0, 0, 255, 0, 0, 255, 0, 0, 255]);  //not kosher unit testing but we need a function to test results
	var hex = bt.arrayBufferToHex(arrayBuffer, { to : 3 });
	equal(hex, "0000ff");
});

test("ArrayBuffer exports to Binary", function(){
	var arrayBuffer = bt.byteArrayToArrayBuffer([0, 0, 255, 0, 0, 255, 0, 0, 255]);  //not kosher unit testing but we need a function to test results
	var bin = bt.arrayBufferToBinary(arrayBuffer);
	equal(bin, "00000000 00000000 11111111 00000000 00000000 11111111 00000000 00000000 11111111");
});

test("ArrayBuffer exports to String", function(){
	var value = "Hello World";
	var arrayBuffer = bt.stringToArrayBuffer(value);  //not kosher unit testing but we need a function to test results
	var transcodedValue = bt.arrayBufferToString(arrayBuffer);
	equal(transcodedValue, value);
});