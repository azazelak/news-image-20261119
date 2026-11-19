# BUILD_LOG — news-image-20261119

Built 2026-11-19 in the side chat opened by the user's first message
`buat news image 19 november dan submit` (prompt file
`~/workspace/makefun/news-image-20261119-prompt.txt`). Builder session only;
no push, bundle or submit done here — parent verifies, pushes, submits.

## Kit facts

- Competition: `news-image-20261119` — "Sum up 19 November's world news
  in one image". Opens 2026-11-19T00:00:00Z, deadline **2026-11-21T00:00:00Z**.
- Prize: **$250** total, top 50 paid: 1st $50, 2nd $30, 3rd $15, 4th–10th $5,
  11th–50th $3. Final heat: 3 Swiss rounds + playoff of top 52; AI judge
  (z-ai/glm-5.3-flash) compares images pairwise, no news feed, criteria in
  order: (1) names the day + specific events of that day (not before
  13 Nov 2026), (2) selection/breadth across regions and fields, (3) reads
  from the image alone, (4) faithful, no hype/speculation as fact,
  (5) craft, legible at ~300 px across.
- Output: program writes ONE image to `/output/entry.png` — PNG or JPEG,
  at most 1 MiB, at most 1024x1024. Program: Node 22 `main.ts` (or Python
  3.13), stdlib only, no network, runs twice, both runs byte-identical.
  60 s, 1 CPU, 512 MB.
- Submission limits: at most 10/day and 20 total (Force_Last: last
  submission before deadline is final). No `min_authored_coverage`
  (0 in kit); transcript gate still applies (thinking_reproduces ≥30%,
  run record with the user's opening prompt as first message).
- Kit: downloaded 2026-11-19 from `https://make.fun/c/news-image-20261119/kit`
  into `~/workspace/makefun/news-image-20261119-kit/`; tar inspected before
  extract (kit.json, RULES.txt, competition.yaml, cli, harness, starter).
  bundle_sha256 `1c4dd40eb938ebfa7f4fbd5e446756910e170eb9057e3e0284b53e5f329fd11d`.
  Starter is a placeholder (pixel-art globe + newspaper, shows no day's
  news); nothing copied from it — `main.ts` is written fresh here.
- Quota (checked 2026-11-19 ~08:10 WIB via existing tiny-chess kit CLI,
  `status --competition news-image-20261119 --json`): **can_submit true**,
  entries_made 0, day cap **3** (account tier), taken 0, left 3, resets
  2026-11-20T00:00:00Z; hard limit 20, left 20. Competition already has
  6,498 submissions (live API) — top-50 paid line is crowded.
- No `makefun init` run: this is a GitHub-repo entry (as with token-radar /
  gcc), init is the source-bundle route. Repo carries `.makefun/owner.json`
  with wallet `oG9zsFymWdLqgHvqLD1t4fTdnGCWLkhmTYBFR9gP5d4` (derived from
  `~/workspace/makefun/makefun-keypair.json`, verified by re-deriving the
  base58 address from the keypair).

## Stories chosen (all reporting dated 19 Nov 2026)

1. **Lead — Trump, Xi, Putin first three-way summit, Shenzhen (APEC).**
   First time the three leaders have met together; agenda Ukraine, Iran,
   nuclear arms, AI/trade; Kremlin set aside one hour. Sources: BBC
   ("Trump, Xi and Putin set to hold historic meeting on APEC sidelines",
   19 Nov 2026), Reuters ("Putin, Trump to meet at APEC summit but no
   full-scale talks planned, Kremlin says", 18–19 Nov), CBS/Japan Times
   via OneTurn daily roundup 19 Nov.
2. **ICJ rules on the Rohingya genocide case (The Hague).** Judgment due
   10:00, 19 Nov, in Gambia v Myanmar over the 2017 crackdown that drove
   700,000+ Rohingya to Bangladesh; the court has never before found a
   state guilty of genocide. Sources: ICJ announcement via BBC/Guardian
   previews, JusticeInfo ("On 19 November the ICJ will be ruling…",
   18 Nov).
3. **Crimean Bridge hit a third time in a week.** Attack overnight into
   19 Nov, traffic suspended, damage assessed (confirmed by
   Russian-installed head Sergei Aksyonov); 16–17 Nov strikes had brought
   down part of the road span. Sources: Reuters ("Third attack in a week
   suspends traffic over Crimean Bridge", 19 Nov), BBC via syndication.
4. **Gulf: Iran fires back after the US strike on Qeshm Island.** Iranian
   drones targeted US sites in Kuwait and Bahrain; US jets had hit a
   missile site on Qeshm Island. Sources: Reuters Gulf briefing
   ("Iran says it fired on US drone and missile sites in Kuwait overnight,
   after the US struck Qeshm Island", 19 Nov), Reuters 19 Nov on the
   Houthi missile threat towards Riyadh (folded into the same card's
   context; the card text itself only claims Kuwait/Bahrain/Qeshm).
5. **COP31 ministers race for a deal (Antalya).** Ministers negotiating
   the draft final text (fossil fuels, adaptation finance); summit closes
   Fri 20 Nov. Sources: COP31 presidency draft (16 Nov) + ministerial
   talks through 19 Nov (Horizon daily roundup 19 Nov; Watan News,
   17 Nov, on ministers taking over).
6. **Anthropic's record $81.3bn IPO (New York).** Shares begin trading on
   the Nasdaq as ANT on Thu 19 Nov, priced at $83 (above the $70–78
   range), valuing the AI firm at about $1.5 trillion — largest IPO on
   record, ahead of SpaceX's $75bn. Sources: Reuters via BusinessWorld
   ("Anthropic clinches biggest IPO ever with $81 billion offering",
   19 Nov), PYMNTS ("shares begin trading… Thursday (Nov. 19)", 19 Nov).
7. **Footer ticker:** Indonesia's parliament passes an asset-forfeiture
   law (Reuters, 19 Nov — seizure without a criminal conviction for
   assets ≥ Rp1bn); Australia, Canada, Italy and the UK jointly call on
   Israel to allow aid into flooded Gaza (19 Nov).

Dropped as not cleanly 19 Nov: Van Gogh $190.4m sale (auction Wed 18 Nov),
EU €45bn Ukraine loan (announced Wed 18 Nov), Bangladesh unrest (ongoing
since 10 Nov; lockdown culminating 19 Nov, but the day's facts were less
cleanly sourced than the six above).

## Files written (all fresh in this session)

- `~/workspace/makefun/news-image-20261119/main.ts` (523 lines) — Node 22,
  stdlib only (`node:fs`, `node:path`, `node:zlib`). Pure-JS PNG encoder
  (CRC32 + deflate level 9), embedded 5x7 bitmap font (A–Z, 0–9,
  punctuation), flat vector drawing. No network, no clock, no randomness.
  Self-checks: throws if a headline wraps past 2 lines or a summary past
  3 lines (IPO summary: 2), so no sentence can be silently truncated.
- `README.md` — entry description, story list, run instructions.
- `LICENSE` — MIT, `SPDX-License-Identifier: MIT` as first line, text
  identical to the standard MIT text (copyright `azazelak`).
- `.makefun/owner.json` — `{"wallet": "oG9zsFymWdLqgHvqLD1t4fTdnGCWLkhmTYBFR9gP5d4"}`.
- This `BUILD_LOG.md`.
- Git repo initialised in the entry dir (`git init`, no commit yet —
  parent commits/pushes).

## Verification

- 2x run: `MAKEFUN_OUTPUT_DIR=/tmp/ni-out1 node main.ts` and
  `/tmp/ni-out2` → **byte-identical**, sha256
  `d041742595b000c00fff0265ec784b9b77d1263268ecd5b701d76cbfa658ca05`
  (first version before layout fixes: `9f6432e8…5463`).
- Default path also run (`node main.ts` → `/output/entry.png`), same hash.
- Output: **1024x1024 RGB PNG, 21,901 bytes** (< 1 MiB, ≤1024x1024).
  PNG chunks validated with Python (IHDR/IDAT/IEND, all CRCs ok).
- Kit `check` not run here: it needs the transcripts bundle, which the
  parent creates at submit time.
- Node 22 note: `main.ts` uses no TypeScript-only syntax (plain JS in a
  `.ts` file), so it runs under Node 22 type stripping as well as Node 24
  used locally.

## Visual inspection (actual output image, viewed directly)

- v1 problems found and fixed: (a) Crimea summary wrapped to 4 lines and
  `WEEK.` was silently dropped by the slice — shortened the sentence to
  "TRAFFIC HALTED OVERNIGHT. PART OF THE ROAD SPAN FELL." and added the
  throw-on-overflow self-check; (b) third summary lines in the 2x2 cards
  touched the card bottom border — cards raised 184→186 px and summary
  moved to y+112; (c) IPO summary would have touched the band border —
  band raised to 116 px, footer moved to y952.
- v2 (hash `d0417425…`) inspected at full size and at 2x crops of the ICJ
  and Crimea cards: masthead + date legible; lead headline 3 lines, flags
  (US/China/Russia) + globe + skyline clean; all six stories complete,
  no overlap, no cut-off text, no placeholder text; footer ticker legible.
  Remaining cosmetic notes: the flame icon is a plain triangle (stylised),
  the bridge icon's arch reads slightly dome-like; both are clean
  geometric marks, not smears.

## Remaining risks

- Judge is a VLM with no news feed: it judges from the image + its own
  knowledge. The Shenzhen summit and ICJ ruling were scheduled for 19 Nov
  and are stated in daily-paper present tense; if either had slipped, the
  image would read as wrong — both were confirmed as the day's top stories
  by multiple outlets on the morning of 19 Nov.
- 6,498 submissions already; the top-50 line is decided by pairwise judge
  wins, so the provisional dev rate (vs house images) will be the real
  signal — check it after submit.
- Body text is ~21 px tall at 1024 px, so at a 300 px thumbnail only the
  headlines are readable; that matches the judge's craft criterion
  (headlines carry each story) but a denser-text rival could out-read it
  at thumbnail size.
