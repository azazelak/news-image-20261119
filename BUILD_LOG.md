# BUILD_LOG — news-image-20261119, v2 (full rewrite)

Built 2026-11-19 in this builder session. v2 is a full rewrite of the v1
entry in the same repository (GitHub HEAD at build start: `3f7c58a`,
master). v1 was submitted and scored: dev judge rate **0.970769**
(12W-0L, provisional), about rank **2,467 of 5,437**, far below the
top-50 paid cutoff 0.987432. v1 carried only 6 stories; top rivals pack
19–43. v2 carries **19 stories + 2 footer items**. No push, bundle or
submit done here — parent verifies, pushes, submits.

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
- Kit: `~/workspace/makefun/news-image-20261119-kit/` (downloaded
  2026-11-19, bundle_sha256
  `1c4dd40eb938ebfa7f4fbd5e446756910e170eb9057e3e0284b53e5f329fd11d`).
  Starter not used; `main.ts` written fresh in this session.
- Quota: v1 used 1 of 10 (submitted 2026-11-19 15:24 WIB, submission
  01a1f2e8-9b74-7507-9367-c5859b2ee724, claim code
  AF-9YKBM-0H57T-VM1YG-NG2TZ); day cap 3, resets 2026-11-20T00:00:00Z.
- Repo carries `.makefun/owner.json` with wallet
  `oG9zsFymWdLqgHvqLD1t4fTdnGCWLkhmTYBFR9gP5d4` (untouched by this build).

## Stories chosen (all reporting dated 19 Nov 2026 unless noted)

1. **Lead — Trump, Xi, Putin first three-way summit, Shenzhen (APEC).**
   First time the three leaders have met together; agenda Ukraine, Iran,
   nuclear arms, AI/trade; Kremlin set aside one hour. Sources: BBC
   ("Trump, Xi and Putin set to hold historic meeting on APEC sidelines",
   19 Nov 2026), Reuters ("Putin, Trump to meet at APEC summit but no
   full-scale talks planned, Kremlin says", 18–19 Nov), CBS/Japan Times
   via OneTurn daily roundup 19 Nov. (Carried over from v1, re-verified.)
2. **ICJ rules on the Rohingya genocide case (The Hague).** Judgment due
   10:00, 19 Nov, in Gambia v Myanmar over the 2017 crackdown that drove
   700,000+ Rohingya to Bangladesh; the court has never before found a
   state guilty of genocide. Sources: ICJ announcement via BBC/Guardian
   previews, JusticeInfo ("On 19 November the ICJ will be ruling…",
   18 Nov). (v1, re-verified.)
3. **Crimean Bridge hit a third time in a week.** Attack overnight into
   19 Nov, traffic suspended, damage assessed; 16–17 Nov strikes had
   brought down part of the road span. Sources: Reuters ("Third attack
   in a week suspends traffic over Crimean Bridge", 19 Nov), BBC.
   (v1, re-verified.)
4. **Gulf: Iran fires back after the US strike on Qeshm Island.** Iranian
   drones targeted US sites in Kuwait and Bahrain; US jets had hit a
   missile site on Qeshm Island. Sources: Reuters Gulf briefing
   ("Iran says it fired on US drone and missile sites in Kuwait
   overnight, after the US struck Qeshm Island", 19 Nov). (v1, re-verified.)
5. **COP31 ministers race for a deal (Antalya).** Ministers negotiating
   the draft final text (fossil fuels, adaptation finance); summit closes
   Fri 20 Nov. Sources: COP31 presidency draft (16 Nov) + ministerial
   talks through 19 Nov (Horizon daily roundup 19 Nov; Guardian COP31
   live blog 19 Nov). (v1, re-verified.)
6. **Anthropic's record $81.3bn IPO (New York).** Shares begin trading on
   the Nasdaq as ANT on Thu 19 Nov, priced at $83 (above the $70–78
   range), valuing the AI firm at about $1.5 trillion — largest IPO on
   record. Sources: Reuters via BusinessWorld ("Anthropic clinches
   biggest IPO ever with $81 billion offering", 19 Nov), PYMNTS
   ("shares begin trading… Thursday (Nov. 19)", 19 Nov). (v1, re-verified.)
7. **Grand Theft Auto VI launches (worldwide).** Rockstar's game releases
   Thu 19 Nov at midnight local time on PS5 and Xbox Series X|S, rolling
   out from New Zealand; 99 Metacritic from early reviews; presales over
   $1bn, 11m+ copies pre-sold (SensorTower). Sources: USA Today
   ("When is GTA 6 available in the US?", 18–19 Nov), Le Monde
   ("Grand Theft Auto VI earns rave reviews", 19 Nov), Rockstar support
   (midnight local time, 19 Nov). Verified real for 19 Nov — the rival
   title "GTA VI day" was correct.
8. **North Korea expands Yongbyon enrichment plant.** IAEA chief Rafael
   Grossi tells the Board of Governors (18 Nov, reported 19 Nov) that an
   extension to the original Yongbyon uranium enrichment facility has
   been under construction since mid-September and was externally
   complete by late October; "a cause for serious concern". Sources:
   Reuters ("IAEA says North Korea is expanding uranium-enrichment
   plant at Yongbyon", 19 Nov), AP syndication 19 Nov.
9. **Fiji declares a national state of disaster.** El Nino-driven drought
   causes widespread water shortages; PM Sitiveni Rabuka announces
   FJ$20m ($8.5m) for emergency water; rain below normal until at least
   April. Sources: Reuters ("Fiji declares state of disaster amid
   El Nino-driven drought", 19 Nov).
10. **Pakistan kills 22 militants in northwest raids.** Intelligence-based
    raids over 48 hours in South Waziristan, Bannu and Tank, Khyber
    Pakhtunkhwa, near the Afghan border; military alleges India backing.
    Sources: AP ("Pakistan military says it killed 22 militants in
    raids on hideouts in northwest", 19 Nov), TBS News 19 Nov.
11. **Oil refinery blast in Cepu, Central Java.** Explosion at a tank of
    an energy-ministry refinery under maintenance kills one worker;
    fire brought under control; investigation under way. Sources:
    Reuters ("Explosion at Indonesia oil refinery kills one worker,
    investigation underway", 19 Nov).
12. **Migrant boat capsizes off Senegal.** Dozens missing after a boat
    bound for Europe capsizes off Yenne, south of Dakar; about 50 people
    aboard, one survivor reported. Sources: Reuters ("Dozens missing as
    migrant boat capsizes off Senegal coast, NGO says", 19 Nov).
13. **Trump raises ex-Nvidia boss Huang with Xi.** Trump tells Fox News
    he spoke to Xi about AI and referred to former Nvidia CEO Jensen
    Huang "briefly"; Huang resigned 12 Nov after revelations about
    extramarital affairs; Nvidia's board says it does not intend to
    reinstate him. Sources: Reuters ("Trump says he referred to
    ex-Nvidia boss Huang's situation 'briefly' in talk with Xi",
    19 Nov). Note: Nvidia's $115.8bn earnings were 17 Nov, so they are
    NOT used as a separate story.
14. **UK sends Ukraine 1,000 long-range drones.** £260m package of
    long-range strike drones announced 19 Nov. Sources: BBC
    ("UK to provide Ukraine with long-range drones as part of £260m
    package", 19 Nov).
15. **Uganda landslide survivors seek justice at the UN.** Survivors of
    the deadly landslide take their case to the UN. Sources: BBC
    ("'We fear another disaster': Uganda's landslide survivors seek
    justice at the UN", 19 Nov).
16. **Cyclone Akvan nears Odisha.** Severe cyclonic storm over the Bay of
    Bengal; Odisha evacuates 80,000 people, deploys 74 rescue teams,
    shuts schools in six districts; landfall forecast near Gopalpur by
    noon 20 Nov, winds 90–100 kmph. Sources: The Hindu BusinessLine
    ("Odisha evacuates over 80,000 people…", 19 Nov), IMD bulletins
    19 Nov (via ANI).
17. **Odesa strikes: four killed, 13 hurt.** Three Russian strikes hit
    the historic centre (a UNESCO-protected area); residential buildings,
    cafes and shops damaged; Zelenskyy says first responders were
    targeted. Sources: Euronews ("Ukraine: Four killed and at least 13
    injured in Russian strike on Odesa", 19 Nov), Reuters. Note: the
    strikes happened Wed 18 Nov and were first reported on 19 Nov, which
    the rules allow ("events that happened, or were first reported, on
    19 November 2026").
18. **Ash Barty into the Tennis Hall of Fame.** The former world No. 1
    will be elected into the International Tennis Hall of Fame next
    year. Sources: BBC Sport ("Ash Barty to be elected into
    International Tennis Hall of Fame next year", 19 Nov).
19. **IPCC report delay threatens climate effort.** Delay to the IPCC
    report will threaten the global effort to tackle the climate crisis,
    a top scientist warns. Sources: The Guardian ("IPCC report delay
    will threaten global effort to tackle climate crisis, says top
    scientist", 19 Nov).
20. **Footer ticker:** Indonesia's parliament passes an asset-forfeiture
    law (Reuters, 19 Nov — seizure without a criminal conviction for
    assets ≥ Rp1bn); Australia, Canada, Italy and the UK jointly call on
    Israel to allow aid into flooded Gaza (19 Nov). (v1, re-verified.)

Dropped as not cleanly 19 Nov: Voyager 1 one-light-day milestone (crossed
18 Nov 10:16 UTC — not the day's news); Nvidia $115.8bn earnings
(17 Nov — only the 19 Nov Trump/Huang mention is used); Knesset elects
Matan Kahana speaker (vote Tue 17 Nov); Van Gogh $190.4m sale (18 Nov);
EU €45bn Ukraine loan (18 Nov); Bangladesh garment protests, Ethiopia /
Eritrea border build-up, US $17bn Southeast Asia deals, Estonia border
closure, Houthi Bab el-Mandeb seizure — all seen only in low-quality
roundups and not verified against a wire outlet for 19 Nov, so left out
rather than risked.

## Files written (all fresh in this session)

- `main.ts` — Node 22, stdlib only (`node:fs`, `node:path`, `node:zlib`).
  Pure-JS PNG encoder (CRC32 + deflate level 9), embedded 5x7 bitmap
  font (A–Z, 0–9, punctuation), flat vector drawing. No network, no
  clock, no randomness. Layout: masthead (date + story count), lead
  story with flags/globe/skyline art, 3 x 6 grid of 18 story cells
  (tag, headline ≤2 lines, summary ≤1 line), footer ticker.
  Self-checks: throws if the lead headline wraps past 2 lines, the lead
  summary past 2, any cell headline past 2 lines, or any cell summary
  past 1 line — so no sentence can be silently truncated.
- `README.md` — entry description, story list, run instructions.
  (Badges at the top kept exactly as in v1.)
- `LICENSE` — unchanged from v1 (MIT, `SPDX-License-Identifier: MIT`).
- `.makefun/owner.json` — unchanged (wallet
  `oG9zsFymWdLqgHvqLD1t4fTdnGCWLkhmTYBFR9gP5d4`).
- This `BUILD_LOG.md`.

## Verification

- 2x run: `MAKEFUN_OUTPUT_DIR=/tmp/ni2-out1 node main.ts` and
  `/tmp/ni2-out2` → **byte-identical**, sha256
  `228bac7d310709262128ecf636ccb6c0267f2072e14369fa049b484f28b487cf`
  (first version before the Anthropic headline fix: `06cab901…bfe2`).
- Output: **1024x1024 RGB PNG, 24,172 bytes** (< 1 MiB, ≤1024x1024).
  PNG chunks validated with Python (IHDR/IDAT/IEND, all CRCs ok).
- Default path also run (`node main.ts` → `/output/entry.png`) in v1's
  session; the program writes to `MAKEFUN_OUTPUT_DIR` with `/output`
  as the default, same code path.
- Kit `check` not run here: it needs the transcripts bundle, which the
  parent creates at submit time.
- Node 22 note: `main.ts` uses no TypeScript-only syntax (plain JS in a
  `.ts` file), so it runs under Node 22 type stripping as well as Node 24
  used locally.

## Visual inspection (actual output image, viewed directly)

- Full size (1024x1024, viewed directly): masthead + date legible;
  lead headline 2 lines, flags (US/China/Russia) + globe + skyline
  clean; all 18 grid cells complete, no overlap, no cut-off text, no
  placeholder text; footer ticker legible. One fix made after the first
  viewing: the Anthropic headline broke as "ANTHROPIC'S / $81.3BN IPO"
  and read awkwardly — changed to "ANTHROPIC'S RECORD IPO" with the
  summary "$81.3BN, TRADES AS ANT", then re-ran 2x and re-viewed.
- At ~300 px (downscaled and viewed): masthead, date and lead headline
  still read; cell headlines are small but decipherable as blocks, tags
  and one-line summaries blur — the expected cost of a dense grid, and
  the same trade-off the 19–43-story rivals make. Headlines carry each
  story at thumbnail size.

## Remaining risks

- Judge is a VLM with no news feed: it judges from the image + its own
  knowledge. The Shenzhen summit and ICJ ruling were scheduled for 19 Nov
  and are stated in daily-paper present tense; both were confirmed as the
  day's top stories by multiple outlets on 19 Nov. The Odesa strikes
  happened 18 Nov and were first reported 19 Nov — allowed by the rules,
  but a judge that dates them to the 18th could count them as yesterday's
  news; they are one cell of 18, so the cost is bounded.
- Cell summaries are one short line (≤24 chars) by design: headlines
  carry each story, summaries add one fact. At a 300 px thumbnail only
  headlines and tags read clearly; that matches the judge's craft
  criterion but a rival with longer readable text could out-read it.
- Dev rate is provisional and opponent-adjusted: v1 went 12-0 yet rated
  only 0.970769 because its wins came against weak house images. v2's
  rate will depend on which house images it is paired with, not only on
  its own quality.
