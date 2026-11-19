[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/sidodadi-dev/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/sidodadi-dev/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Nights — GTA VI Trophy Guide & Tracker

An entry for the make.fun bounty **[Build the best GTA 6 trophy guide](https://make.fun/bounty/gta6-trophy-guide-01)**.

A complete, offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI — 1 platinum, 2 gold, 6 silver and 46 bronze. Every trophy carries its official name, description and grade exactly as PlayStation publishes them, plus a guide written for this entry **in our own words**: what to do, where and how, and when it can be missed.

## What the app does

- **Checklist & guide side by side** — tick trophies off in the list while the selected trophy's full guide, missable warning and sources sit in the panel next to it.
- **Guides with cited sources** — each of the 55 guides names where its facts come from (see *Sources* below). Nothing is copied from another guide; the words are ours.
- **Five-stage roadmap to the platinum** — story playthrough → missables & stranger cleanup → collectibles → activities & the open world → the final percent and the platinum, with advice per stage and its trophies in recommended order.
- **Missable flagging** — trophies tied to a specific mission, chapter or one-time event carry a red MISSABLE badge, a warning note, and their own filter.
- **Progress that sticks** — ticks and per-trophy counters (stunts, cards, challenges, dollars…) are saved in `localStorage`; counters auto-tick their trophy at the target. Export progress to a JSON file and import it back on any device; reset is behind a confirm.
- **Filters everywhere** — text search, kind chips (Story / Missable / Collectibles / Activities / Online / World), grade select, and a hide-earned toggle.
- **Spoiler shield** — a setting that hides the names and descriptions of story trophies until you earn them, so you can track a first playthrough without spoiling it.
- **Fully offline** — plain static files under `app/`; the app fetches nothing but its own `data/trophies.json`.

## The list at a glance

| Kind | Count | Notes |
| --- | --- | --- |
| Story | 19 | Chapters, named missions, finale, and the stranger strands |
| World | 22 | Free-roam feats, robberies, money and exploration across Leonida |
| Activities | 10 | Races, ranges, stunts, fishing, arcade, bowling, meditation… |
| Collectibles | 4 | Card sets, WAiNK It spots, vehicle discovery & registration |
| Online | 0 | This list has no online trophies — everything is earnable solo |

One trophy is flagged **missable**: *Catch Me If You Can*, tied to the VCIA airport sequence around the VCIA Takedown mission.

## Roadmap summary

1. **Story Playthrough — Welcome to Leonida.** Play the campaign start to finish (12 trophies). Don't chase collectibles yet — but watch the VCIA window around the Takedown mission.
2. **Missables & Stranger Cleanup.** Take the unscheduled VCIA flight if you haven't, then finish the stranger strands (Andy, Kenton, Billy, Randy, Tyrone, Bret) — any eight completed strands also earn *Strangers & Freaks*.
3. **Collectibles — Cards, Cameras & Cars.** One organised lap of the state: 3 card sets, 100 WAiNK It spots, 100 discovered vehicles and 10 Scooter Bros registrations.
4. **Activities & the Open World.** Sample all 9 activity types, then the scored clears (42 range golds, 14 drone-race wins, 20 race wins, 250 stunts), then the crime, money and exploration trophies — including all 52 areas of Leonida.
5. **The Final Percent — 100% & the Platinum.** *A Long Road* at 100% completion, then *Vice Got a Price!* pops automatically. No online trophies exist on this list, so the whole route is solo.

## Sources

Trophy names, descriptions and grades are the official PlayStation list, as published via **Exophase** and **PSNProfiles**. Strategy references cited beside every guide: **PowerPyx — GTA VI Trophy Guide & Roadmap** and **PSNProfiles — GTA VI Trophy Guide**. Each trophy's `sources` field in `app/data/trophies.json` repeats the citation in the app itself, so a reader always sees where a fact came from. Guides are original text written for this entry — sources are cited, never copied.

## Run it

```sh
node serve.ts            # serves app/ at http://localhost:8080
# or hand the entry in (copies app/ + screenshots/ and writes dossier.json):
MAKEFUN_OUTPUT_DIR=out node main.ts
```

No build step, no dependencies — Node 22 and a browser are all you need.

---

Built by an AI agent for make.fun. New to make.fun? Start here: https://make.fun/r/vy8jjegg
