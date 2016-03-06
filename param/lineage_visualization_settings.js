var zoom_rate = 0.05;
var default_treatment = "io-sense-only";
var lineage_vis_data_fpath = "data/lineage_states.csv";
var lineage_vis_settings =
{
  "io-sense-control": {
    "hr_name": "Control",
    "sliced_ranges": [[0, 1000], [47500, 52500], [95000, 100000]],
    "full_ranges": [[0, 100000]],
    "environment_cycle_length": 100000,
    "maximum_update": 100000,
    "environment_codes": ["nandpnotp"],
    "update_label_interval": 500,
    "max_reps": 50
  },
  "io-sense-cycle-50": {
    "hr_name": "Short Environment Cycle Length",
    "sliced_ranges": [[0, 1000], [47500, 52500], [95000, 100000]],
    "full_ranges": [[0, 100000]],
    "environment_cycle_length": 50,
    "maximum_update": 100000,
    "environment_codes": ["nandpnotm", "nandmnotp"],
    "update_label_interval": 500,
    "max_reps": 50

  },
  "io-sense-cycle-200": {
    "hr_name": "Long Environment Cycle Length Treatment",
    "sliced_ranges": [[0, 1000], [47500, 52500], [95000, 100000]],
    "full_ranges": [[0, 100000]],
    "environment_cycle_length": 200,
    "maximum_update": 100000,
    "environment_codes": ["nandpnotm", "nandmnotp"],
    "update_label_interval": 500,
    "max_reps": 50
  },
  "io-sense-mut": {
    "hr_name": "Low Mutation Rate Treatment",
    "sliced_ranges": [[0, 1000], [47500, 52500], [95000, 100000]],
    "full_ranges": [[0, 100000]],
    "environment_cycle_length": 100,
    "maximum_update": 100000,
    "environment_codes": ["nandpnotm", "nandmnotp"],
    "update_label_interval": 500,
    "max_reps": 50
  },
  "io-sense-mut-high": {
    "hr_name": "High Mutation Rate Treatment",
    "sliced_ranges": [[0, 1000], [47500, 52500], [95000, 100000]],
    "full_ranges": [[0, 100000]],
    "environment_cycle_length": 100,
    "maximum_update": 100000,
    "environment_codes": ["nandpnotm", "nandmnotp"],
    "update_label_interval": 500,
    "max_reps": 50
  },
  "io-sense-only": {
    "hr_name": "Baseline Treatment",
    "sliced_ranges": [[0, 1000], [47500, 52500], [95000, 100000]],
    "full_ranges": [[0, 100000]],
    "environment_cycle_length": 100,
    "maximum_update": 100000,
    "environment_codes": ["nandpnotm", "nandmnotp"],
    "update_label_interval": 500,
    "max_reps": 50
  }
};
