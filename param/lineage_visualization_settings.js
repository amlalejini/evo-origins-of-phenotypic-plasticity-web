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
    "update_label_interval": 1000,
    "max_reps": 50
  },
  "io-sense-cycle-50": {
    "hr_name": "Short Environment Cycle Length",
    "sliced_ranges": [[0, 1000], [47500, 52500], [95000, 100000]],
    "full_ranges": [[0, 100000]],
    "environment_cycle_length": 50,
    "maximum_update": 100000,
    "environment_codes": ["nandpnotm", "nandmnotp"],
    "update_label_interval": 1000,
    "max_reps": 50

  },
  "io-sense-cycle-200": {
    "hr_name": "Long Environment Cycle Length Treatment",
    "sliced_ranges": [[0, 1000], [47500, 52500], [95000, 100000]],
    "full_ranges": [[0, 100000]],
    "environment_cycle_length": 200,
    "maximum_update": 100000,
    "environment_codes": ["nandpnotm", "nandmnotp"],
    "update_label_interval": 1000,
    "max_reps": 50
  },
  "io-sense-mut": {
    "hr_name": "Low Mutation Rate Treatment",
    "sliced_ranges": [[0, 1000], [47500, 52500], [95000, 100000]],
    "full_ranges": [[0, 100000]],
    "environment_cycle_length": 100,
    "maximum_update": 100000,
    "environment_codes": ["nandpnotm", "nandmnotp"],
    "update_label_interval": 1000,
    "max_reps": 50
  },
  "io-sense-mut-high": {
    "hr_name": "High Mutation Rate Treatment",
    "sliced_ranges": [[0, 1000], [47500, 52500], [95000, 100000]],
    "full_ranges": [[0, 100000]],
    "environment_cycle_length": 100,
    "maximum_update": 100000,
    "environment_codes": ["nandpnotm", "nandmnotp"],
    "update_label_interval": 1000,
    "max_reps": 50
  },
  "io-sense-only": {
    "hr_name": "Baseline Treatment",
    "sliced_ranges": [[0, 1000], [47500, 52500], [95000, 100000]],
    "full_ranges": [[0, 100000]],
    "environment_cycle_length": 100,
    "maximum_update": 100000,
    "environment_codes": ["nandpnotm", "nandmnotp"],
    "update_label_interval": 1000,
    "max_reps": 50
  }
};


lookup_table = {
  "nandpnotp": "CONTROL-ENV",
  "nandpnotm": "ENV-NAND",
  "nandmnotp": "ENV-NOT",
  "tasks_performed": {
    "C0000": {"ENV-NAND": "NONE", "ENV-NOT": "NONE"},
    "C0001": {"ENV-NAND": "NONE", "ENV-NOT": "NOT"},
    "C0010": {"ENV-NAND": "NONE", "ENV-NOT": "NAND"},
    "C0011": {"ENV-NAND": "NONE", "ENV-NOT": "BOTH"},
    "C0100": {"ENV-NAND": "NOT", "ENV-NOT": "NONE"},
    "C0101": {"ENV-NAND": "NOT", "ENV-NOT": "NOT"},
    "C0110": {"ENV-NAND": "NOT", "ENV-NOT": "NAND"},
    "C0111": {"ENV-NAND": "NOT", "ENV-NOT": "BOTH"},
    "C1000": {"ENV-NAND": "NAND", "ENV-NOT": "NONE"},
    "C1001": {"ENV-NAND": "NAND", "ENV-NOT": "NOT"},
    "C1010": {"ENV-NAND": "NAND", "ENV-NOT": "NAND"},
    "C1011": {"ENV-NAND": "NAND", "ENV-NOT": "BOTH"},
    "C1100": {"ENV-NAND": "BOTH", "ENV-NOT": "NONE"},
    "C1101": {"ENV-NAND": "BOTH", "ENV-NOT": "NOT"},
    "C1110": {"ENV-NAND": "BOTH", "ENV-NOT": "NAND"},
    "C1111": {"ENV-NAND": "BOTH", "ENV-NOT": "BOTH"}
  }
};
