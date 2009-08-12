/* ex:ts=2:et: */
/*jslint bitwise: true, browser: true, eqeqeq: true, evil: true, immed: true, newcap: true, 
    nomen: true, plusplus: true, regexp: true, undef: true, white: true, indent: 2 */
/*globals */

function Haml() {}

Haml.parse = function (text) {

  var empty_regex = new RegExp("^[ \t]*$"),
      indent_regex = new RegExp("^ *"),
      element_regex = new RegExp("^(?::[a-z]+|(?:[%][a-z][a-z0-9]*)?(?:[#.][a-z0-9_-]+)*)", "i"),
      haml, element, stack, indent, buffer, old_indent, mode, last_insert;

  function flush_buffer() {
    if (buffer.length > 0) {
      mode = "NORMAL";
      element.push(buffer.join("\n"));
      buffer = [];
    }
  }

  function parse_push() {
    stack.push({element: element, mode: mode});
    var new_element = [];
    mode = "NORMAL";
    element.push(new_element);
    element = new_element;
  }
  
  function parse_pop() {
    var last = stack.pop();

    if (element.length === 1) {
      if (typeof element[0] === "string") {
        if (element[0].match(element_regex)[0].length === 0) {
          // Collapse arrays with single string literal
          last.element[last.element.length - 1] = element[0];
        }
      }
    }
    element = last.element;
    mode = last.mode;
  }
  
  function get_indent(line) {
    if (line === undefined) {
      return 0;
    }
    var i = line.match(indent_regex);
    return i[0].length / 2;
  }
  
  function parse_attribs(line) {
    // Parse the attribute block using a state machine
    if (!(line.length > 0 && line.charAt(0) === '{')) {
      return line;
    }
    var l = line.length;
    var count = 1;
    var quote = false;
    var skip = false;
    for (var i = 1; count > 0; i += 1) {

      // If we reach the end of the line, then there is a problem
      if (i > l) {
        throw "Malformed attribute block";
      }

      var c = line.charAt(i);
      if (skip) {
        skip = false;
      } else {
        if (quote) {
          if (c === '\\') {
            skip = true;
          }
          if (c === quote) {
            quote = false;
          }
        } else {
          if (c === '"' || c === "'") {
            quote = c;
          }
          if (c === '{') {
            count += 1;
          }
          if (c === '}') {
            count -= 1;
          }
        }
      }
    }
    var block = line.substr(0, i);
    (function () {
      eval("element.push(" + block + ")");
    }.call(this));
    return line.substr(i);
  }
  
  function parse_content(line) {
    // Strip off leading whitespace
    line = line.replace(indent_regex, '');
    
    // Ignore blank lines
    if (line.length === 0) {
      return;
    }
    
    if (mode === 'ELEMENT') {
      parse_pop();
    }

    switch (line.charAt(0)) {
    case '/':
      break;
    case '=':
      (function () {
        eval("buffer.push(" + line.substr(1) + ")");
      }.call(this));
      break;
    case "\\":
      buffer.push(line.substr(1));
      break;
    default:
      buffer.push(line);
      break;
    }
  }

  function parse_element(line, selector) {

    flush_buffer();
    if (element.length > 0) {
      if (mode === 'ELEMENT') {
        parse_pop();
      }
      parse_push();
    }
    mode = 'ELEMENT';

    classes = selector.match(/\.[^\.#]+/g),
    ids = selector.match(/#[^\.#]+/g),
    tag = selector.match(/^%([^\.#]+)/g);
    plugin = selector.match(/^:([^\.#]+)/g);
    tag = tag ? tag[0].substr(1) : null;
    plugin = plugin ? plugin[0].substr(1) : null;
    
    line = parse_attribs.call(this, line.substr(selector.length));
    
    var attrs;
    if (typeof element[element.length - 1] === "object") {
      attrs = element[element.length - 1];
    } else {
      attrs = {};
      element.push(attrs);
    }
    if (tag) {
      attrs.tag = tag;
    }
    if (plugin) {
      attrs.plugin = plugin;
    }
    if (ids) {
      for (var i = 0, l = ids.length; i < l; i += 1) {
        ids[i] = ids[i].substr(1);
      }
      if (attrs.id) {
        ids.push(attrs.id);
      }
      attrs.id = ids.join(" ");
    }
    if (classes) {
      for (var i = 0, l = classes.length; i < l; i += 1) {
        classes[i] = classes[i].substr(1);
      }
      if (attrs['class']) {
        classes.push(attrs['class']);
      }
      attrs['class'] = classes.join(" ");
    }

    if (selector.charAt(0) === ':') {
      mode = 'RAW';
    } else {
      if (!line.match(empty_regex)) {
        parse_push();
        parse_content.call(this, line, true);
        flush_buffer();
        parse_pop();
      }
    }
  }
  
  function process_plugins() {
    var contents, i;
    switch (element[0]) {
    case ':if':
      var condition = element[1].condition;
      contents = element[2];
      for (i in element) {
        if (element.hasOwnProperty(i)) {
          delete element[i];
        }
      }
      if (condition) {
        var new_element = Haml.parse.call(this, contents);
        for (i in new_element) {
          if (new_element.hasOwnProperty(i)) {
            element[i] = new_element[i];
          }
        }
        element.length = new_element.length;
      }
      break;
    case ':foreach':
      var array, key, value, key_name, value_name;
      array = element[1].array;
      key_name = element[1].key;
      value_name = element[1].value;
      contents = element[2];
      for (i in element) {
        if (element.hasOwnProperty(i)) {
          delete element[i];
        }
      }
      element.length = 0;
      for (key in array) {
        if (array.hasOwnProperty(key)) {
          value = array[key];
          this[key_name] = key;
          this[value_name] = value;
          element.push(Haml.parse.call(this, contents));
        }
      }
      break;
    }
  }
    
  haml = [];
  element = haml;
  stack = [];
  buffer = [];
  mode = 'NORMAL';
  parse_push(); // Prime the pump so we can have multiple root elements
  indent = 0;
  old_indent = indent;
  
  var lines = text.split("\n"),
      line, line_index, line_count;
      
  line_count = lines.length;
  for (line_index = 0; line_index <= line_count; line_index += 1) {
    line = lines[line_index];
    
    switch (mode) {
    case 'ELEMENT':
    case 'NORMAL':
      
      // Do indentation
      indent = get_indent(line);
      if (indent === old_indent + 1) {
        parse_push();
        old_indent = indent;
      }
      while (indent < old_indent) {
        flush_buffer();
        parse_pop();
        old_indent -= 1;
      }
      
      if (line === undefined) {
        continue;
      }
      
      line = line.substr(indent * 2);
      
      // Check for special element characters
      var match = line.match(element_regex);
      if (match && match[0].length > 0) {
        parse_element.call(this, line, match[0]);
      } else {
        parse_content.call(this, line);
      }
      break;
    case 'RAW':
      if (get_indent(line) <= indent) {
        flush_buffer();
        process_plugins.call(this);
        mode = "ELEMENT";
        line_index -= 1;
        continue;
      }
      line = line.substr((indent + 1) * 2);
      buffer.push(line);
      break;
    }
  }
  
  if (haml.length === 1 && typeof haml[0] !== 'string') {
    haml = haml[0];
  }
  return haml;
};

// Exports for node
if (exports) {
  exports.parse = Haml.parse;
}

