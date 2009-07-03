$(function(){


var song = {
  title: "Name of the Song",
  description: "This is a \"description\".\n\nIt can be several lines long.",
  master_volume: 60,
  eq: [88, 77, 55, 33, 40, 45, 70]
};

function save()
{
  // Simulate an ajax request.
  $("#saving").show();
  setTimeout(function() {
    $("#target").empty().haml(form(song));
    setTimeout(function() {
      $("#saving").hide();
    }, 200);
  }, 200);
}
var timer;

function form(song, live)
{
  var notify;
  if (live) {
    notify = function(field) {
      if (timer) {
        clearTimeout(timer);
      }
      $("#inspect").empty().haml(inspect(song));
      timer = setTimeout(save, 5000);
    };
  }
  
  return ["form", {onsubmit:"return false"},
    form_builder({
      title:{type:"text"},
      description:{type:"textarea"},
      master_volume:{type:"slider",label:"Master Volume"},
      eq:{type:"eq"},
    },song,notify)
  ];
}

// Render the page
$("body").haml(
  [".ui-widget-overlay"],
  ["p",{_:{position:"absolute"}},
    ["strong", "databinding haml-js demos"],
    " Go back ",
    ["a", {href:"?page=index&skin="+getparam("skin", "ui-lightness")}, "home"],
    "."
  ],
  ["table",{_:{position:"absolute","margin-top":"2em"}},
    ["tr",
      ["td", {style:"vertical-align:top;padding: 0 10px"},
        small_header({icon:"volume-on"}, "Data Bind Form"),
        form(song, true)
      ],
      ["td", {style:"vertical-align:top;padding: 0 10px;width:400px"},
        small_header({icon:"calendar"}, "Data in memory(Inspect)"),
        ["#inspect.ui-widget-content ui-corner-all", {style:"padding:0 10px"},
          inspect(song)
        ],
        ["p",
          button({icon:'refresh',callback:function(){
            clearTimeout(timer);
            save();
          }}, "Save")
        ]
      ],
      ["td", {style:"vertical-align:top;width:430px;padding: 0 10px;"},
        small_header({icon:"calculator"}, "Data on Server(Graphical)"),
        ["#saving.ui-widget ui-widget-content ui-corner-all ui-state-highlight", {style:"position:absolute;padding:5px 10px;display:none"},"Saving"],
        ["#target", form(song)]
      ]
    ]
  ]
);

});
