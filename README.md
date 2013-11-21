bitmapjs
========

The Bitmap object is an intermediate format that hold the raw bitmap data.

Bitmap.fromArrayBuffer(arrayBuffer)

  Create Bitmap from ArrayBuffer

Bitmap.fromCanvas(HtmlCanvas)

  Create Bitmap from a canvas element
  
Once you have a Bitmap Object
-----------------------------

bitmap.toConsole()

  Dumps raw data to console for debug
  
bitmap.toCanvas()

  Returns a canvas object with your bitmap
  
bitmap.toBlob()

  Returns a blob with your bitmap
  
Note: Only handles the simplest flavor of Bitmaps.
