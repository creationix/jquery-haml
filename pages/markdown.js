

$(function(){

var data = {
  vars: {
	  name: "Interested Visitor",
	  os: navigator.vendor + " " + navigator.vendorSub + " " + navigator.platform,
	  browser: navigator.userAgent
  },
	line: "# Welcome back {name},\n\nI see you're using *{browser}* on **{os}**."
};

function update_preview() {
  $('#line_preview').text(data.line).markdown(data.vars);
}

$('body').haml([
	["h1", data.vars.name],
  ["dl",
    ["dt", data.vars.os],
    ['dd', data.vars.browser]
  ],
	["table.ui-widget.ui-widget-content", {_:{"border-collapse":"collapse"}},
	  ["tr.ui-widget-header.ui-corner-top", {_:{"font-size":"20px","line-height":"1.5em"}},
	    ["th", "Markdown"],
	    ["th", "Variables"],
	    ["th", "Preview"]
    ],
    ["tr.ui-widget-content",
	    ["td", {_:{width:"50%","vertical-align":"top"}},
	      ["textarea.ui-widget-content ui-corner-all",
	        {_:{width:"100%",height:"400px",border:0},$:{bind:["keyup", function() {
	          data.line = this.value;
	          update_preview();
	        }]}}, 
	        data.line
        ]
	    ],
	    ["td", {_:{"vertical-align":"top",padding:"0 10px"}},
	      ["form", form_builder({
	        name: {type:"text"},
	        os: {type:"text"},
	        browser: {type:"text"}
	      }, data.vars, update_preview)]
	    ],
	    ["td#line_preview", {
	      _:{width:"50%","vertical-align":"top",padding:"0 10px"},
	      $:{markdown:[data.vars]}
      }, data.line]
    ]
  ],
  ["#ajax_description", {$:{
      load: ['README.markdown', null, function (responseText, textStatus, xhr) {
        $(this).html($.markdown(responseText));
      }]
    }}
  ]   
]);

});
