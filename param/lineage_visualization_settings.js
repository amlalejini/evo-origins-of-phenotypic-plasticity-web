var default_treatment = "baseline";
var lineage_vis_settings =
{
  "control": {
    "hr_name": "Control",
    "data_file": "io-sense-control-treatment_lineages_states.csv",
    "show_ranges": [[0, 1000], [47500, 52500], [95000, 100000]],
    "environment_cycle_length": 100000,
    "maximum_update": 100000,
    "environment_codes": ["nandpnotp"],
    "update_label_interval": 500,
    "max_reps": 50
  },
  "short_environment_cycle": {
    "hr_name": "Short Environment Cycle Length Treatment",
    "data_file": "io-sense-cycle-50-treatment_lineages_states.csv",
    "show_ranges": [[0, 1000], [47500, 52500], [95000, 100000]],
    "environment_cycle_length": 50,
    "maximum_update": 100000,
    "environment_codes": ["nandpnotm", "nandmnotp"],
    "update_label_interval": 500,
    "max_reps": 50

  },
  "long_environment_cycle": {
    "hr_name": "Long Environment Cycle Length Treatment",
    "data_file": "io-sense-cycle-200-treatment_lineages_states.csv",
    "show_ranges": [[0, 1000], [47500, 52500], [95000, 100000]],
    "environment_cycle_length": 200,
    "maximum_update": 100000,
    "environment_codes": ["nandpnotm", "nandmnotp"],
    "update_label_interval": 500,
    "max_reps": 50
  },
  "low_mut": {
    "hr_name": "Low Mutation Rate Treatment",
    "data_file": "io-sense-mut-treatment_lineages_states.csv",
    "show_ranges": [[0, 1000], [47500, 52500], [95000, 100000]],
    "environment_cycle_length": 100,
    "maximum_update": 100000,
    "environment_codes": ["nandpnotm", "nandmnotp"],
    "update_label_interval": 500,
    "max_reps": 50
  },
  "high_mut": {
    "hr_name": "High Mutation Rate Treatment",
    "data_file": "io-sense-mut-high-treatment_lineages_states.csv",
    "show_ranges": [[0, 1000], [47500, 52500], [95000, 100000]],
    "environment_cycle_length": 100,
    "maximum_update": 100000,
    "environment_codes": ["nandpnotm", "nandmnotp"],
    "update_label_interval": 500,
    "max_reps": 50
  },
  "baseline": {
    "hr_name": "Baseline Treatment",
    "data_file": "io-sense-only-treatment_lineages_states.csv",
    "show_ranges": [[0, 1000], [47500, 52500], [95000, 100000]],
    "environment_cycle_length": 100,
    "maximum_update": 100000,
    "environment_codes": ["nandpnotm", "nandmnotp"],
    "update_label_interval": 500,
    "max_reps": 50
  }
};
