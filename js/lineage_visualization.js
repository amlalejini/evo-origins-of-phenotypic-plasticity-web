/////////////////////////////////////////////////////////
// js used to generate figure for alife 2016 paper (evo stepping stones for plasticity)
/////////////////////////////////////////////////////////

// Load relevant things from settings
var treatment_name = default_treatment;
var settings = lineage_vis_settings;
var data_fpath = lineage_vis_data_fpath;        // Data path for lineage sequence data
var hr_name               = null;        // Human readable name for treatment
var display_ranges        = null;        // Lineage time-slices
var max_update            = null;        // Max update for treatment
var cycle_length          = null;        // Environment cycle length for treatment
var environment_codes     = null;        // Environment codes (in order)
var update_label_interval = null;
var max_reps              = null;
var total_range           = null;
var environment_sequence  = null;
var display_full          = false;
var zoom_mult             = 0.20;
// canvas parameters; TODO: move all of these values to param js file
var margin = {top: 20, right: 40, bottom: 20, left: 100};
var frame_width = 940;
var frame_height = 1500;
var canvas_width = frame_width - margin.left - margin.right;
var canvas_height = frame_height - margin.top - margin.bottom;
// Some constants:
var x_domain = null;    // Range of values x can take on
var y_domain = null;            // Range of values y can take on
var spacer_length = 20;

var update_parameters = function() {
  ////////////////////////////
  // UPDATE GLOBAL PARAMETERS
  ////////////////////////////
  hr_name = settings[treatment_name]["hr_name"];                        // Human readable name for treatment
  var rdisp = null;
  if (display_full) { rdisp = "full_ranges"; } else { rdisp = "sliced_ranges"; }
  display_ranges = settings[treatment_name][rdisp];             // Lineage time-slices
  max_update = settings[treatment_name]["maximum_update"];              // Max update for treatment
  cycle_length = settings[treatment_name]["environment_cycle_length"];  // Environment cycle length for treatment
  environment_codes = settings[treatment_name]["environment_codes"];         // Environment codes (in order)
  update_label_interval = settings[treatment_name]["update_label_interval"];
  max_reps = settings[treatment_name]["max_reps"];
  // calculate total display range magnitude
  total_range = 0
  for (var i = 0; i < display_ranges.length; i++) {
    total_range += display_ranges[i][1] - display_ranges[i][0];
  }
  ////////////////////////////
  // Build environment sequence
  ////////////////////////////
  // Build environment data: (what did the environment look like?)
  environment_sequence = [];  // empty out environment sequence
  var prev_environment = -1;
  for (var i = 0; i < max_update; i += cycle_length) {
    var start_update = i;
    var duration = cycle_length;
    // clip duration to not go above max_update
    if (duration > max_update) {
      duration = max_update - start_update;
    }
    // Get current environment
    var cur_environment = (prev_environment + 1) % environment_codes.length;
    // Add environment to sequence
    environment_sequence.push({"environment": environment_codes[cur_environment], "start": start_update, "duration": duration});
    // Update previous environment
    prev_environment = cur_environment;
  }
  ////////////////////////////
  // Update frame/canvas parameters
  ////////////////////////////
  frame_width = $("#vis_panel").width() - 20; // at some point, this may actually be a variable parameters, but that day is not today
  frame_height = total_range * zoom_mult;
  canvas_width = frame_width - margin.left - margin.right;
  canvas_height = frame_height - margin.top - margin.bottom;
  ////////////////////////////
  // update axis parameters
  ////////////////////////////
  x_domain = [0, max_reps * 1.25 + 3];    // Range of values x can take on
  y_domain = [0, max_update];            // Range of values y can take on
}

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
    treatment: row.treatment,
    rep_id: row.id,
    final_plastic: row.final_plastic,
    state_sequence: state_sequence
  };
}

var slice_env_sequence = function(sequence) {
  // Given environment sequence, slice to display ranges
  var sliced_env = []
  for (var si = 0; si < sequence.length; si++) {
    for (var ri = 0; ri < display_ranges.length; ri++) {
      var start = sequence[si]["start"];
      var end = sequence[si]["duration"] + start;
      if ((start <= display_ranges[ri][1] && start >= display_ranges[ri][0]) ||
          (end <= display_ranges[ri][1] && end >= display_ranges[ri][0]) ||
          start <= display_ranges[ri][0] && end >= display_ranges[ri][1]) {
          var clipped_state = {"environment": sequence[si]["environment"], "start": start, "duration": sequence[si]["duration"]};
          if (start < display_ranges[ri][0]) {
            clipped_state.start = display_ranges[ri][0];
            clipped_state.duration = end - clipped_state.start;
          }
          if (end > display_ranges[ri][1]) {
            clipped_state.duration = display_ranges[ri][1] - clipped_state.start;
          }
          sliced_env.push(clipped_state);
      }
    }
  }
  return sliced_env;
}

var slice_data = function(data) {
  // Given data (list of lineage objects produced by data accessor function),
  //  slices state sequence data based on predefined ranges
  var sliced_data = [];
  for (var i = 0; i < data.length; i++) {
    var sliced_lineage = {treatment: data[i].treatment, rep_id: data[i].rep_id, final_plastic: data[i].final_plastic, state_sequence: []};
    // for each piece of data (lineage), make new sliced lineage
    for (var si = 0; si < data[i].state_sequence.length; si++) {
      // for each state in lineage, check to see if we're keeping it; if so, add to sliced lineage
      for (var ri = 0; ri < display_ranges.length; ri++) {
        // if state starts in range, or ends in range, or completely eclipses slice
        var start = data[i].state_sequence[si].start;
        var end = start + data[i].state_sequence[si].duration;
        if ((start <= display_ranges[ri][1] && start >= display_ranges[ri][0]) ||
            (end <= display_ranges[ri][1] && end >= display_ranges[ri][0]) ||
            start <= display_ranges[ri][0] && end >= display_ranges[ri][1]) {
          // clip to range if necessary
          var clipped_state = {state: data[i].state_sequence[si].state, duration: data[i].state_sequence[si].duration, start: data[i].state_sequence[si].start};
          if (start < display_ranges[ri][0]) {
            clipped_state.start = display_ranges[ri][0];
            clipped_state.duration = end - clipped_state.start;
          }
          if (end > display_ranges[ri][1]) {
            clipped_state.duration = display_ranges[ri][1] - clipped_state.start;
          }
          sliced_lineage.state_sequence.push(clipped_state);
        }
      }
    }
    sliced_data.push(sliced_lineage);
  }
  return sliced_data;
}

var get_range_id = function(state_sequence_obj) {
  // Given state sequence object, determine which range it belongs to
  for (var i = 0; i < display_ranges.length; i++) {
    if (state_sequence_obj.start <= display_ranges[i][1] && state_sequence_obj.start >= display_ranges[i][0]) {
      return i;
    }
  }
  // failure...
  return -1;
}



var data_callback = function(data) {
  ////////////////////////////////////////////////////////////////////
  // Update 'dem parameters
  ////////////////////////////////////////////////////////////////////
  // Set treatment selector text to current treatment name
  $("#treatment_selector").html(settings[treatment_name]["hr_name"] + "<span class='caret'></span>");
  // To slice or not to slice
  display_full = $("slice_toggle").prop("checked");
  // Update parameters based on current treatment name
  update_parameters();

  ////////////////////////////////////////////////////////////////////
  // setup canvas
  ///////////////////////////////////////////////////////////////////
  var chart_area = d3.select("#chart_area");
  var frame = chart_area.append("svg");
  var canvas = frame.append("g");

  frame.attr({"width": frame_width, "height": frame_height});
  canvas.attr({"transform": "translate(" + margin.left + "," + margin.top + ")"});

  ////////////////////////////////////////////////////////////////////
  // setup axes
  ///////////////////////////////////////////////////////////////////
  var yScales = [];
  ////////////////////////////////////////////////////////////////////
  // setup environment indicator
  ///////////////////////////////////////////////////////////////////
  // Draw environment indicator
  var env_canvas = canvas.append("g").attr({"class": "env_canvas"});
  // slice environment sequence
  environment_sequence = slice_env_sequence(environment_sequence);

  ////////////////////////////////////////////////////////////////////
  // setup display data
  ///////////////////////////////////////////////////////////////////
  // Build data canvas
  var data_canvas = canvas.append("g").attr({"class": "data_canvas"});
  // Grab initial type of data to display (plastic, nonplastic, or all)
  var display = $('input[name="display"]:checked').val();
  // Filter data by display and treatment
  var display_data = null;
  var full_data = data.filter(function(d) { return d.treatment == treatment_name; } )
                         .filter(function(d) {
                                    if (display == "plastic") {
                                      return d.final_plastic == "True";
                                    } else if (display == "nonplastic") {
                                      return d.final_plastic == "False";
                                    } else if (display == "all") {
                                      return d;
                                    }
                                  });
  // Slice data to dispaly ranges
  var display_data = slice_data(full_data);

  var update = function() {
    // Here's where we draw the visualization
    ///////////////////////////////////////////////////////
    // Update canvas
    ///////////////////////////////////////////////////////
    frame.attr({"width": frame_width, "height": frame_height});
    canvas.attr({"transform": "translate(" + margin.left + "," + margin.top + ")"});
    ///////////////////////////////////////////////////////
    // Update vertical axis
    ///////////////////////////////////////////////////////
    // SETUP X AXIS -- this shouldn't change on an update
    // clean up old axes
    canvas.selectAll("g.x_axis").remove();
    canvas.selectAll("text#x_axis_label").remove();
    var xScale = d3.scale.linear();
    xScale.domain(x_domain).range([0, canvas_width]);
    var xAxis = d3.svg.axis().scale(xScale).tickValues([]).orient("top");
    canvas.append("g").attr({"class": "x_axis"}).call(xAxis);
    // axis labels
    canvas.append("text").attr({"id": "x_axis_label", "class": "axis_label", "x":xScale(20), "y": -10})
                        .style("text-anchor", "middle")
                        .text("");
    // clean up old axes
    canvas.selectAll("g.y_axis").remove();
    canvas.selectAll("text#y_axis_label").remove();
    // update scales/axes
    yScales = [];
    var prev_range_end = 0;
    for (var i = 0; i < display_ranges.length; i++) {
      var current_range_end = prev_range_end + ( ( (display_ranges[i][1] - display_ranges[i][0]) / total_range) * (canvas_height - (spacer_length * (display_ranges.length - 1))))
      var yScale = d3.scale.linear();
      yScale.domain(display_ranges[i]).range([prev_range_end, current_range_end]);
      yScales.push(yScale);
      prev_range_end = current_range_end + spacer_length;
      var tick_num = (display_ranges[i][1] - display_ranges[i][0]) / update_label_interval;
      var yAxis = d3.svg.axis().scale(yScale).ticks(tick_num).orient("left");
      canvas.append("g").attr({"class": "y_axis", "id": "y_axis-" + i}).call(yAxis);
    }
    // update axis label
    canvas.append("text").attr({"id": "y_axis_label", "class": "axis_label", "x": 0 - (canvas_height/2), "y": 0 - (margin.left / 1.5), "transform": "rotate(-90)"})
                          .style("text-anchor", "middle")
                          .text("Update");
    ///////////////////////////////////////////////////////
    // Draw environment indicator
    ///////////////////////////////////////////////////////
    var env_blocks = env_canvas.selectAll("rect").data(environment_sequence);
    env_blocks.enter().append("rect");
    env_blocks.exit().remove();
    env_blocks.attr({"y": function(d) { var si = get_range_id(d); return yScales[si](d.start); },
                                                    "x": function(d) { return xScale(0); },
                                                    "width": function(d) { return 5; },
                                                    "height": function(d) { var si = get_range_id(d); return yScales[si](display_ranges[si][0] + d.duration) - yScales[si](display_ranges[si][0]); },
                                                    "class": function(d) { return d.environment; },
                                                });
    ///////////////////////////////////////////////////////
    // Draw display data
    ///////////////////////////////////////////////////////
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
      state_blocks.attr({"y": function(d) { var si = get_range_id(d); return yScales[si](d.start); },
                         "x": function(d) { return xScale(1.25 * i + 3); },
                         "height": function(d) { var si = get_range_id(d); return yScales[si](display_ranges[si][0] + d.duration) - yScales[si](display_ranges[si][0]); },
                         "width": function(d) { return xScale(0.95); },
                         "class": function(d) { return d.state; }
                       });
    });
  }

  // Okay, now update the drawing
  update();
  // Page component listeners
  $(document).ready(function () {
    // lineage type filtering
    $("input[type='radio']").on("change", function(){
        display = $('input[name="display"]:checked').val();
        full_data = data.filter(function(d) { return d.treatment == treatment_name; })
                           .filter(function(d) {
                                          if (display == "plastic") {
                                            return d.final_plastic == "True";
                                          } else if (display == "nonplastic") {
                                            return d.final_plastic == "False";
                                          } else if (display == "all") {
                                            return d;
                                          }
                                        });
        display_data = slice_data(full_data);
        update();
    });
    // treatment selection
    $(".dropdown-menu li a").click(function(){
      // update treatment name
      treatment_name = $(this).attr("value");
      // update paramters
      update_parameters();
      // update displayed treatment name in treatment selector
      $(this).parents(".dropdown").find('.btn').html(settings[treatment_name]["hr_name"] + ' <span class="caret"></span>');
      $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
      full_data = data.filter(function(d) { return d.treatment == treatment_name; })
                         .filter(function(d) {
                                        if (display == "plastic") {
                                          return d.final_plastic == "True";
                                        } else if (display == "nonplastic") {
                                          return d.final_plastic == "False";
                                        } else if (display == "all") {
                                          return d;
                                        }
                                      });
      display_data = slice_data(full_data);
      environment_sequence = slice_env_sequence(environment_sequence);
      update();
    });
    // zoom
    $("#vis_zoom_in").click(function() {
      // zoom in!
      zoom_mult = zoom_mult + zoom_rate;
      if (zoom_mult > 1.0) {
        zoom_mult = 1.0;
      }
      update_parameters();
      environment_sequence = slice_env_sequence(environment_sequence);
      update();
    });
    $("#vis_zoom_out").click(function() {
      // zoom out!
      zoom_mult = zoom_mult - zoom_rate;
      if (zoom_mult < 0.05) {
        zoom_mult = 0.05;
      }
      update_parameters();
      environment_sequence = slice_env_sequence(environment_sequence);
      update();
    });

    // slice vs. full
    $("#slice_toggle").change(function() {
      display_full = $(this).prop("checked");
      update_parameters();
      display_data = slice_data(full_data);
      environment_sequence = slice_env_sequence(environment_sequence);
      update();
    });

    $(window).resize(function () {
      update_parameters();
      environment_sequence = slice_env_sequence(environment_sequence);
      update();
    });

  });
}

var main = function() {
  update_parameters();
  // Load data from csv
  d3.csv(data_fpath, data_accessor, data_callback);
}



main();
