Haml-js
=======

Haml-js is a haml like language written in JSON. This allows for easy dom building so that web apps can do more work independent of the server for a better user experience.

See <http://static.creationix.com/haml_js/test.html> for a **demo**.

Based on <http://haml.hamptoncatlin.com/> from the ruby world.

Install jQuery plugin
---------------------

haml-js is a jQuery plugin.  In order to use it you simply include the `js/jquery.haml-1.3.js` file
in your jquery-ui project and use it as a dom builder.

How to use
----------

### Basic Syntax

Here is the first example from the haml site converted to haml-js:

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

### Javascript jQuery plugin Syntax

This is where this template language/framework really shines.  Until now, this had little power over server side html generation or other dom builders like the one built into Prototype.js.  Javascript execution syntax allows you to declarativly schedule js methods to be called when the node gets attached to the page.

**haml-js**

    ["div", {style: "width:260px; margin:15px;", $:{
      slider: [{value: 60}]
    }}]

**html**

    <div style="margin: 15px; width: 260px;" class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all">
      <a href="#" class="ui-slider-handle ui-state-default ui-corner-all" style="left: 60%;"/>
    </div>

This will render a fully functional slider widget from the jQuery-ui library. Internally it queues up an event to call the `slider` method on the created node once it's attached to some element that's part of the page.  Like the css syntax, this is encoded as an attribute.  If the attribute it dollar, `$`, then the key/value pairs are method name and method parameters that are schedules to be applied to the node once it's live.

### Javascript onload Syntax

Sometimes the jquery plugins aren't enough, or you need to call the same plugin more than once, but only ome key is allowed in a hash.  This is where the onload syntax comes in handy.

    ["div", {style: "width:260px; margin:15px;", $:{
      slider: [{value: 60}],
      $: function() { this.slider('disable'); }
    }}]

In this example, we wanted to call the disable action on the slider plugin after turning the div into a slider.  This was done with a generic onload function.  The function given will be called in scope of the jquery node.

### Turning the haml-js into DOM HTML

Usually you will be wanting to attach these element to some part of the page and so the this format is used more often.  This is the `.haml` plugin that all jQuery object now have.

    $("body").haml(["p", "Hello ", ["img",{src:"logo.jpg"]]);

This will create the new element and append it to the end of the body tag.  Once it's the recursive function gets to the last step and appends the element tree to the page, any event's queued up would then take place.

Also, for advanced usage you can call the `$.haml` function directly.  This function takes a haml array and returns a jQuery object with the created elements inside it. Note, that events will never get triggered since you're not appending the tree to aything.

    var haml = ["p", "Hello "]
    var element = $.haml(...)
    
### Markdown integration

One thing that haml is terrible at is content text.  The mixture of a tags, em tags, ul, li, etc can get out of hand very quickly.

I've found that markdown is an excellent tool for this part.  The haml like dom builder is great for structure and logic while markdown is good for content generation.

**haml-js**

    var data = {
      name: "World",
      website: "http://creationix.com/",
      title: "My Website"
    };
    var markdown = "# Hello {name}\n\nThis *is* **a** paragraph.\n\nClick [here]({website} \"{title}\") for fun.";
    $('body').haml(
      ["#content", {$:{ markdown:[data]}}, markdown]
    );
    
**html**

    <div id="content">
      <h1>Hello World</h1>
      <p>This <em>is</em> <strong>a</strong> paragraph.</p>
      <p>Click <a title="My Website" href="http://creationix.com/">here</a> for fun.</p>
    </div>

This has variable replacement within the markdown and then markdown parsing to html.

### Advanced examples

Since the haml-js templates are pure json, they are also native Javascript.  This means if you don't plan on piping the templates through an ajax call, you can include then inline in the page or in external js files and put logic within them.

For example you can call the jQuery `bind` method on a node and pass in the callback as a native function (inline or referenced).  You can write your own array map function like the `collect` in the example library and have loops inline in your json template.  Also you can build the haml procedurally in javascript and then append it to the page.  With clever use of closures you can create entire databound systems with minimal effort.  See the databind example for more details.

One common pattern is to write functions that convert domain data into haml data. These are the equivalents of view templates in MVC arcitectures.  This way, the server only needs to send the raw data and the client can transform it into interactive html all on it's own.

With a little practice and a good understanding of javascript internals, you can easily create entire applications with the entire interface written in haml-js.  There is no longer a need for servers to feed html to your site.  The page can manage it just fine on it's own.

Want to see it in action?
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
  


