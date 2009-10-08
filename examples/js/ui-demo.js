$(function(){
// Render the page
$("body").haml(
  [".ui-widget-overlay"],
  ["%table",{css:{position:"absolute","margin-top":"2em"}},
    ["%tr",
      ["%td", {style:"vertical-align:top;padding: 0 10px"},
        ["%p.ui-state-default.ui-corner-all.ui-helper-clearfix", {style: "padding:4px;" },
          ["%span.ui-icon.ui-icon-volume-on", {style: "float:left; margin:-2px 5px 0 0;" }],
          "Master volume"
        ],
        ["%div", {style: "width:260px; margin:15px;", $:{
          slider: [{
			        value: 60
		      }]
	      }}],
        ["%p.ui-state-default.ui-corner-all", {style:"padding:4px;margin-top:4em;" }, 
          ["%span.ui-icon.ui-icon-signal", {style: "float:left; margin:-2px 5px 0 0;" }],
          "Graphic EQ"
        ],
        ["%div", $.map([88, 77, 55, 33, 40, 45, 70], function (v) {
          return [["%span", {
            css: {height: "120px", "float": "left", margin: "15px"},
            $: {slider:[{value:v,range:"min",animate:true,orientation:"vertical"}]}
          }]];
        })],
        ["%p.ui-state-default.ui-corner-all", {style:"padding:4px;margin-top:4em;clear:both;" }, 
          ["%span.ui-icon.ui-icon-calendar", {style: "float:left; margin:-2px 5px 0 0;" }],
          "Date Picker"
        ],
        ["%div", {$:{datepicker:[]}}]
      ],
      ["%td", {style:"vertical-align:top;padding: 0 10px;width:400px"},
        ["%p.ui-state-default.ui-corner-all", {style:"padding:4px;" }, 
          ["%span.ui-icon.ui-icon-calendar", {style: "float:left; margin:-2px 5px 0 0;" }],
          "Accordion"
        ],
        ["%div", {$:{accordion:[]}},
          ["%h3", ["%a",{href:"#"}, "Section 1"]],
          ["%div",
            ["%p", "Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate."]
          ],
          ["%h3", ["%a",{href:"#"}, "Section 2"]],
          ["%div",
            ["%p", "Sed non urna. Donec et ante. Phasellus eu ligula. Vestibulum sit amet purus. Vivamus hendrerit, dolor at aliquet laoreet, mauris turpis porttitor velit, faucibus interdum tellus libero ac justo. Vivamus non quam. In suscipit faucibus urna."]
          ],
          ["%h3", ["%a",{href:"#"}, "Section 3"]],
          ["%div",
            ["%p", "Nam enim risus, molestie et, porta ac, aliquam ac, risus. Quisque lobortis. Phasellus pellentesque purus in massa. Aenean in pede. Phasellus ac libero ac tellus pellentesque semper. Sed ac felis. Sed commodo, magna quis lacinia ornare, quam ante aliquam nisi, eu iaculis leo purus venenatis dui."],
            ["%ul",
              ["%li", "List item one"],
              ["%li", "List item two"],
              ["%li", "List item three"]
            ]
          ],
          ["%h3", ["%a",{href:"#"}, "Section 4"]],
          ["%div",
            ["%p", "Cras dictum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aenean lacinia mauris vel est."],
            ["%p", "Suspendisse eu nisl. Nullam ut libero. Integer dignissim consequat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."]
          ]
        ]
      ],
      ["%td", {style:"vertical-align:top;width:430px;padding: 0 10px;"},
        ["%p.ui-state-default.ui-corner-all", {style:"padding:4px;" }, 
          ["%span.ui-icon.ui-icon-calculator", {style: "float:left; margin:-2px 5px 0 0;" }],
          "Tabs"
        ],
        ["%div", {$:{tabs:[]}},
          ["%ul",
            ["%li", ["%a",{href:"#tabs-1"}, "Nunc tincidunt"]],
            ["%li", ["%a",{href:"#tabs-2"}, "Proin dolor"]],
            ["%li", ["%a",{href:"#tabs-3"}, "Aenean lacinia"]]
          ],
          ["#tabs-1",
            ["%p", "Proin elit arcu, rutrum commodo, vehicula tempus, commodo a, risus. Curabitur nec arcu. Donec sollicitudin mi sit amet mauris. Nam elementum quam ullamcorper ante. Etiam aliquet massa et lorem. Mauris dapibus lacus auctor risus. Aenean tempor ullamcorper leo. Vivamus sed magna quis ligula eleifend adipiscing. Duis orci. Aliquam sodales tortor vitae ipsum. Aliquam nulla. Duis aliquam molestie erat. Ut et mauris vel pede varius sollicitudin. Sed ut dolor nec orci tincidunt interdum. Phasellus ipsum. Nunc tristique tempus lectus."]
          ],
          ["#tabs-2",
            ["%p", "Morbi tincidunt, dui sit amet facilisis feugiat, odio metus gravida ante, ut pharetra massa metus id nunc. Duis scelerisque molestie turpis. Sed fringilla, massa eget luctus malesuada, metus eros molestie lectus, ut tempus eros massa ut dolor. Aenean aliquet fringilla sem. Suspendisse sed ligula in ligula suscipit aliquam. Praesent in eros vestibulum mi adipiscing adipiscing. Morbi facilisis. Curabitur ornare consequat nunc. Aenean vel metus. Ut posuere viverra nulla. Aliquam erat volutpat. Pellentesque convallis. Maecenas feugiat, tellus pellentesque pretium posuere, felis lorem euismod felis, eu ornare leo nisi vel felis. Mauris consectetur tortor et purus."]
          ],
          ["#tabs-3",
            ["%p", "Mauris eleifend est et turpis. Duis id erat. Suspendisse potenti. Aliquam vulputate, pede vel vehicula accumsan, mi neque rutrum erat, eu congue orci lorem eget lorem. Vestibulum non ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce sodales. Quisque eu urna vel enim commodo pellentesque. Praesent eu risus hendrerit ligula tempus pretium. Curabitur lorem enim, pretium nec, feugiat nec, luctus a, lacus."],
            ["%p", "Duis cursus. Maecenas ligula eros, blandit nec, pharetra at, semper at, magna. Nullam ac lacus. Nulla facilisi. Praesent viverra justo vitae neque. Praesent blandit adipiscing velit. Suspendisse potenti. Donec mattis, pede vel pharetra blandit, magna ligula faucibus eros, id euismod lacus dolor eget odio. Nam scelerisque. Donec non libero sed nulla mattis commodo. Ut sagittis. Donec nisi lectus, feugiat porttitor, tempor ac, tempor vitae, pede. Aenean vehicula velit eu tellus interdum rutrum. Maecenas commodo. Pellentesque nec elit. Fusce in lacus. Vivamus a libero vitae lectus hendrerit hendrerit."]
          ]
        ],
        ["%p.ui-state-default.ui-corner-all", {style:"padding:4px;margin-top:4em;" }, 
          ["%span.ui-icon.ui-icon-lightbulb", {style: "float:left; margin:-2px 5px 0 0;" }],
          "Highlight / Error"
        ],
        [".ui-widget",
          [".ui-state-highlight.ui-corner-all", {style: "padding: 0pt 0.7em; margin-top: 20px;"},
            ["%p",
              ["%span.ui-icon.ui-icon-info", {style: "float: left; margin-right: 0.3em;"} ],
              ["%strong", "Hey!"],
              "Sample ui-state-highlight style."
            ]
          ]
        ],
        ["%br"],
        [".ui-widget",
          [".ui-state-error.ui-corner-all", {style: "padding: 0pt 0.7em; margin-top: 20px;"},
            ["%p",
              ["%span.ui-icon.ui-icon-alert", {style: "float: left; margin-right: 0.3em;"} ],
              ["%strong", "Alert:"],
              "Sample ui-state-error style."
            ]
          ]
        ]
      ]
    ]
  ]
);

});
