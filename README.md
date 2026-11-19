# World News — 19 November 2026, in one image

[![make.fun · news-image-20261119](https://make.fun/badge/news-image-20261119.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![rank](https://make.fun/badge/news-image-20261119/azazelak/news-image-20261119/rank.svg)](https://make.fun/bounty/news-image-20261119/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![reward](https://make.fun/badge/news-image-20261119/azazelak/news-image-20261119/reward.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)

A make.fun entry for `news-image-20261119`: a program that writes one
image summing up the world's news of Thursday 19 November 2026 to
`/output/entry.png`. Version 2 is a full rewrite of the v1 entry (which
scored a dev judge rate of 0.970769, about rank 2,467 of 5,437 — far below
the top-50 paid line of 0.987432 — with only six stories). v2 carries
**19 stories plus two footer items**, across five continents and many
fields, each researched from reporting dated 19 November 2026.

## What the image shows

A newspaper front page, 1024 x 1024, with the date in the masthead, a
lead story, and a 3 x 6 grid of short story cells (tag, two-line headline,
one-line summary, source):

- **Lead — Shenzhen:** Trump, Xi and Putin hold their first three-way
  summit, on the APEC sidelines; Ukraine, Iran and nuclear arms are on the
  agenda. (BBC, Reuters, CBS)
- **The Hague:** the International Court of Justice rules in Gambia v
  Myanmar on whether the 2017 crackdown on the Rohingya was genocide.
  (ICJ)
- **Kerch:** the Crimean Bridge is hit a third time in a week. (Reuters)
- **The Gulf:** Iran fires back at US sites after the US strike on Qeshm
  Island. (Reuters)
- **Antalya:** COP31 ministers race for the draft final text. (UNFCCC)
- **New York:** Anthropic's record $81.3bn IPO trades as ANT at $83.
  (Reuters, CNBC)
- **Culture:** Grand Theft Auto VI launches on PS5 and Xbox. (USA Today,
  Le Monde)
- **Yongbyon:** the IAEA says North Korea is expanding its uranium
  enrichment plant. (IAEA, Reuters, AP)
- **Fiji:** a national disaster is declared over the El Nino drought.
  (Reuters)
- **Pakistan:** 22 militants killed in raids near the Afghan border. (AP)
- **Java:** a refinery blast in Cepu kills one worker. (Reuters)
- **Senegal:** a migrant boat capsizes off Dakar; dozens missing.
  (Reuters)
- **Shenzhen:** Trump raises ex-Nvidia boss Huang with Xi, briefly.
  (Reuters)
- **London:** the UK sends Ukraine 1,000 long-range drones in a £260m
  package. (BBC)
- **Uganda:** landslide survivors seek justice at the UN. (BBC)
- **Odisha:** 80,000 evacuated as Cyclone Akvan nears. (IMD)
- **Odesa:** three strikes on the historic centre kill four, hurt 13.
  (Euronews, Reuters)
- **Sport:** Ash Barty is honoured with the Tennis Hall of Fame. (BBC)
- **Climate:** an IPCC report delay threatens the climate effort.
  (The Guardian)

Footer ticker: Indonesia's parliament passes an asset-forfeiture law, and
Australia, Canada, Italy and the UK jointly urge aid access to flooded
Gaza. Full citations are in `BUILD_LOG.md`.

## How it is drawn

`main.ts` (Node 22, standard library only, no network) renders the image
procedurally: a pure-JS PNG encoder (`node:zlib` deflate, hand-rolled
CRC32), an embedded 5x7 bitmap font, and flat vector drawing — masthead,
three flags and a globe for the lead story, and a colour-coded cell per
story. Every fact is data inside `main.ts`, so the program is fully
deterministic: no clock, no randomness, no file reads besides its own code.

The program also self-checks its layout: it throws if the lead headline
wraps past two lines, the lead summary past two, any cell headline past
two lines, or any cell summary past one line, so a truncated sentence can
never ship silently.

## Run

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
# writes out/entry.png — 1024 x 1024 RGB PNG
```

Two runs to different directories produce byte-identical output.

## License

MIT — see `LICENSE`.
