// requires jquery-ui

// Test an object for it's constructor type. Sort of a reverse, discriminatory instanceof
function isTypeOf(t, c){ if (t === undefined) {return 'undefined';} return t.constructor.toString().match(new RegExp(c, 'i')) !== null; }


function each(obj, fn)
{
  if (isTypeOf(obj, "Array"))
  {
    for (i in obj) {
      fn(i, obj[i]);
    }
  }
  else {
    for (var k in obj) { 
      if (obj.hasOwnProperty(k)) {
        fn(k, obj[k]);
      }
    }
  }
  return obj;
}

function trace(message, obj)
{
  console.log(message, obj);
  return obj;
}

function collect(obj, fn)
{
  var accum = [];
  each(obj, function(i,v){ accum.push(fn(i,v)); });
  return accum;
}

function inspect(data, limit) {
  if (limit === undefined) {
    limit = 5;
  }
  if (limit <= 0) {return "...";}
  if (isTypeOf(data, "Array")) {
    var accum = ["ul"];
    each(data, function(k,v){ accum.push(["li", inspect(v, limit-1)]); });
    return accum;
  }
  else if (isTypeOf(data, "String")) {
    return '"'+data.replace(/\"/g,'\\"').replace(/\t/g,'\\t').replace(/\n/g,'\\n')+'"';
  }
  else if (isTypeOf(data, "Object")) {
    var accum = ["dl"];
    each(data, function(k,v){
      accum.push(["dt", k+":"]);
      accum.push(["dd", inspect(v, limit-1)]);
    });
    return accum;
  }
  else {
    return data+"";
  }
}


function small_header(options, content)
{
  return ["p.ui-state-default ui-corner-all", {
      style: "padding:4px;margin: 10px 0"
    },
    ["span.ui-icon.ui-icon-" + options.icon, {style: "float:left; margin:-2px 5px 0 0;" }],
    content
  ];
}

function button(options, content)
{
  return ["button.ui-state-default ui-button ui-corner-all", {
      style:"float: left; margin: 0 5px; line-height:13px;",
      $:{bind:["click", options.callback]}  
    }, 
    ["span.ui-icon.ui-icon-" + options.icon, {style: "float:left; margin:-2px 3px -2px -2px;" }],
    content
  ];
}

// Options:
//
// title - the title of the dialoc
// callback - a function called with true or false
//
function confirmation_dialog(options, content)
{
  return ["div", {
      title: options.title,
      $:{dialog: [{      
        bgiframe: true,
        resizable: false,
        modal: true,
        buttons: {
          Ok: function() {
            jQuery(this).dialog('close');
            options.callback(true);
          },
          Cancel: function() {
            jQuery(this).dialog('close');
            options.callback(false);
          }
        },
        close: function() {
          $(this).remove();
        }
      }]}
    }, ["p",
      ["span.ui-icon ui-icon-alert", {style:"float:left; margin:0 7px 20px 0;"}],
      content
    ]
  ];
}


// Options:
//
// title - dialog title
// w - dialog width
// h - dialog content height
function inline_dialog(options, content)
{
  return ["div", {
      title: options.title,
      $:{dialog: [{      
        bgiframe: true,
        height: 29+options.h,
        width: options.w,
        modal: true,
        resizable: true,
        close: function(e){
          $(this).remove();
          if (options.close) {
            options.close(e);
          }
        }
      }]}
    },
    content
  ];
}

// Meta example:
//  {
//    name: {type:"text"},
//    description: {type:"textarea",title:"Long Description"}
//  }
// Data is reference to actual data store.
function form_builder(meta, data, notify)
{
  var disabled;
  if (notify === undefined)
  {
    disabled = true;
    notify = function(){};
  }
  return collect(meta, function(name, options) {
    if (!options.label) {
      options.label = name.charAt(0).toUpperCase() + name.substr(1).toLowerCase();
    }
    var content;
    switch (options.type) {
      case "textarea":
        content = ["textarea.ui-widget-content ui-corner-all", {
          style:"width:250px;padding:5px;margin:2px 15px;height:100px",
          name:name,
          $:{
            bind:["keyup", function(e){data[name]=this.value;notify(name);}],
            $: function() { if (disabled){this.attr("disabled", "disabled").addClass('ui-state-disabled');} }
          }
        }, data[name]];
        break;
      case "slider":
        content = ["div", {style: "width:260px; margin:15px;", $:{
          slider: [{
            value: data[name],
            change: function(event, ui) { data[name] = ui.value;notify(name); }
          }],
          $: function() { if (disabled){this.slider('disable');} }
        }}];
        break;
      case "eq":
        content = [".clearfix", collect(data[name], function(i,v){
          return ["div", {_: {height: "120px", "float": "left", margin: "15px"}, $:{
              slider: [{
                value: v,
                range:"min",
                orientation:"vertical",
                change: function(event, ui) { data[name][i] = ui.value;notify(name); }
              }],
              $: function() { if (disabled){this.slider('disable');} }
            }}
          ]; 
        })];
        break;
      default:
        content = ["input.ui-widget-content ui-corner-all", {
          style:"padding:5px;width:250px;margin:2px 15px",
          name:name, 
          value:data[name],
          $:{
            bind:["keyup", function(e){data[name] = this.value;notify(name);}],
            $: function() { if (disabled){this.attr("disabled", "disabled").addClass('ui-state-disabled');} }
          }}];
        break;
    }
    return [["p", {style:"font-weight:bold;"}, options.label], content];
  });
}
