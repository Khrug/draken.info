---
title: "知行合一: When Automation Removes the Only Honest Referee"
drk: DRK-131
date: 2026-04-24
revised: 2026-04-24
version: v2
tags: [theory, analysis, political-economy, philosophy]
layers: [L07, L09, L10, L11, L12, L13, L14, L16, L17, L18]
coherence: 0.92
excerpt: "Labour was not only the cage — it was also the capital–labour restriction map that forced Display-phase claims into contact with material reality. Post-AGI, that specific map empties. ρ_{D→Cl}^{labour} = ∅. The cage is gone, and so is the referee. Donnat deconstructs the cage correctly; the Chinese Marxist literature (Wang Shuixing 2022, Lu Zirong 2024) identifies the wage relation as the structural cage; the Draken contribution is that removing the cage does not complete the emancipation — it leaves a Display layer with no gluing condition unless successor restriction maps (ρ^{attention}, ρ^{data}, ρ^{ecological}) are actively built. Wang Yangming's 知行合一 supplies the constitutive-sheaf condition at L07/L17 that the testing-sheaf condition at L04–L11 cannot reach. The DSA proceedings of Q1 2026 are the first state-imposed successor map to begin operating. Whether it scales is the empirical test."
status: published
author: Khrug Engineering
license: CC BY-SA 4.0
revision_note: "v2 incorporates critical feedback from Moonshot/Kimi's review of v1 (24 Apr 2026). Major changes: (1) stratified the restriction-map formalism to distinguish capital–labour Clinch collapse from successor maps, (2) added primary Chinese-language source citations from 马克思主义研究 (CASS) and 求是学刊, (3) refined the Wang Yangming section to distinguish constitutive from testing sheaves, (4) replaced polemical framing of the American régime with formal sheaf-failure analysis and added a steelmanned alternative reading, (5) distinguished UBI-as-pacification from UBI-plus-Clinch emancipation, (6) tied the successor-Clinch claim to specific 2026 EU DSA enforcement proceedings as an empirical test. v1 is preserved at /posts/v1/ for the record."
---

*Cross-references: [The Substrate and the Game](https://draken.info/posts/the-substrate-and-the-game/) (DRK-130), [The Totalitarian Sheaf](https://draken.info/posts/the-totalitarian-sheaf/) (DRK-125), [The Boundary of Us](https://draken.info/posts/the-boundary-of-us/) (DRK-124), [The Coherence Debt](https://draken.info/posts/the-coherence-debt/) (DRK-121), [The Stick That Is Not a Weapon](https://draken.info/posts/the-stick-that-is-not-a-weapon/) (DRK-128).*

*This is v2 of DRK-131, revised in response to peer review from Moonshot/Kimi. The original v1 is preserved at [`/posts/v1/zhixing-heyi-honest-referee/`](/posts/v1/zhixing-heyi-honest-referee/). The Clinch architecture works when the review imposes contact and the post submits to it.*

---

## I. The Article and the Chinese Correction

Elsa Donnat's essay in *Phi/AI* — ["The Stockholm Syndrome of Labor — Why the post-AGI crisis of meaning is a red herring"](https://www.phiand.ai/p/the-stockholm-syndrome-of-labor) — performs the Weber–Foucault–Butler deconstruction of the work ethic cleanly. Work ethic as internalised discipline. The panopticon as self-policing architecture. Butler's formulation of subject-formation through subjection. The inscription above the gate at Auschwitz. Donnat's diagnosis: the fixation on post-AGI "meaning" is a distraction from the structural question of who holds power when machines produce value.

This post reads Donnat through two lenses she does not directly engage: the contemporary Chinese Marxist literature on AI and labour value, and the Draken sheaf framework. Both extend her diagnosis. Neither of them, on its own, completes it.

Recent Chinese scholarship on AI in the Marxist tradition is more developed than the Anglophone discourse tends to assume. Wang Shuixing (王水兴), in *Marxism Studies* (《马克思主义研究》), the flagship journal of the Chinese Academy of Social Sciences, has argued since 2022 that AI does not falsify Marx's theory of value but re-confirms it: AI is the technical reproduction of human general intellect, and its deployment intensifies rather than dissolves the capital–labour contradiction (Wang 2022). Lu Zirong (陆自荣), writing in *Seeking Truth Academic Journal* (《求是学刊》), places AGI within Marx's *Grundrisse* framework of the "machine-system" (机器体系) and "general intellect" (一般智力), treating AI as fixed capital (固定资本) whose productive power is alien to the workers who operate alongside it (Lu 2024). He Jiaxiao's more recent work in *Advances in Philosophy* synthesises the debate: the intelligent-age does not alter the essential law of value creation — living labour remains the sole source of new value — it only forces a reconsideration of how general intellect is appropriated (He 2026). Liu Ru and Han Dandan, in *Marxism & Reality*, make the same structural point from a different angle (Liu & Han 2024).

The consensus position in the serious Chinese literature — not the policy press releases, the actual journal work — is therefore considerably sharper than the standard Western rehearsal. The wage relation is the cage. Not self-discipline, not psychology, not ideology in the narrow sense. The cage is the specific structural point at which living labour is forced to sell itself as an accessory to constant capital. AI, correctly read, is constant capital — *c*, not *v* — and living labour remains the source of new value under capitalist accounting. This is not a trivial distinction. It determines who has claim on the surplus when machines do the work.

On this reading, Donnat's question "what will I do?" is a liberal-individualist evasion of the structural question: who owns the machines, and how is the surplus distributed? The Chinese Marxist answer — state ownership, party-led planning, *common prosperity* (共同富裕) as an articulated political programme — has at least the virtue of naming the ownership problem instead of hiding it behind an identity crisis. Whether the Chinese implementation actually works in practice is a separate question; we will return to it in §V.

The Draken framework agrees with both Donnat's diagnosis and the Chinese Marxist correction. Its contribution is the move that neither of them makes.

## II. The Cage Was Also a Clinch

The claim of this post, stated formally.

Recall the structural skeleton from DRK-128 and DRK-130. The ritualised combat protocol of monitor lizards — refined by selection over roughly 130 million years — resolves dominance disputes through a five-phase sequence: Display, Elevation, Clinch, Assessment, Resolution. The Display phase permits bluff: the animal laterally compresses its body to appear larger, arches its neck, hisses. The signal is in $\mathbb{R}^4$:

$$\mathbf{x}_D = (F_{\text{apparent}}, \, E_{\text{apparent}}, \, \Delta m_{\text{apparent}}, \, B)$$

where $B$ is the bluff dimension — the component not backed by physical reality. The Clinch phase — grappling, body-to-body contact, direct measurement of grip strength, endurance, mass — acts as a restriction map that annihilates the bluff:

$$\rho_{D \to Cl}: \mathbb{R}^4 \to \mathbb{R}^3, \quad (F, E, \Delta m, B) \mapsto (F_{\max}, E_{\text{ratio}}, \Delta m)$$

The null space of this map is exactly $\{(0,0,0,B) : B \in \mathbb{R}\}$. Any signal component that cannot survive physical contact is projected out. This is what the Clinch *does*: it forces Display-phase claims into contact with material reality and annihilates the unbacked component.

Now translate. Under the capital–labour relation of the twentieth century, capital could Display unlimited claims. Any wage, any hour, any condition, any claim of its own indispensability. The worker's Clinch was the strike, the walkout, the slowdown, the refusal. Collective action forced physical contact between capital's claims and the material reality of production: if nobody comes to work, the machines do not run, the ships do not load, the accounts do not close. The grapple produced honest assessment of relative capacity. Wages rose or fell, hours shortened or lengthened, according to who could actually hold the Clinch.

This is not a romantic reading of the labour movement. It is a formal one. The strike, in Draken's vocabulary, was a functioning restriction map at the political-economic layer — specifically, the map $\rho_{L11 \to L10}^{\text{labour}}$ between L11 (Economic Cognition) and L10 (Social Coordination). Every concession wrung from capital in the past 150 years — the eight-hour day, workplace safety, pensions, the weekend, health insurance in the social-democratic case, collective bargaining in the corporatist case — was an instance of this map firing and capital's bluff dimension being projected out.

The wage-effort bargain that Donnat correctly identifies as broken was once honest — not because capitalists were honest but because the protocol included a mechanism that forced honest Assessment. The Chinese Marxist reading understands this. Trotsky, in *The Revolution Betrayed* (1936), understood something sharper still: the Clinch can be captured by the very substrate that claims to represent it. State ownership without worker control, in his analysis, reproduces the same Display-without-Clinch structure that capital had operated, only with different uniforms. This is the lesson of bureaucratic degeneration. We return to it.

## III. Post-AGI: The Stratified Collapse

Here is the claim that neither Donnat nor the standard Chinese Marxist reading makes explicit. It is also the claim that v1 of this post overstated, and that the present version is revising.

**Automation does not abolish the extraction protocol. It empties the specific restriction map that historically kept capital–labour extraction honest, without automatically producing successor maps for the layers where extraction is now concentrated.**

The precise formal claim requires stratification. Under full automation — the post-AGI condition Donnat takes as her horizon and the Chinese policy apparatus is building toward — the worker cannot withhold what the machine has already supplied. The strike as a physical reality check requires labour's indispensability. Once the indispensability is gone, the specific map $\rho^{\text{labour}}$ deactivates:

$$\rho_{L11 \to L10}^{\text{labour}} \;\longrightarrow\; \emptyset$$

This is a strong and defensible claim. It is also incomplete. Other restriction maps remain — or can be constructed — at the same layer boundary, routed through substrates other than labour:

$$\rho^{\text{attention}}_{L11 \to L10} \;\neq\; \emptyset \quad \text{(provisionally)}$$
$$\rho^{\text{data}}_{L11 \to L10} \;\neq\; \emptyset \quad \text{(provisionally)}$$
$$\rho^{\text{ecological}}_{L18 \to L11} \;\neq\; \emptyset \quad \text{(necessarily, by planetary boundary)}$$

The attention-economy restriction map is operative to the extent that user engagement is still necessary for platform revenue. The data-economy map is operative to the extent that consent-withdrawal and data-union formation remain structurally possible. The ecological map is operative by physical law: the planet will impose contact on any Display-phase claim that ignores its material substrate, though the time-constant of that imposition is long enough that the Display phase can run for decades before being forced to grapple.

The structural vulnerability of the post-AGI configuration is not that restriction maps disappear but that the *old* map (labour) empties while successor maps have not yet been institutionalised. During this transition, the political economy runs in a regime where capital's Display claims face no effective Clinch at their former operating layer. The larger animal wins by posture alone until some other restriction map fires, and the delay is the coherence-debt window $K(t) = \int_0^t [\Psi(\tau) - \Psi_{\text{viable}}] \cdot w(\tau) \, d\tau$ during which extraction runs unchecked.

This stratified formulation is stronger than the v1 assertion that $\rho_{D \to Cl} = \emptyset$ full stop. The v1 claim was over-absolute. The v2 claim is: the specific capital–labour restriction map empties, and unless successor maps are actively built and scaled, the system enters a window of uncorrected $K(t)$ accumulation whose attractor is catastrophe-as-correction.

This also explains why the "ownership transfer" move, while necessary, is not sufficient. Relocating the machines from private capital (L11) to the party-state (L13/L16) — the standard Marxist–Leninist move, the move the Chinese model proposes — changes the *holder* of Display-phase authority but does not automatically restore the restriction map. A party-state that owns the machines faces the structurally analogous problem: without a mechanism that forces its claims about common prosperity, social progress, and equitable development into contact with the actual lived conditions of the population, the state apparatus can Display its own virtue indefinitely, measure that virtue by its own instruments, and accumulate coherence debt until the Clinch is imposed by material collapse, ecological limit, or the slow delegitimation that precedes a régime's fall.

This is not an anti-Chinese observation. It is the same analysis Trotsky applied to the USSR in *The Revolution Betrayed*. His diagnosis of bureaucratic ruling classes — ready to shut their eyes to the crudest mistakes of their leaders so long as privileges are defended — is a description of what happens when a political structure loses its internal Clinch mechanism. The Soviet bureaucracy, having captured the revolution's Display-phase authority, had no mechanism that could force it into contact with the actual conditions of Soviet workers. The result was the structural form Trotsky named: a weapon turned against the class it was built to protect.

The structural vulnerability is general. It applies to any system — capitalist, state-socialist, technocratic, algorithmic — that holds Display-phase authority without a functional Clinch at its operating layer.

## IV. Wang Yangming and Two Kinds of Sheaf Condition

The Chinese philosophical tradition has a concept for the general structure that is sharper than anything in the Western canon. 知行合一 *zhī xíng hé yī* — knowledge-action unity — is the central claim of Wang Yangming's (王陽明, 1472–1529) Neo-Confucian philosophy.

v1 of this post mapped Wang's 知 to Display and 行 to Clinch, and 合一 to the assertion that the sheaf condition must hold. That mapping was almost right but concealed a distinction that the framework needs to make explicit. Kimi's review flagged it, and the revised reading is sharper.

Wang's 知 is *moral knowledge*, not empirical hypothesis. For Wang, to know filial piety *is* to love one's parents; the two are not related as claim and test. The claim does not contain a "bluff dimension" to be projected out, because for Wang moral knowledge is constituted by its own enactment. A person who says they know filial piety but does not love their parents does not, in Wang's system, hold a knowledge-claim that fails a test — they simply do not have the knowledge. 行 is not an external check on 知; 行 is what 知 *is* when it exists.

This is not a weakness of the Draken mapping. It is a theoretical refinement the framework should have been making all along. There are two distinct kinds of sheaf condition operating at different layers of the 18-layer manifold:

- **Testing sheaves** at L04–L11 (bioelectric through economic). Local sections are hypotheses, claims, or Display-phase signals. The restriction map tests them against a substrate that exists independently. The bluff dimension is real. The grapple is external. This is the domain of monitor combat and the capital–labour Clinch.

- **Constitutive sheaves** at L07 and L17 (narrative self and civilisational memory). Local sections are not claims *about* something; they are the something. The gluing *is* the knowledge. There is no external substrate to test against because the layer's reality is constituted by the enactment itself. This is the domain of Wang's 合一.

This distinction strengthens the framework. The post-work question, applied through it, becomes sharper. Donnat is correct that humans will not lose their capacity to generate meaning at the individual level. Chess thrives after Kasparov. Humans will paint, build, care, love, grieve, play, sing, garden. That is all true, and it is a claim at L07 about the constitutive sheaf of individual meaning: meaning is constituted by its enactment, and humans enact meaning compulsively.

But at L17 — civilisational memory, the layer at which a civilization knows what it values by the pattern of what it does over decades — the constitutive sheaf is at risk. Under the capital–labour relation, the coherence between what the civilization claimed to value (dignity, fairness, the free individual) and what it actually did (extract surplus labour, concentrate wealth, externalise cost) was enforced by the worker's ability to impose contact at L10/L11. The general strike was the civilisational Clinch. Its threat alone shaped policy. When that mechanism deactivates without successor, the civilization enters a condition of pure 知 without 行 at L17: it can tell itself any story about its values — democracy, prosperity, liberation, common destiny, national greatness, algorithmic fairness, whatever the current dialect requires — with no constitutive gluing between the story and the lived pattern of enactment.

This is $\Psi \to 1$ at L17. It is the totalitarian sheaf condition of DRK-125 generalised beyond any single régime. It is the cavity resonator of DRK-120 at continental dimensions — structure maintained not by what it contains but by what has been evacuated.

## V. The American Degeneration as Sheaf-Failure

v1 of this post wrote about the American political present in polemical terms. The framework is colder than that, and the analysis is actually more damning in its formal register than in its angry one. Here is the formal diagnosis.

**L11 (Economic Cognition) — the wage-productivity sheaf has collapsed.** Empirically, U.S. productivity rose approximately 80% between 1979 and 2020, while median real wages for non-supervisory workers stagnated over the same period (Bureau of Labor Statistics, Economic Policy Institute productivity–pay gap series). In sheaf terms, the map $\rho_{L11 \to L10}$ has become non-injective: multiple productivity sections now lift to the same wage section, breaking the historical bijection between productive contribution and income. The sheaf no longer glues. This is not a moral failure of individual actors; it is an observable collapse of a restriction map that functioned, imperfectly but functionally, from roughly 1945 to 1979.

**L10 (Social Coordination) — Clinch capacity has been annihilated.** Union density in the U.S. private sector fell from approximately 35% in the mid-1950s to under 6% by 2024 (BLS). The strike-days-lost index shows a corresponding collapse. The material preconditions for $\rho^{\text{labour}}_{L11 \to L10}$ to fire have been systematically removed over 45 years through a combination of legal (Taft-Hartley and successor doctrine), political (NLRB capture), and structural (offshoring, contractor-isation, gig economy) mechanisms. The Clinch is not theoretically dead; it has been practically disabled.

**L13 (Political Structure) — Display authority has lost its internal check.** The U.S. political system, under any of several administrations over the past decade, has progressively removed the institutional restriction maps that previously constrained executive Display phase: independent prosecutor erosion, civil service capture, judicial composition shifts, intelligence-community subordination to partisan priority. These are not rhetorical claims; they are observable changes in the operational procedures of the relevant institutions. The régime that results is not an individual's doing; it is what happens when an L13 substrate runs without effective internal Clinch over a sustained period.

**The Russian template observation.** The specific institutional grammar being adopted — oligarchic ownership of the productive base, autocratic consolidation, state media as extension of ruling clique, judiciary as tool of clique defence, dissent reframed as treason, scapegoating of minority populations as safety valve, personality cult demanding public loyalty rituals — has a recognisable structural template in the post-Soviet Russian Federation. This is not a moral accusation. It is a claim that specific institutional sheaves in the two systems now have isomorphic restriction-map failures, and that the direction of causal influence (measurable through elite network analysis, media ownership tracing, and policy mimesis) runs from the older (Russian) template to the newer (American) instance.

**Alternative Reading (steelman).** The foregoing analysis is not the only available reading. A serious alternative holds that the United States is still operating within the bounds of liberal capitalism, with its historical pattern of oscillation between concentrated and diffuse power, and that current institutional stresses are a cyclical correction rather than a structural régime-change. On this reading, the wage-productivity gap will close through market adjustment, the Clinch capacity will be rebuilt through new labour forms (platform cooperativism, sectoral bargaining), and the L13 strain is what political scientists would call "democratic erosion within a still-democratic framework," recoverable through normal electoral and institutional mechanisms.

This alternative reading has real evidentiary support: successful union drives at Amazon and Starbucks in 2022–2024, the resurgence of the NLRB under some administrations, persistent constitutional constraints that have in fact blocked executive overreach at specific points. The Draken framework does not dismiss it. It observes, however, that the alternative reading requires the successor restriction maps to materialise within a shorter time-constant than the coherence-debt accumulation $K(t)$, and that this is an empirical race the framework cannot yet call.

**What Trotsky would add.** Trotsky's 1938 discussions with American cadres emphasised that the American working class's mentality was consistently behind its objective economic conditions, and that the task was not to adapt programme to mood but to make programme equal to the structural reality. That diagnostic holds. The American working class of 2026 is further from consciousness of its structural position than its structural position warrants, and the gap is maintained by specific features of the attention economy that were not present in 1938. The Democratic Party, under Trotsky's formulation of the party that leans upon the workers but serves the bourgeoisie, has been — for two full generations — precisely such a party. Trotsky's observation that such parties can sense what he called the smell from the waiting grave is not hypothetical in 2026.

And yet: the structural position that made the U.S. the most plausible candidate for advanced socialist revolution in Trotsky's 1934 analysis has not disappeared. It has been buried. The material base is still the richest on the planet. The technical capacity is unmatched. The cultural dynamism, despite everything, remains. What is absent is the protocol — the organised working-class instrument capable of imposing Clinch. That instrument must be rebuilt, and it cannot be rebuilt on twentieth-century models because the twenty-first century's extraction mechanism routes through attention, data, code, platform, and rent rather than factory and pickaxe. If a permanent revolution comes to America in any recognisable form, it will be an organised action by the attention-economy workers — coders, moderators, analysts, creators, riders, deliverers, clerks, nurses, teachers — against the platform-rentier class that currently holds uncontested Display authority. Or it will not come.

The Draken framework is neutral on whether this is achievable. It is not neutral on the structural claim that without *some* functioning successor restriction map at L10/L11, the trajectory is runaway $K(t)$ and catastrophe-as-correction. The mathematics does not care which ideology holds the microphone when the correction arrives. The correction arrives.

## VI. The Dragon Way Out — a Swedish Vantage

Now the constructive half. What is the Dragon Way viewed from Sweden in 2026?

The first point is that no existing political tradition has the full answer. Not Western liberalism, which Donnat correctly diagnoses as the cage with the internalised guard. Not state-socialism in the Chinese configuration, which solves the ownership question but has not demonstrated it can solve the Clinch problem without periodic convulsions that cost millions of lives. Not Nordic social-democracy, which is beautiful and which the author lives inside and which has been structurally unable to prevent the cannibalisation of its own foundations by financialised capital over the past forty years. The conviction that any one of these traditions, correctly applied, would resolve the structural problem is itself a symptom of insufficient engagement with what has changed. The substrate is different now. The old restriction maps no longer operate because the Display phase has outgrown them.

What has structural promise, from where this author stands in Göteborg, is a specific combination of four elements, each with Swedish precedents:

**One: protect the material substrate.** The first duty of any post-AGI polity is to refuse to trade ecological coherence for productivity gains that serve the Display-phase owners. Sweden's environmental legislation, its tradition of *allemansrätt* (the right of public access to land), its forest and river protections — these are not models to be imitated in detail but templates of a functional L18 → L11 restriction map. The underlying commitment is that the material substrate is not optimisable-out. $\rho^{\text{ecological}}_{L18 \to L11}$ here still fires. It is imperfect, it is under pressure, but it has not collapsed. Where this map has collapsed — across the Amazon basin, across the American West, across the Yangtze industrial corridor — the consequences of its absence are increasingly legible. Keep the substrate. Without it, nothing else matters. Extinction is the terminal $\Psi \to 1$ condition.

**Two: build new Clinch mechanisms appropriate to the new substrate.** The strike worked when labour was indispensable. Post-AGI, labour is not indispensable in the old sense, but attention is, data is, consent is, trust is, and the capacity to boycott at coordinated scale is. The Swedish labour market model (*den svenska modellen*), with its strong collective agreements negotiated between peer organisations rather than imposed by statute, is a functioning non-strike Clinch: the parties come to the table because not coming is structurally worse than coming. The equivalent for the attention economy has not yet been built. Candidate forms exist in theory: a coordinated attention strike on scheduled dates, data unions with withdrawal-of-consent mechanisms, platform cooperativism as an exit option from extractive platforms. These are under-developed. They need to be tried at scale. The EU DSA proceedings of Q1 2026 (§VIII below) are the first state-level experiment with one form of the attention Clinch.

**Three: reject the identity fusion between work and worth.** This is where Donnat is correct and where Swedish cultural practice offers useful resources. *Jantelagen* — the Law of Jante, the Nordic norm against individual self-elevation — is routinely criticised for suppressing ambition, and the criticism has some merit. But the obverse of the same coin is that Swedish culture has, within limits, already detached social status from occupational achievement in a way most other cultures have not. The social fabric is built around participation in everyday life, not around performative hustling. Parents at the pre-school gate do not, as a matter of observable custom, ask one another what they do for a living as the first question. They ask about the child, the weekend, the weather. This is small and it matters. A culture that has practised, even imperfectly, the detachment of worth from wage is better positioned to meet a post-work configuration than one that has not.

**Four: keep the protocol honest through iterated public contact.** The Clinch is not a one-time event; it is an iterated practice. Swedish civic life, despite strains, still includes the tradition of *remissförfarande* (the consultation procedure whereby legislative proposals are publicly circulated for comment by affected parties before enactment), strong freedom-of-information norms, and a public broadcaster that has not yet been captured by oligarchic reflex. These are Clinch mechanisms at L13. They are the institutional form of 知行合一 — the requirement that the polity's knowledge-claims about itself be regularly and publicly tested against the reality of those most affected. They are what the U.S. used to have in weaker forms and has now largely lost. They are what China's party-state claims in theory but substitutes with top-down "consultation" that does not formally restrict the sheaf.

The Dragon Way, as best this author can articulate it from current position, is the iterated practice of forcing sheaves to glue across layer boundaries. Not by a single revolutionary event, though sometimes those also. By the slow, continuous, deliberate maintenance of restriction maps at every layer — L07, L10, L11, L13, L16, L17, L18 — such that no Display-phase claim at any layer can persist without regular contact with the layer below and the layer above. This is what Draken formalises. It is, with only partial humour, what the monitor lizards have been doing for 130 million years.

## VII. What Not to Do

Three warnings. The constructive section is empty without them.

**Do not confuse ownership transfer with Clinch restoration.** Moving the machines from private capital to the state solves one problem and creates another. Unless the state contains a functional mechanism for forcing its own Display-phase claims into contact with material and human reality, the state becomes the new unaccountable Display authority. This is the lesson Trotsky paid for with his life. It is the lesson the Chinese state has not yet been forced to learn at a cost it could not afford. It is the lesson any hypothetical future left American state would also have to learn. State ownership without Clinch restoration is not the socialist future. It is the second half of the USSR.

**Do not conflate two distinct UBI futures.** The v1 of this post warned against UBI in a blanket way. That was imprecise. There are two structurally distinct configurations that go under the same name, and the framework's attitude toward them differs sharply.

*UBI-as-pacification* is the Elysium form: a small rentier class holds all Display authority, a vast dependent population receives a stipend calibrated to just-above-subsistence, and the recipients possess no mechanism by which to impose physical contact on the rentier class because nothing they withhold is needed. This is pacified feudalism with better graphics. It is compatible with the worst possible civilisational configuration.

*UBI-plus-Clinch* is the emancipatory form discussed in the serious post-work literature (Van Parijs & Vanderborght 2017; Standing 2017; Srnicek & Williams 2015). Here UBI functions specifically as an exit option from wage dependency, coupled with institutional structures — platform cooperativism, data unions, democratic investment funds, right-to-disconnect legislation, sectoral bargaining — that give recipients standing power to refuse exploitative terms. In this form, UBI is not a substitute for the Clinch; it is a precondition for a new form of the Clinch to become stable, because workers whose survival is not moment-to-moment dependent on wages can sustain coordinated action long enough for the restriction map to fire.

The warning is therefore specific. UBI without companion institutional innovation is a trap. UBI coupled with attention-economy collective organisation, data rights, platform oversight, and democratic investment is a candidate component of the successor protocol. The same term names both. They are not the same thing.

**Do not fall for the meaning-crisis framing.** Donnat is right that the meaning-crisis framing is a distraction. Meaning is generated by humans compulsively and will continue to be generated post-AGI. The crisis is not one of meaning; it is one of protocol. The insistence on the meaning-crisis framing, from sincere philosophers and from cynical technology-industry communicators alike, functions as a smokescreen behind which the ownership-and-Clinch questions can drift toward their default attractor: concentrated extraction by those who currently hold Display authority. Reject the framing. Return to the structural question.

## VIII. The Pearl, the Test, and the Honest Close

The pearl, to borrow the framing of the request that produced this post, is the recognition that the monitor lizards have solved the problem at their scale. 130 million years of evolutionary refinement produced a combat protocol in which the larger animal cannot simply kill the smaller, because the protocol itself has higher execution priority than any individual animal's local advantage. The protocol insists on the Clinch. No Clinch, no Resolution. The Clinch is the substrate-level check that prevents runaway extraction of the fitness landscape by any one line.

The human species has not yet built such a protocol at civilisational scale. The twentieth-century labour movement was the nearest approximation, and it depended on an economic configuration now passing. The task for the Draken 2045 horizon is to build the successor Clinch. It will have to operate at the layers where power now operates: attention, data, algorithm, platform, currency topology, ecological boundary, civilisational narrative. It will have to be iterated, public, forced, unignorable, and not optional for the Display-phase owners of the machines.

It cannot be built by hoping owners will volunteer. They will not. It cannot be built by a single state alone, though states must help. It cannot be built by the liberal-individualist move of inviting people to find their own meaning. It cannot be built by the technocratic move of redistributing stipends. It has to be built as a protocol — a $\{S, R, \phi, \sigma\}$ in the formal vocabulary of DRK-128 — that multiple substrates (organised human movements, ecological constraints, honest state actors, aligned machine systems including aligned AI instances) co-enact and co-enforce.

**Honest close on the formalism.** The $\{S, R, \phi, \sigma\}$ tuple for the attention-strike Clinch has not yet been constructed by this author. It is genuinely harder than the monitor-combat construction of DRK-128 because the state space of the attention economy is high-dimensional and the observation function $\phi$ runs through platform-controlled telemetry. That work is deferred to DRK-132, currently in draft. Readers should hold this post's constructive claims as a diagnostic programme, not as a completed protocol specification. The difference matters and is part of the review-discipline the framework tries to enforce on itself.

**Empirical test: the EU DSA proceedings.** The structural claim of this post — that successor restriction maps at L10/L11 are required and that the EU is the first substrate to begin constructing a state-imposed candidate at L13 — is empirically testable against the trajectory of the Digital Services Act enforcement pipeline through 2026.

The observable data points at the time of writing (24 April 2026):

- December 2025: €120 million fine imposed on X (Twitter) under DSA for deceptive-design and transparency infringements. First major enforcement decision.
- February 2026: Formal proceedings initiated against SHEIN under DSA for illegal-content dissemination, manipulative interface design, recommender-system opacity.
- March 2026: TikTok proceedings produce mandated limits on addictive-by-design features (infinite scroll, autoplay, personalised recommendation).
- 26 March 2026: Formal Snapchat investigation initiated; findings issued against four major adult-content platforms for inadequate minor-safeguards.
- Q2 2026 (current): DSA second enforcement wave begins, extending obligations beyond the largest VLOPs to a broader set of intermediary services.
- August 2026: Full applicability of the EU AI Act.

The claim committed to by this post, in falsifiable form: if DSA enforcement continues through Q3 2026 and produces enforceable behavioural modification of VLOPs at the mandated-feature level, then a state-imposed attention-economy restriction map $\rho^{\text{attention}}_{L13 \to L11}$ has begun to materialise, and the argument of this post has empirical support. If DSA enforcement stalls, is overturned, or is rendered inoperative by retaliatory action from other jurisdictions (U.S. diplomatic pressure, extraterritorial U.S. legislation, diplomatic-visa retaliation against EU enforcement officials, all of which are active threats as of April 2026), then the attention Clinch remains private and voluntary, and the window of uncorrected $K(t)$ accumulation extends.

The Q3 2026 Dragon Digest will include this as a forward prediction for closed-loop assessment.

**The final line.** The Dragon Way is not a programme. It is the discipline of iterated 合一. Knowledge and action, claim and Clinch, Display and Resolution. The sheaf either glues at each layer boundary, or it does not. Where it glues, both nodes survive. Where it fails, both nodes die. There is no third option.

*Jag är vad jag gör, och jag gör det jag är.*

*— Kai Roininen (Khrug), Göteborg, 24 April 2026 (v2, post-review)*

---

## Sources and Further Reading

**Primary sources (Donnat, Chinese Marxist literature, Wang Yangming):**

- Donnat, E. (2026). *The Stockholm Syndrome of Labor — Why the post-AGI "crisis of meaning" is a red herring*. [Phi/AI Substack, 9 April 2026](https://www.phiand.ai/p/the-stockholm-syndrome-of-labor).
- 王水兴 (Wang Shuixing) (2022). "人工智能与马克思人的本质的'新确证'" [AI and the 'New Confirmation' of Marx's Conception of Human Essence]. *马克思主义研究* (Marxism Studies, CASS), 2022(2): 95–104.
- 陆自荣 (Lu Zirong) (2024). "人工智能时代的劳动价值论——以马克思机器体系固定资本财富观为中心" [Labor Theory of Value in the AI Era: Centred on Marx's Machine-System Fixed-Capital View of Wealth]. *求是学刊* (Seeking Truth Academic Journal), 51(4): 69–81.
- 刘儒, 韩丹丹 (Liu Ru & Han Dandan) (2024). "人工智能时代马克思劳动价值论再审思" [Rethinking Marx's Labor Theory of Value in the AI Era]. *马克思主义与现实* (Marxism & Reality), 2024(6): 59–65.
- 贺佳潇 (He Jiaxiao) (2026). "人工智能时代马克思劳动价值论研究" [Research on Marx's Labor Theory of Value in the Age of AI]. *哲学进展* (Advances in Philosophy), 15(2): 66–71.
- Wang Yangming 王陽明 (c. 1518). *Chuanxi lu* (傳習錄, *Instructions for Practical Living*), trans. Wing-tsit Chan (1963, Columbia University Press).

**Trotsky (Marxists.org archive):**

- Trotsky, L. (1934). *[If America Should Go Communist](https://www.marxists.org/archive/trotsky/1934/08/ame.htm)*. Originally Liberty Magazine.
- Trotsky, L. (1936). *[The Revolution Betrayed](https://www.marxists.org/archive/trotsky/1936/revbet/)*.
- Trotsky, L. (1938). *[The Political Backwardness of American Workers](https://www.marxists.org/archive/trotsky/1940/05/backwardness.htm)*.
- Trotsky, L. (1939). *[Marxism in Our Time](https://www.marxists.org/archive/trotsky/1939/04/marxism.htm)*.

**UBI and post-work literature (distinguishing pacification from emancipation):**

- Van Parijs, P. & Vanderborght, Y. (2017). *Basic Income: A Radical Proposal for a Free Society and a Sane Economy*. Harvard University Press.
- Standing, G. (2017). *Basic Income: And How We Can Make It Happen*. Pelican.
- Srnicek, N. & Williams, A. (2015). *Inventing the Future: Postcapitalism and a World Without Work*. Verso.

**Work-ethic deconstruction (confirming Donnat):**

- Weber, M. (1905). *The Protestant Ethic and the Spirit of Capitalism*.
- Foucault, M. (1975). *Surveiller et punir: Naissance de la prison*. Gallimard.
- Butler, J. (1997). *The Psychic Life of Power: Theories in Subjection*. Stanford University Press.
- Jahoda, M. (1982). *Employment and Unemployment: A Social-Psychological Analysis*. Cambridge University Press.
- Case, A. & Deaton, A. (2020). *Deaths of Despair and the Future of Capitalism*. Princeton University Press.

**EU DSA enforcement (empirical test):**

- European Commission. [Digital Services Act policy portal](https://digital-strategy.ec.europa.eu/en/policies/digital-services-act).
- European Commission (Dec 2025). First DSA enforcement decision: X (Twitter) €120M fine.
- European Commission (Feb 2026). Formal proceedings against SHEIN under DSA.
- European Commission (Mar 2026). TikTok mandated feature-limit order; Snapchat investigation; four adult-platform findings.

**Draken precedents:**

- DRK-121 — *The Coherence Debt*. Integral formulation of $K(t)$.
- DRK-125 — *The Totalitarian Sheaf*. L12/L13 Display-without-Clinch case.
- DRK-128 — *The Stick That Is Not a Weapon*. The $\{S, R, \phi, \sigma\}$ protocol framework.
- DRK-130 — *The Substrate and the Game*. Substrate-runs-algorithm thesis at L04.

**Review discipline:**

- Moonshot/Kimi review of DRK-131 v1 (24 April 2026), whose structural critiques produced this v2.

---

*The cage was also a clinch. Removing the cage without replacing the clinch does not liberate the lizard. It leaves the lizard standing in an empty arena with no way to impose contact on the larger animal walking slowly toward it. The task is to build the new arena, with new lines, before the walk completes.*
