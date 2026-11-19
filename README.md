# Leonida Trophy Guide — GTA VI

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/tidy-marten-51/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/tidy-marten-51/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![make.fun bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for all **55 trophies of Grand Theft Auto VI** on PlayStation 5 (1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden, 0 online). Built for the [make.fun GTA 6 trophy guide bounty](https://make.fun/bounty/gta6-trophy-guide-01).

## What it is

- **Every trophy, exactly as PlayStation lists it** — official name, description and grade for all 55, plus a guide in our own words for each one that cites its sources (Exophase, PowerPyx, PSNProfiles and other launch-week guides) and says plainly where a step was still unconfirmed at launch.
- **A tracker** — tick trophies off and your progress is saved in the browser (localStorage), with export to a JSON file and import back. Filters by grade and kind, text search, earned-only / hide-earned views.
- **A spoiler setting** — hides story trophies' names, descriptions and guides until they are earned.
- **A roadmap to the platinum** — six stages built from the official descriptions (story chapters and missions, side-character strands, activities, collectibles and counts, in order), rated about 200 hours at 4/10 by PowerPyx.
- **Missable trophies flagged** — one trophy is reported as potentially missable (Positive Mental Attitude, the Chapter 1 balcony meditation), with the save habits that protect a run.
- **Fully offline** — static files under `app/`, no build step, no network requests at runtime, no external fonts or images, no Rockstar logo or artwork. The look is our own CSS-only design.

## How to run it

```sh
node serve.ts
```

Then open http://localhost:8080. Or serve `app/` with any static file server and open `app/index.html`.

## How to hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored `vendor/makefun-frontend.ts` library.

## Screenshots

`screenshots/` holds three real renders of the app in a browser (1280×800 JPEG): the checklist with progress seeded, a trophy detail view with its guide and sources, and the roadmap to the platinum.

## Sources

Trophy names, descriptions and grades: Exophase and PSNProfiles. Roadmap and missable guidance: PowerPyx's GTA 6 Trophy Guide & Roadmap, with launch-week lists from EGamers, GTA Zone and OutputLag. Every trophy's guide in `app/data/trophies.json` names the sources it draws on.
