# Tagging clips

Every clip in `clips.json` has one value per axis, from −1 to +1, plus a separate
`gender` value (section 3b). The algorithm reads a
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

## 3b. Gender lean: weights and reasoning

Every clip also has a `gender` value from −1 to +1: **negative = guy-leaning audience, positive =
girl-leaning audience**. The model treats it as a fifth term next to the four letters, so a like on
a cleaning clip is shared between "girl" and "J" instead of all being counted as J. It is shown as
its own bar ("Gender lean") and is **never part of the four-letter type**.

The same tier caps apply (A .9, B .6, C .3). What counts is **who watches** a kind of content, never
the creator's gender: a man doing a makeup tutorial still gets the `BEAUTY` weight.

| Code | Content | Gender weight (cap) | Tier | Reasoning and source |
|---|---|---|---|---|
| `BEAUTY` | Makeup, skincare, hair, glow-ups | girl up to .9 | A | Beauty & Style is 62% of YouTube views by women aged 18–34 (OpenSlate); cosmetics-type brands (e.g. Gillette Venus) were among the most female-predictive Facebook likes, and likes predicted gender with 93% accuracy (Kosinski et al. 2013). Two large datasets, very large gap. |
| `CLEAN` | Cleaning, "cleaning motivation", home resets | girl up to .6 | B | Cleaning creators' audiences run about 82–96% female in influencer analytics (Modash), cleaning creators report audiences of ~90% women, and sociologists describe the audience as mostly women (Casey & Littler, via Dame). The direction is clear and the gap is big, but there's no peer-reviewed audience count, so B rather than A. |
| `INSPO` | Aesthetic lifestyle and "inspo": study/productivity aesthetic, cozy setups, travel montages, home cooking, fashion shopping | girl up to .5 | B | Women show a stronger pull to the inspiration platforms Pinterest and TikTok than men do (Traackr 2025); the beauty/style viewing gap above covers the fashion side. Capped at .5 because the evidence is per platform, not per video. |
| `CUTE` | Cute animals | girl up to .3 | C | 88% of the ~7,000 cat-video viewers who answered Myrick (2015) were women, but the sample was self-selected through cat sites. |
| `SENTIMENT` | Kindness, hugs, romance, sentimental moments | girl up to .3 | C | Women score higher on agreeableness/warmth across cultures (Costa, Terracciano & McCrae 2001); applying that to video taste is an inference. |
| `GAMING` | Gaming and game footage | guy up to .6 | B | Gaming is 51% of YouTube views by men aged 18–34 (OpenSlate). Memes that only borrow game footage get about half. |
| `THRILL` | Extreme sports, speed, danger | guy up to .4 | B | Men score higher on sensation seeking: d = 0.41 (Cross, Copping & Campbell 2011), d = 0.46 on the SSS-V (Cross, Cyrenne & Brown 2013). A moderate effect, so .4. |
| `CRUDE` | Pranks, roasts | guy up to .3 | C | Disinhibition is part of sensation seeking (above); its link to prank humor is inferred. |
| everything else | Memes, relatable skits, quotes, calm scenes | 0 to ±.1 | — | No usable evidence of a gender gap. |

## 4. Every clip, with its weights and reasoning

These are the 33 real TikToks in `public/clips/` (they replaced the 48 placeholders). Each one
was categorized from its first frame's on-screen text plus what the clip shows; each also has a
poster image made from that first frame.

Weights are E/I, S/N, T/F, J/P, then gender, in that order (negative = I, S, T, J, guy).

| ID | Clip | E/I | S/N | T/F | J/P | Gender | Categories → reasoning |
|---|---|---|---|---|---|---|---|
| p01 | Kafka vs Dostoevsky on overthinking | −.3 | .8 | .1 | 0 | .1 | Literary/philosophy quotes over a bookshelf: `IDEAS` (N); quiet reading scene `CALM` (I); overthinking topic `NEURO` (small F). BookTok's female skew is unsourced, so gender stays at .1 |
| p02 | CJ studying: me core | −.1 | .3 | 0 | .1 | −.3 | Relatable meme over GTA game footage: light `ABSURD` (N); game footage uses `GAMING` (guy) at half its cap because it's a meme, not gameplay |
| p03 | POV: experiencing life for the first time | .3 | .5 | 0 | .1 | 0 | Goofy wide-eyed supermarket bit: `ABSURD` (N), `COMEDY` (E) at cap |
| p04 | What Sept-Dec need to sound like (study aesthetic) | −.2 | −.2 | 0 | −.6 | .5 | Whiteboard notes and laptop study setup: `ORDER` (J) at cap, light `ROUTINE` (S) and `CALM` (I); study-aesthetic inspo `INSPO` (girl) at cap |
| p05 | Trying the lunch-in-my-city challenge | .1 | .2 | 0 | 0 | .2 | Trying a local lunch spot: light `NOVEL` (N); lifestyle food vlog, partial `INSPO` (girl) |
| p06 | Cleaning motivation | −.1 | −.3 | 0 | −.6 | .6 | Shower and washer scrub-down: `ORDER` (J) and `ROUTINE` (S) at caps, light `CALM`; `CLEAN` (girl) at cap |
| p07 | Cat in a belly-dance outfit | −.2 | .3 | .5 | 0 | .3 | `CUTE` (F, I at cap); dressed-up cat adds light `ABSURD` (N); `CUTE` (girl) at cap |
| p08 | Monkey: my dreams are 37 timelines of chaos | −.1 | .5 | 0 | .1 | 0 | Nonsense dream meme: `ABSURD` (N); sleep/anxiety angle `NEURO`, small weights only |
| p09 | Skin & hair glow-up routine | 0 | −.2 | 0 | −.3 | .8 | Juicing and face-mask glow-up: `BEAUTY` (girl) near cap; self-care routine adds light `ROUTINE` (S) and `ORDER` (J) |
| p10 | Showed too much personality too early | .3 | .1 | 0 | .2 | 0 | Self-roast about being 'too much': `COMEDY` (E) at cap; `NEURO` small weights |
| p11 | Bungee jump: my head MIGHT touch the water | .4 | .2 | 0 | .5 | −.4 | `THRILL` at its caps on E, N, P; `THRILL` (guy) at cap |
| p12 | Do you have lasagna? grocery prank | .4 | 0 | −.3 | .5 | −.3 | Public prank: `CRUDE` (P, T at caps), `SOCIAL` (E); `CRUDE` (guy) at cap |
| p13 | To go away: travel montage | .1 | .4 | 0 | .3 | .4 | Pyramids and old-town travel shots: `NOVEL` (N) at cap, light `THRILL` (P); travel inspo `INSPO` (girl) |
| p14 | Day 12 of traumatizing my family with our whiteboard calendar | 0 | .6 | −.1 | .3 | 0 | Creepy drawings on the family calendar: unusual art `ART` (N), prank side `CRUDE` (P, light T); creepiness is `HORROR`, ≤ .1 |
| p15 | Deep hugs | 0 | .2 | .5 | 0 | .3 | Two friends hugging by the sea: `KIND` (sentimental, F) at cap, moody shot light `MELLOW` (N); `SENTIMENT` (girl) at cap |
| p16 | How I feel after saying ok instead of arguing back | −.2 | 0 | .3 | 0 | 0 | Choosing peace over arguing is the agreeable opposite of `DEBATE`, so F at the C cap; calm suburban scene light `CALM` (I) |
| p17 | POV: you got close to someone out of nowhere | .2 | 0 | .2 | .1 | .2 | Opening up to a new person: `ROMANCE` (F) at its .2 cap, light `SOCIAL` (E); partial `SENTIMENT` (girl) |
| p18 | Breakfast of my dreams | −.1 | −.3 | 0 | −.3 | .3 | Making breakfast at home: `ROUTINE` (S) at cap, light `ORDER` (J) and `CALM`; home-lifestyle `INSPO` (girl) |
| p19 | Want to socialize but not talk, like a cat | −.5 | 0 | .1 | 0 | 0 | Liking an introvert-relatable post points to I: `CALM` near cap |
| p20 | Our society needs human touch & connection | .3 | 0 | .5 | 0 | .3 | Street kindness experiment: `KIND` (F) at cap, crowd setting light `SOCIAL` (E); `SENTIMENT` (girl) at cap |
| p21 | Cat vs scissors | −.2 | 0 | .6 | 0 | .3 | `CUTE` at caps on F, I and girl |
| p22 | POV: found your exact lip shade, but darker | 0 | −.1 | 0 | 0 | .9 | Lip-liner makeup tutorial: `BEAUTY` (girl) at cap; everyday how-to, light `ROUTINE` (S) |
| p23 | POV: you see someone from school in public | −.3 | −.2 | 0 | .1 | 0 | Hiding from an old classmate: avoiding people leans I (`CALM`); setup-and-payoff skit `PUNCHLINE` (S) |
| p24 | Once I'm comfortable I say anything | .3 | 0 | 0 | .1 | 0 | Chatty-with-friends bit: `SOCIAL`/`COMEDY` (E) |
| p25 | POV: social battery hits 0% without warning | −.5 | 0 | 0 | 0 | 0 | Introvert-relatable post: `CALM` (I) near cap |
| p26 | Therapy: downhill trail ride | .3 | .1 | 0 | .5 | −.4 | Fast POV trail ride called 'therapy': `THRILL` (P at cap, E, N); `THRILL` (guy) at cap |
| p27 | Nokia phone and the rat | 0 | .6 | 0 | .1 | 0 | Surreal nonsense meme: `ABSURD` (N) at cap |
| p28 | Fire-escape morning setup | −.4 | .2 | 0 | .1 | .5 | Setting up a cozy spot on a city fire escape: `CALM` (I), aesthetic mood light `MELLOW` (N); cozy-aesthetic `INSPO` (girl) at cap |
| p29 | POV: the waiter asks if everything is good | .2 | −.3 | 0 | 0 | .1 | Mouth-full-when-the-waiter-comes joke: classic `PUNCHLINE` (S); restaurant setting light `SOCIAL` (E) |
| p30 | The biggest lesson I learned this year | −.3 | .4 | .1 | 0 | .1 | Night-time reflective quote: `MELLOW` (N .4, I at cap); emotional theme light F |
| p31 | Best feeling: empty airport at night | −.5 | .3 | 0 | .1 | .1 | Empty terminal, quiet travel mood: `CALM` (I) near cap, light `NOVEL` (N) |
| p32 | I will never understand Zara self-checkout | 0 | −.2 | −.1 | 0 | .4 | Everyday shopping gripe: `ROUTINE` (S), mild complaint light `DEBATE` (T); fashion shopping `INSPO` (girl) |
| p33 | Baby orangutan close-up | −.2 | 0 | .6 | 0 | .3 | `CUTE` at caps on F, I and girl |

**Coverage gaps in this set:** T has one real indicator (p12, plus light touches in p14 and p32),
and S has no strong clip (−.3 at most). Add blunt-debate, hot-take and how-to clips next.

## 5. When you add real clips

1. Pick the clip's category codes from section 3 (and 3b for gender).
2. Give each axis, and gender, a weight **at or below that category's cap**.
3. Add a row to section 4 so the reasoning stays on record.
4. Keep both ends of every axis covered, especially **T**, which has the fewest proven indicators.
5. Run `npm run simulate`.

## Sources

- Costa, Terracciano & McCrae (2001). Gender differences in personality traits across cultures. *JPSP*. <https://pubmed.ncbi.nlm.nih.gov/11519935/>
- Cross, Copping & Campbell (2011). Sex differences in impulsivity: a meta-analysis. *Psychological Bulletin*. <https://research-repository.st-andrews.ac.uk/bitstream/handle/10023/2161/Cross2011PsychBullSexDifferences_WithAppendix1.pdf>
- Cross, Cyrenne & Brown (2013). Sex differences in sensation-seeking: a meta-analysis. *Scientific Reports*. <https://www.nature.com/articles/srep02486>
- Dame Magazine (2022). The rise of the cleanfluencer. <https://damemagazine.com/2022/03/22/the-rise-of-the-cleanfluencer>
- Modash. Female cleaning influencers on TikTok, with audience gender splits. <https://www.modash.io/find-influencers/tiktok/cleaning/female>
- OpenSlate, YouTube viewing interests of young men and women. <https://www.videonuze.com/article/openslate-data-shows-vastly-different-youtube-viewing-interests-for-young-men-and-women>
- Pacific Standard on Kosinski et al.'s most gender-predictive likes. <https://psmag.com/economics/big-data-big-brother-and-the-like-button-53894/>
- Refinery29 (with Clorox). Cleaning creators on their audiences. <https://refinery29.com/en-us/how-to-clean-cleantok-influencers>
- Traackr (2025). US influencer marketing impact report. <https://www.netinfluencer.com/traackr-2025-us-influencer-marketing-impact-report/>
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
