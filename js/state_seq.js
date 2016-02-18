var treatment_name = "io-sense-only";
var data_fpath = "http://localhost:8000/devo_ws/avida_experiments/phenotypic_plasticity/io-sense/scripts/analysis/d3/data/"+treatment_name+"-treatment_lineages_states.csv";

// Build environment data: (what did the environment look like?)
var cycle_length = 200;
var max_update = 100000;
var environment_sequence = [];
var prev_environment = "NONE";
for (var i = 0; i < max_update; i += cycle_length) {
  var start_update = i;
  var duration = cycle_length;
  // clip duration to not go above max_update
  if (duration > max_update) {
    duration = max_update - start_update;
  }
  var current_environment = "";
  if (prev_environment == "nandmnotp" || prev_environment == "NONE") {
    current_environment = "nandpnotm";
  } else {
    current_environment = "nandmnotp";
  }
  environment_sequence.push({"environment": current_environment, "start": start_update, "duration": duration});
  prev_environment = current_environment;
}

// Build y axis labels
var yaxis_label_interval = 500;
yaxis_labels = [];
for (var i = 0; i <= max_update; i += yaxis_label_interval) {
  var label = i;
  if (label > max_update) {
    label = max_update;
  }
  yaxis_labels.push(label);
}

// Some constants:
var x_domain = [0, 110]  // Range of values x can take on
var y_domain = [0, 100000]      // Range of values y can take on


// Setup canvas
var chart_area = d3.select("#chart_area");
var frame = chart_area.append("svg");
var canvas = frame.append("g");

var margin = {top: 20, right: 20, bottom: 30, left: 50};
var frame_width = 1080;
var frame_height = 8000;
var canvas_width = frame_width - margin.left - margin.right;
var canvas_height = frame_height - margin.top - margin.bottom;

frame.attr({"width": frame_width, "height": frame_height});
canvas.attr({"transform": "translate(" + margin.left + "," + margin.top + ")"});

// SETUP X AXIS
var xScale = d3.scale.linear();
xScale.domain(x_domain).range([0, canvas_width]);
var xAxis = d3.svg.axis().scale(xScale).tickValues([]).orient("top");
canvas.append("g").attr({"class": "x_axis"}).call(xAxis);

// SETUP Y AXIS
var yScale = d3.scale.linear();
yScale.domain(y_domain).range([0, canvas_height]);
var yAxis = d3.svg.axis().scale(yScale).tickValues(yaxis_labels).orient("left");
canvas.append("g").attr({"class": "y_axis"}).call(yAxis);

// Draw environment indicator
var env_canvas = canvas.append("g").attr({"class": "env_canvas"});
var env_blocks = env_canvas.selectAll("rect").data(environment_sequence)
                  .enter().append("rect").attr({"y": function(d) { return yScale(d.start); },
                                                "x": function(d) { return xScale(0); },
                                                "width": function(d) { return 5; },
                                                "height": function(d) { return yScale(d.duration); },
                                                "class": function(d) { return d.environment; },
                                            });


// Data Loading Function
var data_accessor = function(row) {
  var states = row.sequence.split("-");
  var state_durations = row.duration_updates.split("-").map(Number);
  var state_entries = row.start_updates.split("-").map(Number);
  var state_sequence = [];
  for (i = 0; i < states.length; i++) {
    state_sequence.push({state: states[i], duration: state_durations[i], start: state_entries[i]});
  }
  return {
    rep_id: row.id,
    final_plastic: row.final_plastic,
    state_sequence: state_sequence
  };
}

var data_callback = function(data) {
  // Build data canvas
  var data_canvas = canvas.append("g").attr({"class": "data_canvas"});
  var display = $('input[name="display"]:checked').val();
  var display_data = data.filter(function(d) {
                                    if (display == "plastic") {
                                      return d.final_plastic == "True";
                                    } else if (display == "nonplastic") {
                                      return d.final_plastic == "False";
                                    } else if (display == "all") {
                                      return d;
                                    }
                                  });

  var update = function() {
    // Here's where we draw the visualization
    // Add group for each lineage
    var lineages = data_canvas.selectAll("g").data(display_data, function(d) { return d.rep_id; });
    lineages.enter().append("g");
    lineages.exit().remove();
    lineages.attr({"id": function(d) { return d.rep_id; }});
    // Add rectangle for each state in sequence
    lineages.each(function(lin_d, i) {
      var state_blocks = d3.select(this)
                            .selectAll("rect").data(lin_d.state_sequence);
      var rep_id_num = +lin_d.rep_id.split("_")[lin_d.rep_id.split("_").length - 1];
      state_blocks.enter().append("rect");
      state_blocks.exit().remove();
      state_blocks.attr({"y": function(d) { return yScale(d.start); },
                         "x": function(d) { return xScale(1.5 * i + 3); },
                         "height": function(d) { return yScale(d.duration); },
                         "width": function(d) { return 10; },
                         "class": function(d) { return d.state; }
                       });
    });
  }

  update();

  $(document).ready(function () {
    $("input[type='radio']").on("change", function(){
        display = $('input[name="display"]:checked').val();
        display_data = data.filter(function(d) {
                                          if (display == "plastic") {
                                            return d.final_plastic == "True";
                                          } else if (display == "nonplastic") {
                                            return d.final_plastic == "False";
                                          } else if (display == "all") {
                                            return d;
                                          }
                                        });
        update();
    });
  });
}

// Load data from csv
d3.csv(data_fpath, data_accessor, data_callback);
