# Tagging clips

Every clip in `clips.json` has one value per axis, from −1 to +1. The algorithm reads a
like as evidence for the positive end and a dislike as evidence against it, scaled by
these numbers. **The size of a number is a claim about how strong the evidence is**, so
it has to follow the research, not gut feel.

| Axis key | −1 | +1 | Big Five trait it tracks |
|---|---|---|---|
| `extraversion` | **I** Introverted | **E** Extraverted | Extraversion |
| `intuition` | **S** Sensing | **N** Intuitive | Openness to experience |
| `feeling` | **T** Thinking | **F** Feeling | Agreeableness |
| `perceiving` | **J** Judging | **P** Perceiving | Conscientiousness (reversed) |

The letter-to-trait mapping is from McCrae & Costa (1989), who found S/N lines up with
openness and J/P with conscientiousness. That's why Big Five research can set weights here.

---

## 1. Weight rules

Each category below gets a **maximum weight** set by its evidence tier. A clip can use
less than the cap (if it only partly fits the category) but never more.

| Tier | Meaning | Max weight |
|---|---|---|
| **A** | Strong: replicated across studies or a very large sample | **0.9** |
| **B** | Moderate: consistent findings, or one large study | **0.6** |
| **C** | Supporting: one smaller study, or a direct inference from A/B research | **0.3** |
| **—** | No usable evidence | **0.1** (or 0) |

When a clip fits two categories, each axis takes the weight from the category that
applies to that axis.

## 2. Strongest indicators by letter

| Letter | Strongest video indicators | Tier |
|---|---|---|
| **N** | Abstract/surreal art; philosophy and big ideas; documentaries and sci-fi; literary/culture; meditation | A |
| **N** | Absurd/nonsense humor; reflective music | B |
| **S** | Classic setup-and-punchline humor | B |
| **S** | Familiar routines, traditions, practical/everyday content | C |
| **E** | Parties, festivals, crowds; hype and upbeat dance/pop/hip-hop; reality-TV personalities and drama | B |
| **I** | Calm, solitary scenes; science and tech; mellow reflective music | B |
| **F** | Cute animals | B |
| **F** | Kindness, rescues, sentimental moments | C |
| **T** | Blunt debates, hot takes, harsh honest reviews | C |
| **J** | Organizing, cleaning, planners, routines; minimalist and ordered spaces | B |
| **P** | Thrill and extreme sports | B |
| **P** | Pranks, roasts, crude humor | B |

## 3. Categories: weights and reasoning

| Code | Category | Axis weights (cap) | Tier | Reasoning and source |
|---|---|---|---|---|
| `ART` | Abstract, surreal, unusual art and visuals | N up to .9 | A | Openness is the strongest, most consistent predictor of art taste in ~91,000 people (Chamorro-Premuzic et al. 2009); open people and sensation seekers prefer abstract and surreal art (Furnham & Walker 2001; Furnham & Avison 1997); preference for complex images tracks openness across cultures (Van Geert et al.). |
| `IDEAS` | Philosophy, big ideas, documentaries, sci-fi, literary/culture | N up to .9 | A | Openness ↔ arts/culture interest and literary reading (Kraaykamp & van Eijck 2005); openness ↔ documentaries and sci-fi (film-genre studies); "Cerebral" and "Aesthetic" entertainment types (Rentfrow, Goldberg & Zilca 2011). |
| `MEDITATE` | Meditation, mindfulness | N up to .6; I up to .6 (via `CALM`) | A for N | Liking meditation/Buddhism pages was a marker of openness in 58,000 Facebook users (Kosinski et al. 2013). Capped at .6 because the evidence is page likes rather than video. |
| `ABSURD` | Absurd / nonsense humor | N up to .6 | B | Experience seeking and openness ↔ liking nonsense humor; replicated across Ruch's humor studies. |
| `PUNCHLINE` | Classic setup-and-punchline jokes | S up to .4 | B | Lower experience seeking ↔ preferring incongruity-resolution (setup-and-payoff) humor (Ruch). Capped below .6 because it's a preference *relative to* nonsense humor. |
| `NOVEL` | New places, travel, unfamiliar food | N up to .4 | C+ | Inferred from openness = seeking novelty; no direct video study. Allowed slightly above C because it follows directly from the openness definition. |
| `ROUTINE` | Familiar routines, traditions, practical everyday content | S up to .3; J up to .6 (via `ORDER`) | C for S | Low openness ↔ conventional, familiar, realistic taste (art studies above). Applied to content by inference, so S stays at .3. |
| `PARTY` | Parties, festivals, crowds, hype, upbeat dance/pop/hip-hop | E up to .6; P up to .4 | B | Upbeat/energetic music ↔ extraversion (Rentfrow & Gosling 2003); party-culture page likes marked extraversion (Kosinski et al. 2013). P from disinhibition/sensation seeking (`THRILL`). |
| `REALITY` | Reality-TV personalities, relationship drama | E up to .4; P up to .3 | B/C | Reality-TV personality likes marked extraversion (Kosinski et al. 2013 examples). Capped at .4 because it's a few example pages, not a category test. |
| `SOCIAL` | Group activities, friends, public celebrations | E up to .6 | B | Same extraversion evidence as `PARTY`; group/social settings are the defining feature of extraversion. |
| `COMEDY` | Stand-up, general comedy | E up to .3 | C | Comedy ↔ extraversion in some film studies, but results disagree. |
| `CALM` | Calm, solitary, quiet scenes | I up to .6 | B | Reflective music ↔ openness and away from upbeat/extraverted taste (Rentfrow & Gosling 2003); solitude is the defining feature of introversion. |
| `MELLOW` | Mellow, reflective, sad music | N up to .5; I up to .3 | B | Reflective & complex music ↔ openness (Rentfrow & Gosling 2003). |
| `TECH` | Science, tech, strategy, gaming skill | I up to .4; N up to .3 | B for I | Introverts show more interest in science and tech than extraverts (Pew 2015); openness predicts tech-news interest (Kaspar & Fuchs 2021). |
| `THRILL` | Extreme sports, speed, danger | P up to .5; E up to .4; N up to .2 | B | Sensation seeking ↔ thrill content and away from conventional taste (Zuckerman; Furnham & Avison 1997); sensation seeking runs with extraversion and low conscientiousness. |
| `CRUDE` | Pranks, roasts, crude or disparaging humor | P up to .5; T up to .3 | B for P | Disinhibition (part of sensation seeking) ↔ enjoying crude, black and disparaging humor (Carretero-Dios & Ruch 2010). T kept at .3: disparaging others is low-agreeableness flavored, but that link is inferred. |
| `CUTE` | Cute animals | F up to .6; I up to .2 | B | Agreeableness and shyness ↔ watching cat videos, ~7,000 people (Myrick 2015). Capped at .6: large but self-selected sample. |
| `KIND` | Kindness, helping, rescues, sentimental moments | F up to .5 | C+ | Agreeableness = warmth and compassion; inferred from `CUTE` and from agreeable people preferring warm, pleasant content (Furnham & Walker 2001; Rentfrow & Gosling 2003). |
| `ROMANCE` | Romance, love stories | F up to .2 | — | Film studies disagree on direction, so it carries almost no weight. |
| `DEBATE` | Blunt debates, hot takes, harsh honest reviews | T up to .3 | C | Thinking ≈ low agreeableness (McCrae & Costa 1989); bluntness and argument are low-agreeableness behaviors. No direct video study, so capped at C. **T has the fewest proven indicators.** |
| `ORDER` | Organizing, cleaning, planners, routines, minimalist/ordered spaces | J up to .6 | B | Need for structure ↔ preferring ordered, symmetrical images (Van Geert et al.); neatness is one of the clearest signs of conscientiousness in people's rooms (Gosling et al. 2002). |
| `HORROR` | Horror, morbid topics | ≤ .1 on any axis | — | Results conflict: sensation seeking predicted horror enjoyment in older work but not in Kiss et al. 2024; one film study even links horror to *higher* agreeableness. |
| `DARK` | Dark humor | none | — | Linked to intelligence and lower aggression (Willinger et al. 2017), not to any of the four letters. |
| `NEURO` | Anxiety, overthinking, mental-health content | ≤ .3 | — | Relates to neuroticism, which these four letters don't measure. Small weights only. |
| `UNKNOWN` | Topics with no research found (e.g. conspiracy deep-dives) | ≤ .2 | — | No study found. |

## 4. Every clip, with its weights and reasoning

Weights are E/I, S/N, T/F, J/P in that order (negative = I, S, T, J).

| ID | Clip | E/I | S/N | T/F | J/P | Categories → reasoning |
|---|---|---|---|---|---|---|
| p01 | Skydiving POV | .4 | .2 | 0 | .5 | `THRILL` at its caps |
| p02 | Rainy window, lo-fi | −.5 | .2 | .1 | 0 | `CALM` (I), `MELLOW` (light N) |
| p03 | Desk setup cleaning | −.1 | −.2 | 0 | −.6 | `ORDER` at cap; light `ROUTINE` |
| p04 | Friends prank each other | .4 | 0 | −.2 | .4 | `CRUDE` (P, light T), `SOCIAL` (E) |
| p05 | Rescue dog reunion | −.1 | 0 | .6 | 0 | `CUTE` at cap |
| p06 | Abstract art timelapse | −.1 | .9 | 0 | .1 | `ART` at cap |
| p07 | Hot take debate clip | .3 | .2 | −.3 | 0 | `DEBATE` at cap; arguing publicly leans E |
| p08 | Meal prep for the week | 0 | −.3 | 0 | −.6 | `ORDER` + `ROUTINE`, both at caps |
| p09 | Overthinking at 3am skit | −.3 | .2 | .2 | .1 | `NEURO`: small weights only |
| p10 | Festival crowd drop | .6 | .1 | 0 | .4 | `PARTY` at caps |
| p11 | Solo cabin in the woods | −.6 | .3 | 0 | .1 | `CALM` at cap; light `NOVEL` |
| p12 | Stranger helps elderly man | 0 | 0 | .5 | 0 | `KIND` at cap |
| p13 | Street food tour in Bangkok | .3 | .4 | 0 | .3 | `NOVEL` at cap; light `THRILL`/`SOCIAL` |
| p14 | Color-coded planner flip-through | −.2 | −.3 | 0 | −.6 | `ORDER` + `ROUTINE` at caps |
| p15 | Stand-up crowd work | .3 | .1 | −.2 | .2 | `COMEDY` at cap; light `CRUDE` |
| p16 | Grandma teaches family recipe | 0 | −.3 | .4 | −.2 | `ROUTINE` (tradition, S at cap), `KIND` (sentimental) |
| p17 | Conspiracy theory deep-dive | −.2 | .2 | −.1 | .2 | `UNKNOWN`: kept ≤ .2 |
| p18 | 5am morning routine | 0 | −.3 | 0 | −.6 | `ORDER` + `ROUTINE` at caps |
| p19 | Parkour across rooftops | .3 | .1 | 0 | .5 | `THRILL` |
| p20 | Sad piano cover | −.3 | .5 | .3 | 0 | `MELLOW` at caps; light `KIND` (sentimental) |
| p21 | House party dance circle | .6 | 0 | .1 | .4 | `PARTY` at caps |
| p22 | Bookshelf tour | −.4 | .6 | 0 | −.1 | `IDEAS` (literary), `CALM` |
| p23 | Roast battle | .3 | 0 | −.3 | .4 | `CRUDE` (P, T at cap), `SOCIAL` |
| p24 | Volunteers clean a beach | .2 | 0 | .5 | −.2 | `KIND` at cap; light `SOCIAL`, `ORDER` |
| p25 | Horror short film | 0 | .1 | 0 | .1 | `HORROR`: ≤ .1 |
| p26 | Spreadsheet budget breakdown | −.2 | −.3 | −.2 | −.6 | `ORDER` + `ROUTINE` at caps; light `TECH`, `DEBATE`-style bluntness |
| p27 | Solo travel vlog in Iceland | −.3 | .4 | 0 | .3 | `NOVEL` at cap; light `CALM`, `THRILL` |
| p28 | Gym PR celebration | .4 | −.1 | 0 | −.4 | `PARTY`-style hype (E), `ORDER` (discipline) |
| p29 | Anxiety tips from a therapist | −.2 | .2 | .3 | 0 | `NEURO`: small weights; light `KIND` |
| p30 | Cat vs cucumber | −.2 | −.1 | .5 | .1 | `CUTE` (F, I at cap) |
| p31 | Philosophy in 60 seconds | −.2 | .9 | 0 | .1 | `IDEAS` at cap |
| p32 | Extreme couponing haul | 0 | −.3 | 0 | −.5 | `ROUTINE` (practical) + `ORDER` |
| p33 | Wedding surprise flash mob | .6 | 0 | .2 | .2 | `SOCIAL` at cap; `ROMANCE` capped at .2 |
| p34 | Brutally honest product review | 0 | −.2 | −.3 | −.2 | `DEBATE` at cap; light `ROUTINE` (practical) |
| p35 | 30-second meditation bell | −.5 | .6 | .1 | 0 | `MEDITATE` at cap; `CALM` |
| p36 | Car drifting at night | .3 | .1 | 0 | .5 | `THRILL` |
| p37 | Hometown diner regulars | .3 | −.3 | .3 | −.2 | `ROUTINE` (familiar, S at cap), `SOCIAL`, light `KIND` |
| p38 | Is cereal soup? debate | .3 | .5 | −.2 | .3 | `ABSURD` (N); light `DEBATE`, `SOCIAL` |
| p39 | Firefighters save a kitten | 0 | −.1 | .5 | 0 | `KIND` + `CUTE` |
| p40 | Minimalist apartment tour | −.2 | .1 | 0 | −.6 | `ORDER` at cap |
| p41 | Reading my ex texts | .4 | 0 | .1 | .3 | `REALITY` at caps |
| p42 | Same breakfast for 10 years | 0 | −.3 | 0 | −.6 | `ROUTINE` + `ORDER` at caps |
| p43 | Chess blunder compilation | −.3 | .3 | −.2 | −.1 | `TECH` (strategy) at caps; light `DEBATE`-style analysis |
| p44 | Group hike summit cheer | .6 | .2 | .2 | .1 | `SOCIAL` at cap; light `NOVEL`, `KIND` |
| p45 | Crying at graduation | .1 | −.1 | .5 | 0 | `KIND` (sentimental) at cap |
| p46 | Speedrun world record | −.4 | .2 | −.2 | −.2 | `TECH` (I at cap); light `ORDER` (precision) |
| p47 | Prank call compilation | .3 | 0 | −.3 | .5 | `CRUDE` at caps |
| p48 | Late-night existential talk | 0 | .8 | .2 | .2 | `IDEAS` |

## 5. When you add real clips

1. Pick the clip's category codes from section 3.
2. Give each axis a weight **at or below that category's cap**.
3. Add a row to section 4 so the reasoning stays on record.
4. Keep both ends of every axis covered, especially **T**, which has the fewest proven indicators.
5. Run `npm run simulate`.

## Sources

- Carretero-Dios & Ruch (2010). Humor appreciation and sensation seeking. *Humor*. <https://www.degruyterbrill.com/document/doi/10.1515/humr.2010.020/pdf>
- Chamorro-Premuzic, Reimers, Hsu & Ahmetoglu (2009). Who art thou? *British Journal of Psychology*. <https://research.gold.ac.uk/id/eprint/4898>
- Furnham & Avison (1997); Furnham & Walker (2001). Personality and art preferences. <https://e-l.unifi.it/pluginfile.php/929461/mod_folder/content/0/Furnham%20and%20Walker%20%282001%29.pdf>
- Gosling, Ko, Mannarelli & Morris (2002). A room with a cue. *JPSP*. <https://pubmed.ncbi.nlm.nih.gov/11902623/>
- Kaspar & Fuchs (2021). Personality and news-topic interest. <https://kups.ub.uni-koeln.de/56702>
- Kiss et al. (2024). Horror enjoyment. *Scientific Reports*. <https://pmc.ncbi.nlm.nih.gov/articles/PMC10844225>
- Kosinski, Stillwell & Graepel (2013). Private traits are predictable from digital records. *PNAS*. <https://pmc.ncbi.nlm.nih.gov/articles/PMC3625324>
- Kraaykamp & van Eijck (2005). Personality, media preferences, and cultural participation. *Personality and Individual Differences*. <https://pure.eur.nl/en/publications/personality-media-preferences-and-cultural-participation/>
- McCrae & Costa (1989). Reinterpreting the MBTI from the five-factor model. *Journal of Personality*. <https://pubmed.ncbi.nlm.nih.gov/2709300/>
- Myrick (2015). Cat videos and emotion. *Computers in Human Behavior*. <https://www.refinery29.com/2015/06/89365/cat-videos-emotions-study>
- Pew Research Center (2015). Interest in science linked to personality. <https://www.pewresearch.org/internet/2015/12/11/public-interest-in-science-and-health-linked-to-gender-age-and-personality/markdown>
- Rentfrow & Gosling (2003). The do re mi's of everyday life. *JPSP*. <https://www.apa.org/monitor/julaug03/listen>
- Rentfrow, Goldberg & Zilca (2011). Listening, watching, and reading. *Journal of Personality*. <https://pmc.ncbi.nlm.nih.gov/articles/PMC2964424>
- Ruch, humor appreciation and sensation seeking. <https://jltonline.de/articles/03.2/ruch-sensation-seeking-abstract.en.pdf>
- Van Geert et al., order, complexity and personality. <https://elinevg.github.io/projects/neatly-organized.html>
- Willinger et al. (2017). Black humour, intelligence and aggression. *Cognitive Processing*. <https://www.bps.org.uk/research-digest/if-you-sick-jokes-maybe-its-because-youre-just-so-smart>
- Film-genre studies: <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12182957/> · <https://repozitorij.ffst.unist.hr/en/islandora/object/ffst:4817>
