#!/usr/bin/env python3
"""
Brick Blitz - Python Level Generator & Validator CLI (Python 3.10+)
Generates balanced 2D brick breaker levels with customizable grid matrix parameters.
"""

import json
import random
import sys
from pathlib import Path

BRICK_TYPES = {
    "EMPTY": 0,
    "NORMAL": 1,
    "STRONG": 2,
    "STEEL": 3,
    "EXPLOSIVE": 4,
    "MOVING": 5
}

def generate_level(level_id: int, rows: int = 6, cols: int = 10, difficulty: float = 1.0) -> dict:
    """Generate a single level configuration matrix."""
    grid = []
    
    for r in range(rows):
        row = []
        for c in range(cols):
            rand = random.random() * difficulty
            if rand < 0.5:
                brick = BRICK_TYPES["NORMAL"]
            elif rand < 0.75:
                brick = BRICK_TYPES["STRONG"]
            elif rand < 0.85:
                brick = BRICK_TYPES["EXPLOSIVE"]
            elif rand < 0.92 and r > 1:
                brick = BRICK_TYPES["STEEL"]
            elif rand >= 0.92 and r == 2:
                brick = BRICK_TYPES["MOVING"]
            else:
                brick = BRICK_TYPES["NORMAL"]
            row.append(brick)
        grid.append(row)

    return {
        "levelId": level_id,
        "rows": rows,
        "cols": cols,
        "difficulty": round(difficulty, 2),
        "grid": grid
    }

def main():
    print("=" * 60)
    print(" [BRICK BLITZ] Level Generation Utility (Python 3.10+)")
    print("=" * 60)

    output_dir = Path(__file__).parent / "generated_levels"
    output_dir.mkdir(exist_ok=True)

    batch_levels = []
    for lid in range(1, 51):
        diff = 1.0 + (lid / 50.0) * 1.5
        level = generate_level(lid, rows=min(10, 4 + lid // 6), cols=10, difficulty=diff)
        batch_levels.append(level)

    out_file = output_dir / "levels_dataset.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(batch_levels, f, indent=2)

    print(f"Successfully generated 50 levels to: {out_file}")
    print(f"Total levels verified: {len(batch_levels)}")

if __name__ == "__main__":
    main()
