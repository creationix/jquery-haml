function getparam(key, d) {
  var value = window.location.href.match(new RegExp("[?&]"+key+"=([^&#]*)"));
  return value ? value[1] : d;
}

var pages = {
  "index": "Index Page",
  "ui-demo": "jQuery UI samples",
  "databind": "DataBinding example",
  "markdown": "Markdown and variable replacement example"
};

var page_keys = ["index", "databind", "ui-demo", 'markdown'];

var styles = ["dark-hive","sunny","ui-darkness","ui-lightness"];

// Render the page
$("body").haml(
  ["h1", "Welcome to haml-js"],
  ["p", "Feel free to look around.  Here is an index of all pages:"],
  ["table.ui-widget.ui-widget-content.ui-corner-all",
    ["thead.ui-widget-header",
      ["tr",
        ["th"],
        $.map(styles, function(style){
          return [["th", style]];
        })
      ]
    ],
    ["tbody.ui-widget-content",
      $.map(page_keys, function(key){
        var a = [["tr",
          ["th", pages[key]],
          $.map(styles, function(style){
            return [["td",["a",{href:"?page="+key+"&skin=" + style}, "Go Here!"]]];
          })
        ]];
        return a;
      })
    ]
  ]
);

