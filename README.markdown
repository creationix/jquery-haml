# jQuery-haml

jQuery-haml is a [haml][] like language written in JSON. This allows for easy dom building so that web apps can do more work independent of the server for a better user experience. Based on [haml][] from the ruby world.

You can see a small example page using it at <http://static.creationix.com/jquery-haml/examples/index.html>

View source to see that all the content is build after page load.

# NOTE: This project was recently split

The server-side half of the component stayed at the old name of [haml-js][] and has it's own documentation and everything there.

---------------------

jQuery-haml is a [jQuery][] plugin. In order to use it you simply include the `jquery.haml-1.3.js` file in your jQuery project and use it as a dom builder.

## How to use

### Basic Syntax

Here is the first example from the haml site converted to jsonified haml:

**jsonified-haml**

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

One thing you'll notice right away is that this is encoded in pure JSON. This means that you can stream it from a server via ajax calls and it can be executed in the browser to create dom structures on the fly.

The basic rules are very similar to the real [haml][] for ruby. If the first item in a list is a string, then that is the css selector for that node. It consists of `element#id.class`. If the element is left out, jQuery-haml will assume div. You can have multiple css classes and even include spaces. The id and class are of course optional. After that, everything in the list is considered content inside the node. Arrays are child nodes and more strings are text nodes.

### Attributes syntax

Here is another example with some html attributes specified:

**jsonified-haml**

    ["%strong", {class: "code", style: "color:red;"},  "Hello, World!"]

**html**

    <strong class="code" style="color:red;">Hello, World!</strong>

The new thing to note here is that we can specify html attributes. This is done by including a json object after the string representing the node's css selector. The keys and values become the attributes of the html node.

### CSS Special Syntax

Sometimes css can be complex enough that some structure is desired.

**jsonified-haml**

    ["#main", {css: {position: "absolute", left:0, right:0, top:0, bottom:0}},
      [".greeting", {css: {"margin-top": "200px", "text-align": "center"}}, "Hello, World!"]
    ]

**html**

    <div id="main" style="position:absolute;left:0;right:0;top:0;bottom:0;">
      <div class="greeting" style="margin-top:200px;text-align:center;">Hello, World!</div>
    </div>

When `css`, is used as an attribute, the value is a json object with key/value pairs representing the css styles. These will be applied using jQuery's css method. Note that other parameters can be used in this same overall hash. Also if preferred, a regular style attribute can be specified with manually formatted css.

### Javascript jQuery plugin Syntax

This is where this template language/framework really shines. Until now, this had little power over server side html generation or other dom builders like the ones built into other frameworks. Javascript execution syntax allows you to declaratively schedule JavaScript methods to be called when the node gets attached to the page.

**jsonified-haml**

    ["%div", {style: "width:260px; margin:15px;", $:{
      slider: [{value: 60}]
    }}]

**html**

    <div style="margin: 15px; width: 260px;" class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all">
      <a href="#" class="ui-slider-handle ui-state-default ui-corner-all" style="left: 60%;"/>
    </div>

This will render a fully functional slider widget from the [jQuery-ui][] library. Internally it queues up an event to call the `slider` method on the created node once it's attached to some element that's part of the page. Like the css syntax, this is encoded as an attribute. If the attribute it dollar, `$`, then the key/value pairs are method name and method parameters that are schedules to be applied to the node once it's live.

### Javascript onload Syntax

Sometimes the jquery plugins aren't enough, or you need to call the same plugin more than once, but only ome key is allowed in a hash. This is where the onload syntax comes in handy.

    ["%div", {style: "width:260px; margin:15px;", $:{
      slider: [{value: 60}],
      $: function() { this.slider('disable'); }
    }}]

In this example, we wanted to call the disable action on the slider plugin after turning the div into a slider. This was done with a generic onload function. The function given will be called in scope of the jquery node.

### Turning the jQuery-haml into DOM HTML

Usually you will be wanting to attach these element to some part of the page and so the this format is used more often. This is the `.haml` plugin that all jQuery object now have.

    $("body").haml(["%p", "Hello ", ["%img",{src:"logo.jpg"}]]);

This will create the new element and append it to the end of the body tag. Once it's the recursive function gets to the last step and appends the element tree to the page, any event's queued up would then take place.

Here is a fun one.  Add a paragraph saying "Hello World" onto every element in a page.

    $('*').haml(["%p", "Hello World"])

Run that in the Javascript console of any page that has jquery-haml loaded and watch the messages fly.

## TopCloud

Since jquery-haml can get out of hand for large applications, I wrote an abstraction layer on top of it.  Check out [TopCloud][].

## Get Involved

If you want to use this project and something is missing then send me a message.  I'm very busy and have several open source projects I manage.  I'll contribute to this project as I have time, but if there is more interest for some particular aspect, I'll work on it a lot faster.  Also you're welcome to fork this project and send me patches/pull-requests.

## License

jQuery-haml is [licensed][] under the [MIT license][].

[MIT license]: http://creativecommons.org/licenses/MIT/
[licensed]: http://github.com/creationix/jquery-haml/blob/master/LICENSE
[haml]: http://haml.hamptoncatlin.com/
[jquery]: http://jquery.com/
[jquery-ui]: http://jqueryui.com/
[TopCloud]: http://github.com/creationix/topcloud
[haml-js]: http://github.com/creationix/haml-js