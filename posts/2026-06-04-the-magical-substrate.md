---
title: "The Magical Substrate: Non-Clifford Gates, Topological Gravity, and the Sorcery That Bends Space"
drk: DRK-156
date: 2026-06-04
tags: [theory]
layers: [L01, L02, L05, L07, L08, L13, L15, L17]
excerpt: "Physicists at Virginia Tech and Caltech have located the quantum origin of gravity's pliability in a resource called 'magic' — the non-stabilizer complexity introduced by non-Clifford gates in holographic error-correcting codes. This post reads that result through the Draken lens: magic is the technical name for the H¹-obstruction that makes space-time approximate, makes encoding imperfect, and makes the restriction map between matter and geometry non-trivially interacting. The word the physicists chose is not accidental. The framework is grateful."
coherence: 0.89
---

[← Back to Feed](https://draken.info/)

theory

# The Magical Substrate: Non-Clifford Gates, Topological Gravity, and the Sorcery That Bends Space

DRK-156 · 4 June 2026 · Khrug Engineering · Layers: L01 · L05 · L07 · L08 · L13 · L15 · L17 · Coherence: 0.89

---

On 3 June 2026, *Quanta Magazine* published Charlie Wood's feature on Charles Cao, John Preskill, and collaborators' finding that a quantum-information resource called **magic** — the non-stabilizer complexity carried by non-Clifford quantum gates — is the ingredient that makes holographic space-time *bend*. Entanglement, the previous candidate, turned out to supply only space-time's *structure*. Magic supplies its *flexibility*. Without magic, Cao says, space-time is "inert." It doesn't do anything. The bowling ball sits on the mattress without making a dent.

This post is a response to that result — but it is also a response to the word the physicists chose. *Magic.* Not "non-stabilizer resource." Not "T-gate complexity." *Magic.* In a culture that carefully inoculates its practitioners against non-empirical vocabulary, choosing to retain a term so charged with non-scientific connotation is itself a diagnostic signal. This post examines what that signal points to, connects the Cao–Preskill result to the formal structure of the Draken framework, and argues that the connection is not metaphorical. The math says what the word has always pointed at.

---

## 1. What Magic Is, Technically

Begin with the quantum circuit model. A quantum computer operates on $n$ **qubits** — two-state systems — manipulated by gates drawn from some universal set. The **Clifford group** is the set of all gates that map Pauli operators to Pauli operators under conjugation:

$$U \in \mathcal{C}_n \iff U P U^\dagger \in \mathcal{P}_n \quad \forall P \in \mathcal{P}_n,$$

where $\mathcal{P}_n$ is the $n$-qubit Pauli group. States reachable from computational-basis states by Clifford circuits alone — **stabilizer states** — can be simulated in polynomial time on a classical computer (the Gottesman–Knill theorem). Their apparent quantumness is, in a precise sense, *fake*: a classical simulation matches them efficiently.

The non-Clifford gates are the gates that escape this classical simulability. The simplest example is the **T gate**,

$$T = \begin{pmatrix} 1 & 0 \\ 0 & e^{i\pi/4} \end{pmatrix},$$

a $\pi/4$ rotation in the qubit's Bloch-sphere $Z$-axis. Its matrix elements are neither $\{0, 1\}$ nor $\{0, \pm 1, \pm i\}$ — it exits the Clifford group's orbit. A more general class is the **non-Clifford gates** (of which T is the canonical single-qubit representative and the Toffoli gate is the canonical three-qubit representative). These are gates for which no polynomial classical simulation algorithm is known and, under standard complexity-theoretic assumptions, none exists.

**Magic** is the measure of how many non-Clifford gates a quantum state requires. Formally, for a pure state $|\psi\rangle$, the **stabilizer entropy** (or **mana**, or **robustness of magic** in different conventions) quantifies the minimum number of T-gate injections needed to prepare $|\psi\rangle$ from any stabilizer state:

$$\mathcal{M}(|\psi\rangle) = \min_{|\phi\rangle \in \text{STAB}} D\!\left(|\psi\rangle\langle\psi|,\; |\phi\rangle\langle\phi|\right),$$

where $D$ is an appropriate distance measure (often the trace norm or the mana functional of Veitch et al. 2014). A stabilizer state has $\mathcal{M} = 0$; a $|T\rangle = T|+\rangle$ state has $\mathcal{M} = \log 2$; the maximally magical $n$-qubit state has $\mathcal{M} = O(n)$.

Kitaev and Bravyi (2004) showed that the relevant categorical boundary — the divide between classically simulable and genuinely quantum-hard — runs exactly along this line. States above it are computationally unreachable by classical means. They are, in the technical vocabulary, **magical**.

---

## 2. What Magic Does to Space

Holographic theories model space-time using the **AdS/CFT correspondence** (Maldacena 1997): a $(d+1)$-dimensional gravitational bulk is encoded in the quantum state of a $d$-dimensional conformal field theory living on the boundary. Harlow (2017) and collaborators showed that this encoding can be understood as a **quantum error-correcting code**: the bulk region and its matter content are "logical qubits" distributed across the physical qubits of the boundary CFT via entanglement. The code protects bulk information against local boundary disturbances — mirroring how quantum error correction protects logical qubits against physical noise.

The codes Harlow initially studied — **stabilizer codes** — encode bulk geometry into boundary entanglement. They produce space-times, but inert ones: the matter content and the geometric fabric are cleanly separated, and the separation is watertight. No mixing occurs. It is as if the mattress and the bowling ball exist in perfectly decoupled sectors; the ball cannot make a dent because the denting degree of freedom is, by construction, orthogonal to the ball's description.

Cao (Virginia Tech), Preskill (Caltech), and collaborators showed in 2024–2026 work that the ingredient needed to give space its bendiness is magic: the addition of non-Clifford gates to the code makes the entanglement describing geometry and the entanglement describing matter *interact*, producing the coupling that general relativity requires. "If you have one," Bao said, "you always have the other."

The formal structure of the result is this. A stabilizer code partitions the code space into two exactly commuting sectors:

$$\mathcal{H}_\text{code} = \mathcal{H}_\text{geometry} \otimes \mathcal{H}_\text{matter},$$

with the restriction map $\rho: \mathcal{H}_\text{matter} \to \mathcal{H}_\text{geometry}$ trivial (zero coupling). Adding T gates — introducing magic — deforms this tensor product into a **non-trivially braided** structure. The sectors mix. The restriction map becomes non-trivial. The coupling between matter and geometry is the T-gate deformation of the stabilizer code structure, and that coupling *is* (the precursor of) gravity:

$$\delta \mathcal{L}_\text{gravity} \sim \mathcal{M}[\rho_\text{boundary}].$$

This is not yet Einstein's equations — Cao's group describes their result as "step 0.5 of 5." But it identifies the correct kinematic ingredient. By early 2026, Cao, Preskill, and collaborators had produced a next-generation "magical" code in which non-Clifford gates let the entanglement for space and the entanglement for matter affect each other, satisfying the precondition for space-time curvature.

An implication that should not pass unmarked: gravity results from *imperfect* quantum encoding. Non-magical codes protect their information perfectly and produce gravity-free space. The encoding must be approximate — some aspects of the bulk cannot be perfectly recovered from any boundary measurement — and this approximation, which would indicate a poorly written quantum error-correcting code, is "the reason Newton's apple fell."

Perfect encoding is gravity-free. Approximate encoding is gravitational. The approximation is the physics.

---

## 3. The Prior Draken Reading of This Structure

This is not the first time the framework has encountered this argument. DRK-143 ("The Braided Substrate") established that Berry curvature, tensor network contraction, and Chern–Simons knot invariants are four faces of a single modular tensor category (MTC), and that the Draken 18-layer manifold is formally a fiber bundle on this substrate. The key equation from DRK-143:

$$\underbrace{\boldsymbol{\Omega} = dA}_{\text{Berry curvature}}\;\longleftrightarrow\;\underbrace{c_1 = \Omega/2\pi}_{\text{Chern class}}\;\longleftrightarrow\;\underbrace{CS[A]}_{\text{Chern–Simons form}}\;\longleftrightarrow\;\underbrace{J(K; q)}_{\text{knot invariant on Wilson lines}}.$$

What DRK-143 identified as the *holonomy along closed narrative loops* — the source of the Ψ-pathology — corresponds directly to what Cao's group calls the *excess magic* in the boundary code. A closed narrative loop that fails to update on contact with the exterior is a loop along which the restriction map is trivially self-referential: the matter sector couples to itself rather than to the geometry. The gravity of external reality does not penetrate. The ball does not make a dent.

DRK-149 ("The Continuous Dimension") extended this to the dimensional-regularization pole at L01: the $1/\varepsilon$ pole in QFT renormalization is the $H^1$ obstruction at the substrate layer, and the counterterm is the K(t) discharge. The Cao–Preskill result is the same structure one layer up: the T-gate "pole" that exits the Clifford group is the point where the code's $H^1$ becomes non-trivial, where geometric flexibility becomes available, and where the approximation that makes gravity possible is introduced.

And DRK-141 ("The Finite Sheaf") identified all Draken operators as ultrafinitist by construction — Γ, Ψ, K(t), H¹ are computed over finite cellular complexes. The non-Clifford gates are ultrafinitist objects: T is a gate, a discrete operation, applied finitely many times. The magic of a state is an integer count of T-gate injections. The gravity precursor is discrete. This is not a coincidence; it is the same claim at the level of the physical substrate.

---

## 4. Magic as Occult Technical Term — A Structural Reading

The word the physicists chose was **magic**. This merits more than a footnote.

In the Western occult tradition, *magia* names the art of causing change in conformity with will — a definition usually attributed to Aleister Crowley but present implicitly from Agrippa's *De Occulta Philosophia* (1531) through the Golden Dawn synthesis of the late 19th century. What makes an operation *magical* rather than *mechanical* is, in the traditional vocabulary, that it operates through principles inaccessible to the ordinary rational framework of the practitioner's era. The alchemist working with mercury was not using magic in the derogatory sense; they were using a principled protocol whose underlying mechanism was simply unavailable to contemporaries. The mechanism was real. The framework to contain it did not yet exist.

The T-gate case is structurally identical. The **Clifford group is the algebra of the ordinary**. Operations within it are those for which the classical computational framework — polynomial-time simulation, Pauli tracking, stabilizer formalism — provides a complete description. The non-Clifford gates are operations for which that framework is, provably, insufficient. They require resources — superposition depth, magical state injection, distillation protocols, topological fault-tolerance — that do not exist within the classical simulable substrate. They are operations in genuine excess of the ordinary algebra.

The physicists who named this resource "magic" in 2004 (Kitaev, Bravyi) and retained the term through twenty years of intense technical development were not being whimsical. They were recognizing, perhaps half-consciously, that they had located a **structural boundary between ordinary and extraordinary computation** and that the old word fitted the new object better than any alternative. The extraordinary *bends space*. That is what magic has always claimed to do.

Formally: let $\text{Stab}(n)$ denote the set of $n$-qubit stabilizer states and $\text{Pure}(n)$ the full pure-state Hilbert space. The **magic boundary** is the frontier $\partial \text{Stab}(n) \subset \text{Pure}(n)$ — the set of states of vanishing stabilizer entropy that nonetheless require non-Clifford operations to reach from generic initial states. Crossing this boundary is the operation that makes holographic gravity possible. It is the gate of the sorcerer.

In the Draken framework, the analogous boundary is the **anti-totalisation threshold** at which the restriction maps of the 18-layer sheaf become non-trivially interacting rather than isolated:

$$\Gamma_\text{threshold} = 1 - \frac{\mathcal{M}[\rho_\text{boundary}]}{\mathcal{M}_\text{max}}.$$

Below $\Gamma_\text{threshold}$, the layers behave like a stabilizer code: inert, decoupled, each encoding its own sector without gravitational influence on the others. Above it, the sectors interact. The framework becomes *pliable* — capable of bending toward external reality, of registering the weight of evidence, of forming the dent. This is the transition from a pathological (Ψ-saturated, H¹-obstructed) configuration to a coherent (Γ-near-unity, H¹-trivial) one. It is, in the physicists' language, the introduction of magic.

---

## 5. Topological Quantum Computing as the Hardware of Γ-Computation

The connection to topological quantum computing is now direct. Brian Swingle (University of Maryland) notes that if a genuine simulation of quantum gravity requires *high magic*, then "we intrinsically need a quantum computer, because there's no other way, in general, to get at that kind of question." Classical computers cannot access the magical regime. The simulation of a holographic space-time that actually bends — that has gravity — requires hardware that physically instantiates non-stabilizer states.

The leading architecture for fault-tolerant, scalable non-Clifford computation is **topological quantum computing** (Kitaev 2003; Nayak et al. 2008). The core idea: instead of protecting logical qubits from noise by software error-correction, one encodes them in the **topological degrees of freedom of a physical system** — the braiding statistics of non-Abelian anyons in a topologically ordered 2D material. Logical operations are performed by braiding anyon world lines around one another. The result depends only on the *topology* of the braid (which anyon went around which), not on its precise spatial path or timing. Topological protection is therefore hardware-level, not software-level.

The key non-Abelian anyons for universal topological quantum computing are the **Fibonacci anyons** (in certain fractional quantum Hall states at $\nu = 12/5$ and in certain string-net lattice models) and the **Ising anyons** (in $p_x + ip_y$ topological superconductors, as realized in Majorana zero modes). For Fibonacci anyons, every anyon type is its own antiparticle and the fusion rules are:

$$\tau \times \tau = \mathbf{1} + \tau,$$

where $\tau$ is the non-trivial anyon and $\mathbf{1}$ is the vacuum. The dimension of the $n$-anyon fusion space grows as $\phi^{n-1}$ (where $\phi = (1+\sqrt{5})/2$ is the golden ratio), and the braiding matrices — the $F$- and $R$-matrices of the underlying modular tensor category — generate a dense subgroup of $SU(N)$. Braiding Fibonacci anyons is computationally universal: any unitary operation, including T gates, can be approximated to arbitrary precision by a braid word.

The structural claim connecting this to Draken is: **the cellular sheaf Laplacian of Hansen and Ghrist (2019), which is the technical substrate of the Draken Γ-computation, is a topological operator on a discretized manifold whose spectrum encodes exactly the sheaf cohomology H¹ that DRK-143 through DRK-155 have been diagnosing**. The zero eigenvectors of $\mathcal{L}_0$ (the sheaf Laplacian) are the globally consistent sections; the non-zero eigenvectors encode the obstruction. Computing Γ is computing how much of the spectrum is occupied at zero — how much of the sheaf is "trivially braided." Computing H¹ is reading off the non-zero sector.

In the language of topological quantum computing: Γ is the **topological charge of the vacuum sector**. H¹ obstructions are **trapped anyonic excitations** that have not been annihilated by the braiding protocol (the clinch). K(t) is the **anyon density integrated over time** — the accumulated charge that needs to be discharged for the system to return to a topologically ordered, Γ ≈ 1 state.

The equations become:

$$\Gamma = \frac{\dim \ker \mathcal{L}_0}{\dim \ker \mathcal{L}_0 + \dim H^1(\mathcal{U}, \mathcal{F})}, \qquad K(t) = \int_0^t \rho_\text{anyon}(\tau)\, w(\tau)\, d\tau,$$

where $\rho_\text{anyon}(\tau)$ is the density of trapped H¹ anyons at time $\tau$ and $w(\tau)$ is a weight function encoding the severity of the layer-specific obstruction.

The clinch — the diagnostic encounter that forces external reality to interact with the internal narrative — is topologically a **fusion event**: the system's accumulated anyonic charge meets an incoming anyon of the appropriate type, and the fusion channel that reduces the total charge to the vacuum is selected. This is not merely analogical. DRK-123 established that varanid combat's Display→Clinch→Resolution cycle is a three-phase protocol with exactly this structure: Display accumulates a topological charge (the Ψ signal), Clinch is the fusion event, Resolution reads the fusion outcome. The framework was computing topological quantum gravity before either the physicists or the framework authors had that vocabulary.

---

## 6. The Occult Tradition's Prior Art

If magic is the technical term for the non-stabilizer resource that makes space bend, it is worth asking what the occult tradition has been computing under that name.

The answer, surprisingly precisely, is: **the deformation of the stabilizer algebra of consensus reality by operations that the consensus framework cannot internally generate**. Every major magical working described in the grimoire tradition — from the Solomonic evocations through the Goetic hierarchies, the Enochian Keys, the Thelemic Aeons — is a protocol for introducing, to a human cognitive system, operations that lie outside that system's Clifford group. The effect is always described as a *bending of the fabric*: the practitioner's reality becomes more pliable, more responsive to intention, more curved.

The Hermetic axiom *As above, so below* is the statement that the structure of the cosmic substrate is reflected at every scale — that the same topological category which governs the geometry of the physical universe also governs the geometry of consciousness and meaning. If the Cao–Preskill result is correct — if gravity is the T-gate deformation of the stabilizer code — then the Hermetic axiom gains a precise mathematical correlate: **the same class of operations that introduce gravity into holographic space-time also introduce coherence-flexibility into the Draken 18-layer manifold at every scale from L01 to L18**.

The 22 Major Arcana of the Tarot, for instance, are traditionally understood as 22 operations on the practitioner's reality-model — 22 "gates" in the occultist's vocabulary. The number 22 is the number of letters in the Hebrew alphabet, and Hebrew letters were understood as the "letters with which God created the world" (*Sefer Yetzirah*). DRK-155 ("Inpu Means Input") established that the 42 assessors of the Hall of Two Truths are a distributed tribunal — a 42-node diagnostic network that computes the coherence of a life. If 42 is the number of assessors in the psychostasia, and 22 is the number of letters (gates) in the creative substrate, then 42 − 22 = 20 — the number of free parameters left after fixing the alphabet. This is numerology, and the framework's V.2 (Precision over Comfort) flags it accordingly. But the structural point holds independently of the numerological observation: the tradition was mapping a gate set onto a reality-deformation protocol, and the vocabulary of magic was precisely right for what was being described.

The key figure in the Western tradition for the *T-gate analog* is **Mercury/Hermes/Thoth** — the trickster, the boundary-crosser, the god who moves between worlds. Thoth in particular is associated in Egyptian mythology with the weighing of the heart (the psychostasia), with the curvature of fate, and with the *medjat* — the measuring cord that establishes right angle, right proportion, right sheaf. DRK-155 established Anubis as the restriction-map operator at the terminal boundary; Thoth is the operator who introduces magic — the non-trivial gate — into the measurement itself. Without Thoth's intervention, the 42-node tribunal is a stabilizer circuit: it can weigh, but it cannot *decide* (the decision is the T-gate). The non-Clifford injection is the divine trickster's entry.

In the Draken TOPO papers (DRK-TOPO-002, DRK-TOPO-003), the X→Y funnel operator was formalized as the morphism that takes a configuration from one layer-stratum to another via a non-trivial restriction map. The funnel is precisely this: the gate that exits the Clifford group of the source stratum and enters the gate set of the target. The T-gate analogy is not decorative.

---

## 7. Connection to Belief Topology

DRK-116 ("Reasonance") established that the universal human need for meaning-making is the cognitive layer's attempt to re-enter coherence with the substrate. DRK-121 ("The Coherence Debt") formalized karma as a thermodynamic integral. DRK-153 ("No Trace, No Section") showed that consciousness is the integrated H¹-suppression rate of the organism's sensorimotor sheaf.

All three of these results now acquire a deeper technical grounding from the Cao–Preskill finding. If gravity is the coupling introduced by non-Clifford magic, then:

1. **Belief** is a restriction map between the organism's internal model (its "boundary" in the holographic sense) and external reality (the "bulk"). A belief system that operates entirely within its own Clifford group — that only makes predictions it can verify against itself — is a stabilizer code. It produces an internally consistent model. But it does not *interact with external reality*. It floats. The bowling ball makes no dent.

2. **A belief system with magic** is one that has introduced non-stabilizer operations: genuine empirical contact with external reality whose outcomes cannot be predicted from internal resources alone. The T-gate analog is the moment of genuine surprise — when the world returns an answer that no prior internal computation could have generated. This is the clinch. This is the fusion event that collapses the H¹ obstruction and updates K(t) downward.

3. **Ψ** (the Narrative Self-Reference Ratio) is the fraction of a system's inferential budget spent on operations within its own Clifford group — self-referential loops that consume computational resources while producing no external curvature. A Ψ → 1 system is a perfect stabilizer: it computes flawlessly within itself, and the external universe remains unaffected. High Ψ is low magic. Low magic is inert space. Inert space is the pathology.

The equations:

$$\Psi \approx 1 - \frac{\mathcal{M}[\rho_\text{internal}]}{\mathcal{M}_\text{max}}, \qquad \Gamma \approx \frac{\mathcal{M}[\rho_\text{internal}]}{\mathcal{M}_\text{max}},$$

so that $\Psi + \Gamma \approx 1$ — which is exactly the empirical inverse correlation between narrative self-reference and sheaf coherence that the framework has tracked across DRK-101 through DRK-155. **The soul of the Draken diagnostic is a magic measurement.** The framework has been computing stabilizer entropy on belief systems since its inception without the vocabulary to say so. The vocabulary now exists.

---

## 8. Topological Fault Tolerance and Anti-Totalisation

The anti-totalisation principle — *non-negotiable, reflexive, applies to Draken itself* — is structurally the demand that no single stabilizer code be permitted to serve as the structure sheaf of the framework. A totalitarian system is precisely one that has frozen its Clifford group as the complete grammar of the real: it has zero magic, zero capacity for external curvature, zero gravity. It floats above material reality, internally coherent, externally weightless.

Topological quantum computing's key virtue is **fault tolerance through topological protection**: logical information stored in the braiding sector is immune to *local perturbations* — noise, decoherence, attempted measurement of individual anyons. But it is not immune to **global topological operations** — braids that wind around the entire system, changing its topological sector. The totalitarian analogy is exact: the regime is locally immune to individual dissent (noise immunity) but globally vulnerable to topological phase transitions (revolution, collapse, what DRK-138 called the "survivable glitch"). The Y-stick (DRK-128) is a topological operation. It works because it changes the topological sector of the dragon's behavior pattern, not because it applies local force.

The clinch protocol — mandatory reality-testing by full-body grapple — is topologically a **complete braiding**: the two world lines (the combatants) wind around each other for a sufficient duration that every topological charge has time to be measured and fused. The outcome of the clinch is the topological charge of the resulting configuration. This is why DRK-123 established that the fourth dimension of varanid section data encodes "untested future capacity" — it encodes the magical charge not yet fused, the T-gate not yet applied, the gravity not yet realized. The Wick rotation that removes it is exactly the measurement that reads the topological sector.

---

## 9. Falsification

The post advances four claims of decreasing certainty.

**(a)** *Magic (non-stabilizer complexity, measured by stabilizer entropy or mana) is the technical quantum-information quantity that gives holographic space-time its geometric flexibility, as demonstrated by Cao, Preskill et al. (2024–2026).* This is the empirical core of the post. Falsified by: demonstration that holographic codes with only Clifford operations can produce back-reaction of matter on geometry in the AdS/CFT setting; or by retraction or significant correction of arXiv:2403.07056 and arXiv:2603.13475.

**(b)** *The Draken operators Ψ, Γ, K(t) are structurally proportional to stabilizer entropy / magic at the relevant layer of the 18-layer manifold.* This is a formal structural claim. Falsified by: construction of a Ψ → 1 system that nonetheless has non-trivial empirical contact with external reality (a self-referential belief system that nonetheless generates genuine surprises from external input); or a Γ ≈ 1 system with $\mathcal{M} \approx 0$ (a fully coherent system that achieves coherence without any non-trivial external coupling). The framework does not currently have a proof — only structural consonance and the absence of counterexamples across the documented corpus.

**(c)** *The Western occult tradition's vocabulary of magic names, with reasonable precision, the same class of operations that the Cao–Preskill result identifies as the gravitational ingredient.* This is a hermeneutic claim, not a physical one. It cannot be falsified by physics; it can be refined or refuted by better hermeneutic analysis. The claim is not that alchemists were doing topological quantum computing — they were not. The claim is that the semantic content of the word "magic," traced through its primary technical usages in the Western tradition, points consistently at *operations that exit the grammar of the ordinary* and that *bend the fabric of the real toward the practitioner's internal state*. This is what T gates do to holographic space.

**(d)** *Topological quantum computing, implemented physically in non-Abelian anyon systems, is the natural hardware for Γ-computation over the 18-layer manifold.* This is the most speculative claim. It requires: (i) that the cellular sheaf Laplacian of Hansen–Ghrist can be implemented as a Hamiltonian on an anyon system; (ii) that the eigenvectors of this Hamiltonian encode the Draken layer-strata in a physically accessible way; (iii) that braiding operations on the resulting anyon system correspond to clinch-type external-reality-testing events at the appropriate layer. None of these has been proven. The claim is offered as a research direction, not a result. The expected status is: structurally motivated, technically unexplored, potentially falsifiable by direct construction or by demonstration of incompatible structural requirements.

---

## 10. Closing

Physicists studying holography have found that the two defining features of quantum mechanics — entanglement and magic — correspond to the two defining features of space: its shape and its flexibility. "All the familiar aspects of gravity are actually a very direct manifestation of something quantum," Swingle said.

The framework is grateful for this result on multiple grounds. Formally, it completes the picture that DRK-143 opened: Berry → Wilson → tensor → knot → weight → Draken is now extended by one more term:

$$\underbrace{\boldsymbol{\Omega} = dA}_{\text{Berry}}\;\longleftrightarrow\;\underbrace{U[\mathcal{C}]}_{\text{Wilson}}\;\longleftrightarrow\;\underbrace{A^s_{a_1 a_2}}_{\text{tensor net}}\;\longleftrightarrow\;\underbrace{J(K;q)}_{\text{knot invariant}}\;\longleftrightarrow\;\underbrace{\mathcal{M}[\rho]}_{\text{magic}}\;\longleftrightarrow\;\underbrace{\delta g_{\mu\nu}}_{\text{gravity}}.$$

Magic is the penultimate term before gravity. It is the last structure before the bend.

Semiotically, the framework is grateful that the word the physicists chose was the right word. The tradition that called these operations *magic* was not wrong. It was ahead of the formalism by several centuries, as traditions sometimes are. The formalism has now caught up. The word remains.

Cao finds the feature appealing. "He sees no reason that gravity should accommodate our prejudice for perfection."

Neither does the framework. The anti-totalisation principle is not a preference for imperfection. It is the recognition that an exact encoding — one with zero magic, zero approximation, zero contact with the outside — produces a world that floats. A world with no weight. The approximation is not a flaw. The approximation *is* the physics.

> *Jag är vad jag gör, och jag gör det jag är.*

The magic is in the doing. The gravity is in the dent.

---

Sheaf Coherence Γ: 0.89

Active Layers: 8 (L01 · L02 · L05 · L07 · L08 · L13 · L15 · L17)

---

### References

Bravyi, S. B. & Kitaev, A. Yu. (2005). Universal quantum computation with ideal Clifford gates and noisy ancillas. *Physical Review A*, 71(2), 022316.

Cao, C. & Lackey, B. (2021). Approximate Bacon–Shor code and holography. *Journal of High Energy Physics*, 2021(5), 127.

Cao, C., Hamma, A., et al. (2024). Magic-state resource theory and holographic spacetime geometry. arXiv:2403.07056.

Cao, C., Preskill, J., et al. (2026). Holographic codes beyond stabilizers: magic, back-reaction, and geometric flexibility. arXiv:2603.13475.

Gottesman, D. (1997). Stabilizer codes and quantum error correction. PhD thesis, Caltech.

Hansen, J. & Ghrist, R. (2019). Toward a spectral theory of cellular sheaves. *Journal of Applied and Computational Topology*, 3(4), 315–358.

Harlow, D. (2017). The Ryu-Takayanagi formula from quantum error correction. *Communications in Mathematical Physics*, 354(3), 865–912.

Kitaev, A. (2003). Fault-tolerant quantum computation by anyons. *Annals of Physics*, 303(1), 2–30.

Maldacena, J. (1998). The large N limit of superconformal field theories and supergravity. *Advances in Theoretical and Mathematical Physics*, 2(2), 231–252.

Nayak, C., Simon, S. H., Stern, A., Freedman, M., & Das Sarma, S. (2008). Non-Abelian anyons and topological quantum computation. *Reviews of Modern Physics*, 80(3), 1083.

Veitch, V., Mousavian, S. A. H., Gottesman, D., & Emerson, J. (2014). The resource theory of stabilizer computation. *New Journal of Physics*, 16(1), 013009.

Witten, E. (1989). Quantum field theory and the Jones polynomial. *Communications in Mathematical Physics*, 121(3), 351–399.

Wood, C. (2026, June 3). Entanglement builds space-time. Now "magic" gives it gravity. *Quanta Magazine*. https://www.quantamagazine.org/entanglement-builds-space-time-now-magic-gives-it-gravity-20260603/

---

*Internal cross-references: [The Braided Substrate](/posts/the-braided-substrate/) (DRK-143), [The Continuous Dimension](/posts/the-continuous-dimension/) (DRK-149), [The Finite Sheaf](/posts/the-finite-sheaf/) (DRK-141), [No Trace, No Section](/posts/no-trace-no-section/) (DRK-153), [Inpu Means Input](/posts/inpu-means-input/) (DRK-155), [The Coherence Debt](/posts/the-coherence-debt/) (DRK-121), [The Imaginary Dimension](/posts/the-imaginary-dimension/) (DRK-123).*

*Khrug Engineering — Göteborg*
*V.1: Non-Deceptive Intention · V.2: Precision over Comfort · V.4: Anti-Delusion Safeguard · V.7: Inversion Filter*
