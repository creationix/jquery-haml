Haml-js
=======

Haml-js is a haml like language written in JSON. This allows for easy dom building so that web apps can do more work independent of the server for a better user experience.

Install jQuery plugin
---------------------

haml-js is a jQuery plugin.  In order to use it you simply include the js/jquery.haml-1.3.js file
in your jquery-ui project and use it as a dom builder.

How to use
----------

### Basic Syntax

Here is the haml example from http://haml.hamptoncatlin.com/ converted 
to haml-js:

**haml-js**

    [".profile",
      [".left.column",
        ["#date", print_date() ],
        ["#address", curent_user.address ]
      ],
      [".right.column",
        ["#email", current_user.email ],
        ["#bio", current_user.bio ]
      ]
    ]

**html**

    <div class="profile">
      <div class="left column">
        <div id="date">Friday, July 3, 2009</div>
        <div id="address">Richardson, TX</div>
      </div>
      <div class="right column">
        <div id="email">tim@creationix.com</div>
        <div id="bio">Experienced software professional...</div>
      </div>
    </div>
        
One thing you'll notice right away is that this is encoded in pure JSON.  This means that you can stream it from a server via ajax calls and it can be executed in the browser to create dom structures on the fly.

The basic rules are very similair to the real haml for ruby.  If the first item in a list is a string, then that is the css selector for that node.  It consists of `element#id.class`.  If the element is left out, haml-js will assume div.  You can have multiple css classes and even include spaces.  The id and class are of course optional.  After that, everything in the list is considered content inside the node.  Arrays are child nodes and more strings are text nodes.

### Attributes syntax

Here is another example with some html attributes specified:

**haml-js**

    ["strong", {class: "code", style: "color:red;"},  "Hello, World!"]

**html**

    <strong class="code" style="color:red;">Hello, World!</strong>
    
The new thing to note here is that we can specify html attributes.  This is done by including a json object after the string representing the node's css selector.  The keys and values become the attributes of the html node.

### CSS Special Syntax

Sometimes css can be complex enough that some structure is desired.

**haml-js**

    ["#main", {_: {position: "absolute", left:0, right:0, top:0, bottom:0}},
      [".greeting", {_: {"margin-top": "200px", "text-align": "center"}}, "Hello, World!"]
    ]

**html**

    <div id="main" style="position:absolute;left:0;right:0;top:0;bottom:0;">
      <div class="greeting" style="margin-top:200px;text-align:center;">Hello, World!</div>
    </div>

When underscore, `_`, is used as an attribute, the value is a json object with key/value pairs representing the css styles.  These will be applied using jQuery's css method.  Note that other parameters can be used in this same overall hash.  Also if prefered, a regular style attribute can be specified with manually formatted css.

### Javascript execution Syntax

This is where this template language/framework really shines.  Until now, this had little power over server side html generation or other dom builders like the one built into Prototype.js.  Javascript execution syntax allows you to declarativly schedule js methods to be called when the node gets attached to the page.

**haml-js**

    ["div", {style: "width:260px; margin:15px;", $:{
      slider: [{value: 60}]
    }}]

**html**

    <div style="margin: 15px; width: 260px;"
         class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all">
      <a href="#" class="ui-slider-handle ui-state-default ui-corner-all" style="left: 60%;"/>
    </div>

This will render a fully functional slider widget from the jQuery-ui library. Internally it queues up an event to call the `slider` method on the created node once it's attached to some element that's part of the page.  Like the css syntax, this is encoded as an attribute.  If the attribute it dollar, `$`, then the key/value pairs are method name and method parameters that are schedules to be applied to the node once it's live.

### Turning the haml-js into DOM HTML

There are two ways to use this plugin.  It both registers a global jQuery function called haml that
can be called with the dollar dot prefix:


> var haml = ["p", "Hello "]
> var element = $.haml(...)

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
  


