# World News — 19 November 2026, in one image

[![make.fun · news-image-20261119](https://make.fun/badge/news-image-20261119.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![rank](https://make.fun/badge/news-image-20261119/azazelak/news-image-20261119/rank.svg)](https://make.fun/bounty/news-image-20261119/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![reward](https://make.fun/badge/news-image-20261119/azazelak/news-image-20261119/reward.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)

A make.fun entry for `news-image-20261119`: a program that writes one
image summing up the world's news of Thursday 19 November 2026 to
`/output/entry.png`.

## What the image shows

A newspaper front page, 1024 x 1024, with the date in the masthead and six
stories researched from reporting dated 19 November 2026:

1. **Lead — Shenzhen:** Trump, Xi and Putin hold their first three-way
   summit, on the APEC sidelines. Ukraine, Iran, nuclear arms and AI are on
   the agenda. (BBC, Reuters, CBS)
2. **The Hague:** the International Court of Justice rules in Gambia v
   Myanmar on whether the 2017 crackdown on the Rohingya was genocide.
   (ICJ)
3. **Kerch:** the Crimean Bridge is hit a third time in a week; traffic is
   suspended overnight and part of the road span fell earlier in the week.
   (Reuters, BBC)
4. **The Gulf:** Iran fires drones at US sites in Kuwait and Bahrain after
   US jets strike a missile site on Qeshm Island. (Reuters)
5. **Antalya:** COP31 ministers negotiate the draft final text; fossil
   fuels and adaptation finance divide them. (UN climate talks)
6. **New York:** Anthropic begins trading on the Nasdaq as ANT after a
   record $81.3bn IPO priced at $83, valuing the firm at about
   $1.5 trillion. (Reuters, CNBC)

Footer ticker: Indonesia's parliament passes an asset-forfeiture law, and
Australia, Canada, Italy and the UK jointly urge aid access to flooded
Gaza. Full citations are in `BUILD_LOG.md`.

## How it is drawn

`main.ts` (Node 22, standard library only, no network) renders the image
procedurally: a pure-JS PNG encoder (`node:zlib` deflate, hand-rolled CRC32),
an embedded 5x7 bitmap font, and flat vector drawing — masthead, three
flags and a globe for the lead story, and a small icon per story (scales of
justice, bridge, flame, sun, rising chart). Every fact is data inside
`main.ts`, so the program is fully deterministic: no clock, no randomness,
no file reads besides its own code.

The program also self-checks its layout: it throws if any headline wraps
past two lines or any summary past three (or the IPO summary past two), so
a truncated sentence can never ship silently.

## Run

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
# writes out/entry.png — 1024 x 1024 RGB PNG, ~22 KB
```

Two runs to different directories produce byte-identical output
(sha256 `d041742595b000c00fff0265ec784b9b77d1263268ecd5b701d76cbfa658ca05`).

## License

MIT — see `LICENSE`.
