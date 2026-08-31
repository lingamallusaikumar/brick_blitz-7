#!/usr/bin/env python3
"""
Brick Blitz - Level Dataset Validator (Python 3.10+)
Performs structural integrity and playability sanity checks on levels.
"""

import json
from pathlib import Path

def validate_levels_file(filepath: Path) -> bool:
    if not filepath.exists():
        print(f"Error: Level dataset file {filepath} not found.")
        return False

    with open(filepath, "r", encoding="utf-8") as f:
        levels = json.load(f)

    print(f"Validating {len(levels)} levels in {filepath.name}...")
    errors = 0

    for idx, lvl in enumerate(levels):
        lid = lvl.get("levelId")
        grid = lvl.get("grid", [])
        rows = lvl.get("rows")
        cols = lvl.get("cols")

        if not lid or not grid:
            print(f"[{idx}] Missing levelId or grid matrix.")
            errors += 1
            continue

        if len(grid) != rows:
            print(f"[Level {lid}] Grid row count mismatch: expected {rows}, got {len(grid)}.")
            errors += 1

        # Check breakable brick presence
        breakable = 0
        for r in grid:
            for c in r:
                if c in (1, 2, 4, 5): # Normal, Strong, Explosive, Moving
                    breakable += 1

        if breakable == 0:
            print(f"[Level {lid}] No breakable bricks found! Level cannot be completed.")
            errors += 1

    if errors == 0:
        print("[SUCCESS] Level Dataset Validation Passed Successfully! All levels are playable.")
        return True
    else:
        print(f"[FAILED] Validation Failed with {errors} error(s).")
        return False

if __name__ == "__main__":
    dataset_path = Path(__file__).parent / "generated_levels" / "levels_dataset.json"
    if not dataset_path.exists():
        # Trigger generator if missing
        import level_generator
        level_generator.main()

    validate_levels_file(dataset_path)
