/*
 * HAML for JS - DomBuilder for jQuery
 *
 * Tim Caswell <tim@creationix.com>
 * 
 */
(function($){

  var action_queue = [];

  // Make available as a chainable command.
  $.fn.haml = function() {
    var haml = arguments;
    if (haml.length == 1) {haml = haml[0];}
    if (isTypeOf(haml[0], "Array")) {
      return this.each(function(){
        var node = $(this);
        $.each(haml, function() {
          node.haml(this);
        });
      });
    }
    else {
      var el = $.haml(haml);
      var result = this.each(function(){ $(this).append(el); });
      
      // Flush the action_queue once we're appended to a live element
      if (action_queue.length > 0)
      {
        if (el[0].clientHeight > 0 || el[0].clientWidth > 0)
        {
          $.each(action_queue, function(){
            // $ is a special case that means onload
            if (this.method == '$')
            {
              this.params.apply(this.context, []);
            }
            // otherwise call method on the jquery object with given params.
            else
            {
              this.context[this.method].apply(this.context, this.params);
            }
          });
          action_queue = [];
        }
      }
      return result;
    }
  };

  // The workhorse that creates the node.
  $.haml = function(haml){
  
    // Pull the selector off the front
    // Parse out the selector information
    // Default tag to div if not specified
    var selector = haml.shift();
    var classes = selector.match(/\.[^\.#]+/g);
    var ids = selector.match(/#[^\.#]+/g);
    var tag = selector.match(/^[^\.#]+/g);
    tag = tag ? tag[0] : 'div';

    // Create the node and create it's children recursivly
    var node = $(document.createElement(tag));
    var css, actions;
    $.each(haml, function() {
      if (isTypeOf(this, 'Object')) {
        css = extractor(this, '_');
        actions = extractor(this, '$');
        node.attr(this);
      }
      if (isTypeOf(this, 'String')) {node.append(this+"");}
      if (isTypeOf(this, 'Array')) {node.haml(this);}
    });
    
    // Add in the ids from the selector
    if (ids) {
      $.each(ids, function() {
        var id = this.substr(1);
        old_id = node.attr('id');
        if (old_id) {
          node.attr('id', old_id + " " + id);
        }
        else {
          node.attr('id', id);
        }
      });
    }
    
    // Add in the classes from the selector
    if (classes) {
      $.each(classes, function() {
        var klass = this.substr(1);
        var old_class = node.attr('class');
        if (old_class) {
          node.attr('class', old_class + " " + klass);
        }
        else {
          node.attr('class', klass);
        }
      });
    }
    
    if (css) {
      node.css(css);  
    }
    
    if (actions) {
      $.each(actions, function(k) {
        action_queue.push({method: k, context: node, params: this});
      });
    }
    
    return node;
  };

  // Test an object for it's constructor type. Sort of a reverse, discriminatory instanceof
  function isTypeOf(t, c) {
    if (t === undefined) {return 'undefined';}
    return t.constructor.toString().match(new RegExp(c, 'i')) !== null;
  }

  // Parses declarations out of the flat attribute array
  function extractor( attrs, symbol ) {
    if (!attrs || !attrs[symbol] ) {return undefined;}
    var extract = attrs[symbol];
    delete attrs[symbol];
    return extract;
  }

})(jQuery);
