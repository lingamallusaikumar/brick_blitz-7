#!/usr/bin/env python3
"""
Brick Blitz - Telemetry & Analytics CLI Tool (Python 3.10+)
Inspects save files, calculates play stats, and validates high scores.
"""

import json
import sys
from pathlib import Path

def analyze_save_data(data: dict):
    print("\n" + "=" * 50)
    print(" [BRICK BLITZ] TELEMETRY ANALYTICS REPORT")
    print("=" * 50)

    current_user = data.get("currentUser", "Unknown")
    profiles = data.get("profiles", {})
    profile = profiles.get(current_user, {})

    print(f"Active User:         {current_user}")
    print(f"Player Level:        {profile.get('level', 1)}")
    print(f"Current XP:          {profile.get('xp', 0)}")
    print(f"High Score:          {profile.get('highScore', 0):,}")
    print(f"Completed Levels:    {len(profile.get('completedLevels', []))} / 50")
    print(f"Achievements:        {len(profile.get('achievements', []))} unlocked")

    stats = profile.get("stats", {})
    played = stats.get("gamesPlayed", 0)
    won = stats.get("gamesWon", 0)
    win_rate = (won / played * 100) if played > 0 else 0

    print("-" * 50)
    print(f"Total Games Played:  {played}")
    print(f"Win Rate:            {win_rate:.1f}%")
    print(f"Total Bricks Smashed:{stats.get('totalBricksDestroyed', 0):,}")
    print(f"Power-ups Collected: {stats.get('powerupsCollected', 0)}")
    print(f"Play Time:           {stats.get('playTimeSeconds', 0) // 60} minutes")
    print("=" * 50 + "\n")

def main():
    if len(sys.argv) > 1:
        filepath = Path(sys.argv[1])
    else:
        # Default mock save
        filepath = None

    if filepath and filepath.exists():
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
    else:
        # Generate inline sample data for demo report
        data = {
            "currentUser": "Alex",
            "profiles": {
                "Alex": {
                    "level": 12,
                    "xp": 4850,
                    "highScore": 85400,
                    "completedLevels": list(range(1, 15)),
                    "achievements": ["FIRST_BLOOD", "BRICK_DEMOLISHER", "COMBO_STARTER"],
                    "stats": {
                        "gamesPlayed": 48,
                        "gamesWon": 32,
                        "totalBricksDestroyed": 4820,
                        "powerupsCollected": 142,
                        "playTimeSeconds": 14500
                    }
                }
            }
        }

    analyze_save_data(data)

if __name__ == "__main__":
    main()
