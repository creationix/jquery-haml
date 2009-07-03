Haml-js
=======

Install
-------

haml-js is a jQuery plugin.  In order to use it you simply include the js/jquery.haml-1.3.js file
in your jquery-ui project and use it as a dom builder.

How to use
----------

**TODO**: Finish this

### haml-js Syntax

* haml-js html syntax
* haml-js css syntax
* haml-js js syntax

### Turning the haml-js JSON into DOM HTML

* $.haml(...) docs
* $("some css selector").haml(...) docs

### Advanced examples

* examples with logic embedded
  * enumerate examples here
  * ...  

What is the rest of this?
-------------------------

The rest of this package is a reference implementation using the library.  Simply point a browser
to the test.html file.  

Also you ran use rack to serve the folder on a local web server.  Simple type `rackup` in
the main folder and point your browser to http://localhost:9292/test.html

**js/common_widgets** is an example of a common library used by several haml-js views.  It contains
a form builder with data binding and some useful sub templates.

**pages/index.js** is a very small page that generates all the possible urls for the sample data.

**pages/ui-demo.js** is a small collection of the examples in the jQuery-ui documentation converted
to haml-js as an exercise.

**pages/databind.js** is an advanced demo showing how the library could be used for a rich userface
to load data from a sever, modify it client side, and sync with the server via async ajax calls.
Note save method in the example is a stub and doesn't actually make an ajax call, but it easily could.

These examples make heavy use of closures, so read up on the topic if your're unsure what that means.
  

