bitmapjs
========

To get a Bitmap Object
----------------------

The Bitmap object is an intermediate format that holds the raw bitmap data.

Create Bitmap from ArrayBuffer:

	Bitmap.fromArrayBuffer(arrayBuffer)

Create Bitmap from a canvas element
	
	Bitmap.fromCanvas(HtmlCanvas)
  
Once you have a Bitmap Object
-----------------------------

bitmap.toConsole()

  Dumps raw data to console for debug
  
bitmap.toCanvas()

  Returns a canvas object with your bitmap
  
bitmap.toBlob()

  Returns a blob with your bitmap
  
Note: Only handles the simplest flavor of Bitmaps.
