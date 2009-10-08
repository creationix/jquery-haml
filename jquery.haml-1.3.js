/* ex:ts=2:et: */
/*jslint white: true, onevar: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, evil: true, maxerr: 50, indent: 2 */
/*globals jQuery */

//////////////////////////////////////////
//                                      //
// HAML for JS - DomBuilder for jQuery  //
//                                      //
// Tim Caswell <tim@creationix.com>     //
//                                      //
//////////////////////////////////////////

(function ($) {
  
  var action_queue = [], data_cache = {};

  // Test an object for it's constructor type. Sort of a reverse, discriminatory instanceof
  function isTypeOf(t, c) {
    if (t === undefined) {
      return c === 'undefined';
    }
    if (t === null) {
      return c === 'null';
    }
    return t.constructor.toString().match(new RegExp(c, 'i')) !== null;
  }

  // Parses declarations out of the flat attribute array
  function extractor(attrs, symbol) {
    if (!attrs || !attrs[symbol]) {
      return undefined;
    }
    var extract = attrs[symbol];
    delete attrs[symbol];
    return extract;
  }

  function is_selector(obj) {
    // Must be string of at least 2 length
    if (typeof obj !== "string" || obj.length < 2) {
      return false;
    }
    // Must start with '.', '#', or '%'
    var c = obj.charAt(0);
    if (!(c === '.' || c === '#' || c === '%')) {
      return false;
    }
    return true;
  }
  
  
  // The workhorse that creates the node.
  function exec_haml(node, haml) {

    var css, actions, input, selector, classes, ids, tag, newnode, attributes;

    // Shallow copy haml so we don't eat our input when we shift the array
    // Also this turns "arguments" pseudo-arrays to real arrays
    input = Array.prototype.slice.call(haml, 0);
    
    function apply_haml(parent, part) {
      
      // Ignore undefined and null, they only break things.
      if (part === undefined || part === null) {
        return;
      }
    
      // Pass dom and jquery nodes through as is
      if (part.nodeType || part.jquery) {
        parent.append(part);
        return;
      }

      // Strings and numbers are text nodes
      if (isTypeOf(part, 'String') && part.length > 0) {
        // Strip of leading backslash
        if (part[0] === '\\') {
          part = part.substr(1);
        }
        parent.append(document.createTextNode(part));
        return;
      }
      if (isTypeOf(part, 'Number')) {
        parent.append(document.createTextNode(part));
        return;
      }
      
      // Recursivly run arrays
      if (isTypeOf(part, 'Array') && part.length > 0) {
        exec_haml(parent, part);
        return;
      }
    }

    if (input.length && input.length > 0)
    {
      if (is_selector(input[0])) {
        // Pull the selector off the front
        // Parse out the selector information
        // Default tag to div if not specified
        selector = input.shift();
        classes = selector.match(/\.[^\.#]+/g);
        ids = selector.match(/#[^\.#]+/g);
        tag = selector.match(/^%([^\.#]+)/g);
        tag = tag ? tag[0].substr(1) : 'div';

        // Create the node
        newnode = $(document.createElement(tag));
        
        // Parse the attributes if there are any
        if (input.length > 0 && isTypeOf(input[0], 'Object')) {
          attributes = input.shift();
          css = extractor(attributes, 'css');
          actions = extractor(attributes, '$');
          newnode.attr(attributes);
        }

        // Add in the ids from the selector
        if (ids) {
          $.each(ids, function () {
            var id, old_id;
            id = this.substr(1);
            old_id = newnode.attr('id');
            if (old_id) {
              newnode.attr('id', old_id + " " + id);
            }
            else {
              newnode.attr('id', id);
            }
          });
        }
        
        // Add in the classes from the selector
        if (classes) {
          $.each(classes, function () {
            newnode.addClass(this.substr(1));
          });
        }

        // Add in any css from underscore styles        
        if (css) {
          newnode.css(css);  
        }

        // Move a level deeper in the dom tree
        node.append(newnode);
        node = newnode;
        
        // Process jquery actions as well
        if (actions) {
          $.each(actions, function (method) {
            action_queue.push({node: node, method: method, params: this});
          });
        }
      }

      // Add in content with recursive call      
      $.each(input, function () {
        apply_haml(node, this);
      });
    }
    else
    {
      apply_haml(node, input);
    }
  }
  
  // jQuery events are queued up till we're sure the node exists in the main dom.  Once
  // it's safe, this function is called to actually flush the queue and execute the function calls.
  function flush_queue() {
    $.each(action_queue, function () {
      // $ is a special case that means onload
      if (this.method === '$') {
        this.params.apply(this.node, []);
      }
      // otherwise call method on the jquery object with given params.
      else {
        if (!isTypeOf(this.params, 'Array')) {
          this.params = [this.params];
        }
        this.node[this.method].apply(this.node, this.params);
      }
    });
    action_queue = [];
  }
  
  // Calling haml on a node converts the passed in array to dom children
  $.fn.haml = function (/* haml1, haml2, ... */) {
    
    var haml, newnode;
    
    // Shallow copy and convert to array
    haml = Array.prototype.slice.call(arguments, 0);
    
    // Build the dom on a non-attached node
    newnode = $(document.createElement("div"));
    exec_haml(newnode, haml);
    
    // Then attach it's children to the page.
    this.append(newnode.children());
    
    // Flush action queue once we're on the page
    if (this.closest('body').length > 0) {
      flush_queue();
    }

    // Return "this" to allow for chaining.
    return this;
  };
  
  // static helper functions
  $.haml = {
    // This is a constructor to create a piece of page that is re-drawable.
    // The passed in callback is the function that provides the haml input.
    // Call inject() on the resulting object to place it in the haml document stream
    // and call update() on the placeholder whenever you want it to redraw itself.
    placeholder: function (callback) {
      var children;
      
      function inject()  {
        // Build the dom on a non-attached node
        var node = $(document.createElement("div"));
        node.haml(callback.apply(this, arguments));
        children = node.children();
        return children;
      }
      
      // Replace the first child node with the new children and remove other
      // old children if there are any.
      function update() {
        $.each(children, function (i, child) {
          if (i === 0) {
            $(child).replaceWith(inject.apply(this, arguments));
          } else {
            $(child).remove();
          }
        });
        flush_queue();
      }
      
      return {
        inject: inject,
        update: update
      };
    },

    // data_provider is a function that has the form "function (on_data)" where
    // on_data is of the form "function (data)" so that OnDemand can call
    // data_provider giving it a callback, and the callback will be called with
    // the data when it's available.
    // onDemand returns functions that returns a placeholder.  See above for details.
    onDemand: function (data_provider, loading_message) {
      var placeholder;
      
      loading_message = ["%div", {style: "text-align: center; cursor: wait"}, loading_message || "Loading..."];

      return function (renderer/*, param1, param2...*/) {
        var params = Array.prototype.slice.call(arguments, 1);
        function render_haml() {
          var key = Util.stringify(params);
          if (data_cache[key] !== undefined) {
            // If data is in data_cache, render directly
            return renderer(data_cache[key]);
          } else {
            // Otherwise put in a placeholder and then replace once the data is known
            function on_data(data) {
              data_cache[key] = data;
              placeholder.update();
            }
            data_provider.apply(this, [on_data].concat(params));
            return loading_message;
          }
        }
        placeholder = $.haml.placeholder(render_haml);
        return placeholder;
      };
    }
  };

}(jQuery));
