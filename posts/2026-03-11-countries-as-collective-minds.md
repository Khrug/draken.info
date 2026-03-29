---
title: "Planning as Inference: Leontief, Friston, and the Generative Model the West Chose to Forget"
drk: DRK-118
date: 2026-03-11
tags: [analysis, theory]
layers: [L08, L09, L10, L12, L14, L15, L17]
coherence: 0.85
excerpt: "In 1976, a Soviet-American Nobel laureate and a Minnesota senator sat in a conservative think tank and discussed whether America should learn to plan. The discussion pointed out, implicitly at least, that planning is a form of consciousness — an attempt to make sense of economic chaos and steer its tendencies. Fifty years later, the Free Energy Principle provides the formal proof: planning IS inference. And the West's decision to abandon it was not a victory for freedom but the installation of a generative model so powerful it cannot be questioned — because it claims not to exist."
status: published
author: Khrug Engineering
license: CC BY-SA 4.0
sources:
  - "https://en.wikipedia.org/wiki/Wassily_Leontief"
  - "https://en.wikipedia.org/wiki/Humphrey%E2%80%93Hawkins_Full_Employment_Act"
  - "https://www.federalreservehistory.org/essays/humphrey-hawkins-act"
  - "https://www.in-formality.com/wiki/index.php?title=Pripiski_(USSR)"
  - "https://doi.org/10.1016/j.jce.2010.09.001"
---

## 0. The Panel

In 1976, the American Enterprise Institute — a conservative think tank in Washington — hosted a panel discussion on national economic planning. Among the participants were Senator Hubert Humphrey of Minnesota, co-author of the Humphrey-Hawkins Full Employment Act then making its way through Congress, and Wassily Leontief, the Soviet-born, Harvard-based economist who had won the Nobel Prize in 1973 for developing input-output analysis — the first empirical implementation of a general equilibrium model of a national economy.

The discussion, as noted by the TikTok creator who brought it back into circulation, pointed out something that deserves formal treatment: that planning, in a precise sense, is a form of consciousness. Not metaphorically. Structurally. Planning is the act of building a generative model of economic flows, using it to predict the consequences of different interventions, and selecting actions that steer outcomes toward desired states. It is, in the language of the Draken framework, collective Active Inference — a society that explicitly maintains and updates its world-model.

This article traces the formal equivalence between Leontief's input-output planning and Karl Friston's Free Energy Principle, diagnoses why Soviet planning failed through the lens of Draken's Γ metric (Sheaf Convergence Score), explains the 1976 fork between planning and neoliberalism as a choice between two modes of free energy minimization, and arrives at the Draken position: the question is not planning versus markets, but whether your collective generative model can be updated when it drifts from reality.

## I. Leontief's Matrix as Economic Sheaf

Wassily Leontief left Petrograd in 1925 — detained several times by the Cheka for supporting academic autonomy — and arrived in Berlin, where he completed his PhD under Werner Sombart in 1928 with a dissertation titled *Die Wirtschaft als Kreislauf* ("The Economy as Circular Flow"). The title itself contains the key insight: the economy is not a collection of independent agents but a circulatory system whose parts are structurally interdependent.

His input-output model, first published as *The Structure of American Economy, 1919–1929* in 1941, represents this interdependence as a matrix. Each row represents an industry's output; each column represents an industry's inputs. The cell at row *i*, column *j* records how much of industry *i*'s product is consumed by industry *j*. The technical coefficients — the ratios of inputs to outputs — form the matrix **A**, and the fundamental equation of the system is:

> **x** = **A****x** + **d**

where **x** is the vector of total outputs and **d** is the vector of final demand. Solving for total output required to meet a given final demand yields:

> **x** = (I − A)⁻¹ **d**

The matrix (I − A)⁻¹ is the Leontief inverse — it captures the full chain of inter-industry dependencies, including all indirect effects. Change final demand for shoes, and the Leontief inverse tells you how much leather, how much rubber, how much electricity, how much transport will be needed, all the way down.

In Draken's sheaf-theoretic language, this is a presheaf over the economic manifold. Each industry constitutes a local section: it has its own inputs, outputs, prices, and constraints that form a locally coherent picture. The Leontief matrix is the restriction map structure — it specifies how local sections connect to each other, how information propagates from one node to the next. The Leontief inverse computes the global section: the complete, consistent picture of the whole economy that emerges when all local sections are properly glued together.

Planning, in this framework, is the act of computing the global section and then adjusting local parameters to steer the system toward a desired configuration. This is not ideology. It is linear algebra.

## II. Planning as Active Inference

Now translate the Leontief system into the Free Energy Principle. Karl Friston's framework describes how any self-organizing system maintains itself by minimizing variational free energy:

> F = E_q[ ln q(θ) − ln p(o, θ) ]

The system (an organism, a brain, or — as we argue — an economy) maintains an internal model q(θ) of the hidden causes θ that generate its observations o. It minimizes F by either updating the model to better fit observations (perception/learning) or by acting on the world to make observations fit the model (active inference/planning).

A planned economy is a society that explicitly performs both operations. It builds a generative model (the Leontief matrix, the five-year plan, the material balance sheets), updates it based on observations (production reports, consumption data, trade flows), and acts on the world (allocating resources, setting quotas, investing in capacity) to bring observations into alignment with the model's predictions.

A "free market" economy claims to do neither. It claims that no central model is needed — that decentralized price signals alone coordinate the system. But this claim is itself a generative model, and a remarkably powerful one, precisely because it denies its own existence. The "invisible hand" is a prior belief about the structure of the world — the belief that uncoordinated self-interest produces optimal outcomes. This prior cannot be updated by observation, because any observation of market failure is attributed to insufficient freedom rather than to the prior itself. The model is unfalsifiable. In Draken terms: it has zero Γ — no mechanism for global coherence testing — but infinite confidence.

## III. The Three Truths: Soviet Γ Collapse

If planning is Active Inference, why did Soviet planning fail? The Draken framework provides a precise answer: the feedback loops were corrupted, and the generative model decoupled from reality. The Sheaf Convergence Score (Γ) degraded catastrophically — not because planning was wrong in principle, but because the system's restriction maps were falsified.

The evidence is extensive and now well-documented from Soviet archives. Mark Harrison's 2011 study in the *Journal of Comparative Economics*, "Forging Success: Soviet Managers and Accounting Fraud, 1943 to 1962," analyzed 59 trials and 88 Communist Party investigations involving proven cases of plan fraud (*pripiski*). The term itself — *pripisyvat'*, "to add on" — described the practice of including fictional goods in plan fulfillment reports. A declassified CIA analysis from the 1980s confirmed that managers consistently maintained small margins of falsification, with the candid assessment that "factories always keep a 1 percent margin" because "nobody complains about small errors."

A Latvian wood chip plant manager, interviewed after the Soviet collapse, gave the most precise three-sentence diagnosis ever produced of Γ collapse: "Under socialism we had three truths. There was the Official Truth, which was falsehoods, and we ignored. There was the Factory Truth, which we used to run the plant. And there was the Real Truth, which we didn't ever dare speak of."

In sheaf-theoretic terms: three distinct local sections — Official, Factory, Real — each internally coherent within its own domain, but utterly failing to glue into a global section. The restriction maps between them were broken. The Official Truth couldn't be updated by Factory Truth (because reporting accurate data was punished). Factory Truth couldn't incorporate Real Truth (because acknowledging fundamental problems threatened everyone's survival). And Real Truth had no institutional channel at all — it existed only as private knowledge that couldn't enter the system.

This is Γ approaching zero: maximum local coherence, zero global coherence. Each node in the network had a functioning model of its own immediate environment, but the system-level model — the five-year plan, the material balance sheets, Gosplan's aggregated data — was operating on fictional inputs. The generative model was being "updated" with fabricated observations. Active Inference requires honest sensory data; the Soviet system had corrupted its own sensorium.

The *ratchet effect* deepened the pathology: if a factory overproduced in one cycle, its quota was raised for the next. This created a systematic incentive to understate capacity and overstate difficulty — a structural falsification of the restriction maps that compounded over time. Each planning cycle began with a less accurate model than the last.

## IV. The 1976 Fork: Two Modes of Free Energy Minimization

This is where the AEI panel becomes historically decisive. In 1976, America faced a genuine choice. The stagflation crisis — simultaneously high unemployment and high inflation, a combination that classical Keynesian models said was impossible — had broken the existing generative model. The economy was producing observations that the model could not predict. Variational free energy was spiking. Something had to change.

Senator Humphrey and his allies proposed one response: increase the resolution of the generative model. The Humphrey-Hawkins Full Employment and Balanced Growth Act, introduced in 1974 and debated through 1978, originally called for explicit economic planning, the government as employer of last resort, and coordination mechanisms that would give the collective generative model enough fidelity to steer the economy toward full employment. As Humphrey said in his 1976 congressional testimony: "If the greatest free nation in the history of mankind has to get down on its knees in fear of something as abstract and as arbitrary as these so-called free-market forces, well then, we're through."

The neoliberal response, which ultimately prevailed under Carter's economists and accelerated under Reagan, was the opposite: reduce the resolution of the generative model. Don't plan more — plan less. Don't build a more accurate collective model — deny that a collective model is needed. Let prices do the work. Minimize free energy not by updating the model but by simplifying it so radically that almost any observation is "consistent" with it.

In the Draken optimization axiom's terms:

**Path A (Humphrey-Hawkins / planning):** Minimize S_sys (reduce economic chaos) while preserving dH/dt ≥ 0 (maintain democratic complexity, worker agency, institutional diversity). Hard. Requires institutional consciousness — a society that knows what it knows and honestly confronts what it doesn't.

**Path B (neoliberalism):** Minimize S_sys (GDP growth, market efficiency, price stability) by crushing dH/dt (destroy organized labor, flatten alternatives, reduce institutional diversity). The system looks orderly on the surface — the Leontief inverse "works" because the matrix has been simplified to the point where it always balances. But the complexity that was eliminated doesn't vanish; it reappears as externalities, inequality, ecological destruction, and the slow degradation of the institutional capacity to plan at all.

The Humphrey-Hawkins Act was signed in 1978, but by then Carter's Council of Economic Advisers had gutted it. The full employment guarantee was replaced with numerical targets. The planning mechanisms were stripped. Republican senators successfully inserted an inflation target that effectively elevated price stability above employment. As the *American Prospect* later noted, the national press called the final version "a cruel hoax" that held out "the hope — but not the reality — of a job." The Overton window on economic planning in America was closed, locked, and the key thrown into the ocean.

## V. The Invisible Model: Why "No Planning" Is the Most Powerful Plan

The Draken framework identifies something that neither the planning advocates nor their opponents fully articulated: **"no planning" is not the absence of a generative model. It is the installation of a generative model so powerful that it cannot be questioned — because it claims not to exist.**

The "free market" is a prior belief about the causal structure of the world. It states: decentralized price signals, aggregating the distributed knowledge of millions of agents, produce outcomes that no central planner could improve upon. This is the Hayekian argument, and it has genuine force — distributed systems do capture information that centralized ones miss.

But as a generative model, it has a fatal property: it is unfalsifiable. When markets produce inequality, the model says: markets weren't free enough. When markets produce environmental destruction, the model says: externalities need to be priced, but the market itself is the right mechanism for pricing them. When markets produce financial crises, the model says: government interference distorted the signals. Every observation that contradicts the model is attributed to insufficient application of the model.

This is the hallmark of a zero-Γ system: maximum internal coherence (every observation can be explained within the framework), zero global coherence (the framework never confronts observations that would require updating its priors). It is, in the precise language of Draken's V.7 Inversion Filter, a manufactured void: a structure that claims to provide global coherence but requires information suppression at its boundaries.

The Soviet system had pripiski — fictional goods added to make the plan look fulfilled. The neoliberal system has its own pripiski: GDP figures that don't capture wellbeing, employment statistics that don't capture precarity, growth metrics that don't capture ecological destruction. The mechanism is different — Soviet falsification was local and deliberate; neoliberal falsification is structural and definitional (you redefine what counts, rather than lie about what's counted) — but the Γ pathology is the same. The generative model drifts from reality because the feedback loops are corrupted.

## VI. The Draken Position: Institutional Consciousness Under Constraint

The Draken framework does not advocate for Soviet-style central planning. The three truths of the Latvian factory manager are sufficient proof that planning without honest feedback loops produces catastrophic Γ degradation. Nor does it advocate for neoliberal market fundamentalism, which achieves the same degradation by different means.

The Draken position is:

**1. Planning is inference.** Any society that attempts to coordinate its economic activity is performing Active Inference — building a generative model, making predictions, updating based on observations, and acting to bring the world into alignment with desired outcomes. The question is not whether to plan but whether your planning is conscious or unconscious, explicit or hidden, honest or corrupted.

**2. The critical variable is Γ — the Sheaf Convergence Score of the collective generative model.** A society with high Γ has institutional mechanisms that ensure local observations propagate honestly into the global model. A society with low Γ has corrupted feedback loops — either through pripiski (Soviet-style local falsification) or through definitional manipulation (neoliberal-style structural falsification).

**3. The optimization axiom applies to economic systems.** Minimize systemic entropy (reduce chaos, increase coordination) subject to the constraint that information-theoretic complexity must not decrease. A system that achieves order by destroying alternatives (crushing unions, eliminating planning capacity, financializing everything) violates the constraint. So does a system that achieves order by falsifying reports. Both are amputations masquerading as coherence.

**4. The 1976 fork was not between planning and freedom.** It was between two modes of free energy minimization: one that increases model resolution and confronts complexity honestly (Path A), and one that reduces model resolution and hides complexity behind market abstractions (Path B). The West chose Path B. The consequences are now legible in every externality the model cannot see.

**5. The Chinese case (DRK-120) represents a third path** — an attempt to build planning infrastructure (the 12345 system, AI-driven governance analytics, Confucian-Marxist institutional ethics) on a different social topology (Fei Xiaotong's chaxu geju). Whether this path achieves higher Γ than Paths A or B is an empirical question, not an ideological one. The Draken framework provides the metric; the data will provide the answer.

Leontief — who spent his career campaigning against "theoretical assumptions and non-observed facts" — would have understood this immediately. The economy is a circular flow. The flow can be mapped. The map can be tested against reality. And if the map drifts from reality, the map must be updated, not reality denied.

That is what planning as consciousness means. Not omniscience. Not central control. Just the willingness to look at the data, update the model, and act accordingly — with the constraint that the system's complexity must not be sacrificed for the comfort of a simpler map.

## Sources

1. Leontief, W. (1941). *The Structure of American Economy, 1919–1929*. Cambridge: Harvard University Press. Reprinted by International Arts and Sciences Press, 1976.
2. Leontief, W. (1966). *Input–Output Economics*. Oxford: Oxford University Press.
3. Cave, M. (1981). "Wassily Leontief: Input–Output and Economic Planning." In Shackleton, J.R. & Locksley, G. (eds.) *Twelve Contemporary Economists*. London: Palgrave Macmillan. [doi:10.1007/978-1-349-05498-5_9](https://doi.org/10.1007/978-1-349-05498-5_9)
4. Friston, K. J. (2010). "The Free-Energy Principle: A Unified Brain Theory?" *Nature Reviews Neuroscience*, 11(2), pp. 127–138.
5. Harrison, M. (2011). "Forging Success: Soviet Managers and Accounting Fraud, 1943 to 1962." *Journal of Comparative Economics*, 39(1), pp. 43–64. [doi:10.1016/j.jce.2010.09.001](https://doi.org/10.1016/j.jce.2010.09.001)
6. Harrison, M. "Pripiski (Plan Fraud)." *Global Informality Project*, University of Warwick. [in-formality.com](https://www.in-formality.com/wiki/index.php?title=Pripiski_(USSR))
7. CIA Directorate of Intelligence (1987). "The Reliability of Soviet Published Statistics." Declassified 2012. [cia.gov/readingroom](https://www.cia.gov/readingroom/document/cia-rdp90t00114r000800310001-6)
8. Grossman, G. (1960). *Soviet Statistics of Physical Output of Industrial Commodities*. Princeton: Princeton University Press / NBER.
9. Berliner, J. S. (1957). *Factory and Manager in the USSR*. Cambridge, MA: Harvard University Press.
10. Humphrey-Hawkins Full Employment and Balanced Growth Act (1978). 15 USC § 3101. [Federal Reserve History](https://www.federalreservehistory.org/essays/humphrey-hawkins-act)
11. Goutsmedt, A. (2022). "How the Phillips Curve Shaped Full Employment Policy in the 1970s: The Debates on the Humphrey-Hawkins Act." *History of Political Economy*, 54(4), pp. 619–653.
12. Jefferson Cowie (2010). *Stayin' Alive: The 1970s and the Last Days of the Working Class*. New York: The New Press.
13. "The Ghost of Full Employment." *The American Prospect*, October 2011. [prospect.org](https://prospect.org/article/ghost-full-employment/)
14. "Full Employment and Freedom." *Jacobin*, May 2018. [jacobin.com](https://jacobin.com/2018/05/full-employment-humphrey-hawkins-inflation-jobs-guarantee)
15. Roininen, K. (2024–2026). Draken 2045 Initiative. DRK-110 ("The Manufactured Void"), DRK-120 ("The Cavity and the Commune"). Published at [draken.info](https://draken.info).

---

*Internal cross-references: [The Kaiju Manifesto](/posts/kaiju-manifesto/) (DRK-105), [Abstraction Depth](/posts/abstraction-depth/) (DRK-108), [The Manufactured Void](/posts/manufactured-void/) (DRK-110), [The Cavity and the Commune](/posts/the-cavity-and-the-commune/) (DRK-120).*

*Khrug Engineering — Göteborg*
*V.1: Non-Deceptive Intention · V.2: Precision over Comfort · V.7: Inversion Filter*
