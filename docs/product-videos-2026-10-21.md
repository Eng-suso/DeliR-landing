# Product videos — Problem → Agitate → Solve

The product section (`#caso`) replaces the wall of 17 clips with six short videos and one optional walkthrough. Visitors are not asked to watch a course in order: each video stands on its own, and the Solve steps are a tab list so a consultant can go straight to the step they care about, then join the waitlist.

| Section | Video | Length | What it shows (product only) |
| --- | --- | --- | --- |
| 01 Problem | `problem` | 40 s | The client's three interviews and their raw transcripts |
| 02 Agitate | `agitate` | 40 s | The blocking question nobody answers, who-does-what that people don't know, the measured wait at approval |
| 03 Solve | `discovery` | ~46 s | Statements with verified quotes → asking DeliR to rebuild the process → open question |
| 03 Solve | `evidence` | 49 s | As-Is in BPMN 2.0 (2 lanes, 5 activities) → evidence 100% → quote per element → version history |
| 03 Solve | `simulation` | ~59 s | As-Is replay with the whole process and six moving KPIs → heatmap → To-Be replay |
| 03 Solve | `results` | ~41 s | As-Is / To-Be comparison → handover checks → read-only process-owner dashboard |
| Optional | `walkthrough` | see file | Every product scene in full, in one recording |

## Source and editing rules

All videos are cut from the same recordings of the demo case in BK-GPT (`npm run media:landing`, see `docs/launch/landing-videos.md` there). Editing rules requested for the landing:

- the product is always visible in full (no crop), slow, real-time speed;
- a label in Italian **and** English always says what is happening, outside the interface;
- one light zoom only while typing in the chat;
- no bpmn.io watermark on screen;
- the simulation shows the whole process with six KPIs moving.

Company, people and values are fictional/simulated and the frame says so.

## Files

`public/product-videos/<id>.{mp4,webm,jpg,it.vtt,en.vtt}`. From BK-GPT `artifacts/landing-videos/web/`:

| BK-GPT cut | Landing id |
| --- | --- |
| `01-problem` | `problem` |
| `02-agitate` | `agitate` |
| `03-discovery` | `discovery` |
| `04-evidence` | `evidence` |
| `05-simulation` | `simulation` |
| `06-results` | `results` |
| `walkthrough` | `walkthrough` |

Durations in `src/content/productVideos.ts` must match the files (`ffprobe`). Text alternatives for each video are in the same file.

## Behaviour

- Posters only; a video downloads when the visitor presses play (no autoplay, Save-Data friendly).
- Captions IT/EN from the same labels; native controls.
- Deep links: `#discovery`, `#evidence`, `#simulation`, `#results`. Earlier `#product-*` and `#scene-*` links open the matching step.
- Measurement (only with analytics consent): `video_play` and `video_complete` with the allowlisted `video_id`. With `interest_cta_clicked` in the same session this shows which step precedes a waitlist request.
