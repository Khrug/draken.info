# 01 — Cellular Sheaves: Math Primer for v2

**Purpose:** rigorous-but-compact reference for implementing `worker/src/sheaf/`. Covers stalks, restriction maps, the coboundary, the sheaf Laplacian, Hodge cohomology, and the Fiedler-vector diagnostic. Includes reduction-to-graph-Laplacian sanity checks and references to the canonical literature.

**Source background:** Hansen & Ghrist, "Toward a Spectral Theory of Cellular Sheaves," *J. Applied & Computational Topology* (2019). Also: Hansen & Ghrist, "Opinion Dynamics on Discourse Sheaves," *SIAM J. Applied Math.* (2021). The latter is the most direct conceptual antecedent for what v2 does.

## 1. Cellular sheaves on graphs

A **cellular sheaf** F over a directed graph G = (V, E) consists of three pieces of data:

**(a) Vertex stalks.** For each vertex v ∈ V, a finite-dimensional inner-product space F(v). In v2 we set every vertex stalk to F(v) = ℝ^d, where d is the embedding dimension chosen at deployment time.

**(b) Edge stalks.** For each edge e ∈ E, a finite-dimensional inner-product space F(e). In v2 we set F(e) = ℝ^d (same dimension; this is a *common choice*, not forced — different stalks per cell are permitted by the general theory).

**(c) Restriction maps.** For each incidence v ◁ e (vertex v is incident to edge e), a linear map ρ_{v ◁ e}: F(v) → F(e). For an oriented edge e = (u → v), there are two restriction maps: ρ_{u ◁ e} (from tail) and ρ_{v ◁ e} (from head).

A **section** of F over a subset U ⊆ V is an assignment s: v ↦ s_v ∈ F(v) for v ∈ U. A section is **consistent** on edge e = (u → v) if

  ρ_{u ◁ e}(s_u)  =  ρ_{v ◁ e}(s_v).

A **global section** is a section over all of V that is consistent on every edge.

**Intuition.** The stalk F(v) is *what can be locally observed at v*. The restriction map ρ_{v ◁ e} is *how an observation at v is interpreted from the standpoint of the edge e*. A global section is a choice of stalk-vectors that all neighbouring vertices agree on after their respective restrictions are applied.

For Argument Mode in v2, a vertex is a claim and its stalk is the claim's embedding. An edge is an inference between claims, and the restriction maps express how the premise and conclusion are seen from the inference's standpoint. Failure of consistency on an edge = the inference does not glue.

## 2. The coboundary δ⁰

The space of vertex-supported sections is

  C⁰(X; F)  =  ⊕_{v ∈ V} F(v)  ≅  ℝ^{|V| · d}

(direct sum of all vertex stalks). The space of edge-supported "discrepancies" is

  C¹(X; F)  =  ⊕_{e ∈ E} F(e)  ≅  ℝ^{|E| · d}.

The **coboundary operator** δ⁰: C⁰ → C¹ measures how far a section is from being globally consistent. For an oriented edge e = (u → v),

  (δ⁰ s)_e  =  ρ_{v ◁ e}(s_v)  −  ρ_{u ◁ e}(s_u).

Stack vertex stalks into a vector s ∈ ℝ^{|V|·d}. Then δ⁰ is a sparse matrix of shape (|E|·d) × (|V|·d). For each edge e = (u → v) and each k ∈ {0, …, d−1}, row index e·d + k contains:

  · the matrix block of ρ_{v ◁ e}, columns v·d : v·d + d, with sign +1
  · the matrix block of ρ_{u ◁ e}, columns u·d : u·d + d, with sign −1

A section s is a global section if and only if δ⁰ s = 0. Equivalently:

  H⁰(X; F)  =  ker(δ⁰)  =  global sections of F.

## 3. The sheaf Laplacian L⁰

The **sheaf Laplacian** is

  L⁰  =  (δ⁰)^T  δ⁰     ∈   ℝ^{|V|d × |V|d}.

L⁰ is **symmetric and positive semi-definite**. Its block structure mirrors the underlying graph:

  · Off-diagonal block (u, v) is non-zero iff u and v share an edge.
  · Diagonal block at v is the sum over all edges e incident to v of (ρ_{v ◁ e})^T ρ_{v ◁ e} — the sum of restriction-map *Gram matrices*.

For a section s ∈ ℝ^{|V|d}, the **Dirichlet energy** is

  ⟨ s, L⁰ s ⟩  =  ‖δ⁰ s‖²  =  Σ_{e=(u,v)} ‖ρ_{v ◁ e}(s_v) − ρ_{u ◁ e}(s_u)‖².

This is exactly the squared sum of edge-wise consistency violations. A section s is a global section iff its Dirichlet energy is zero.

## 4. Hodge cohomology

**0-cohomology (global sections).** As stated:

  H⁰(X; F)  =  ker(δ⁰)  =  ker(L⁰).

The dimension dim H⁰ counts the number of independent globally-consistent sections. For a connected graph with **identity restriction maps** (the v2.0 baseline strategy), the kernel of δ⁰ consists of stalks that are constant across the graph in each of the d coordinates, so dim H⁰ = d. With **non-trivial restriction maps**, dim H⁰ can drop — fewer compatible global views means more contradiction.

**1-cohomology (obstructions).** This requires defining δ¹: C¹ → C² and the higher coboundary; see §7. Briefly:

  H¹(X; F)  =  ker(δ¹) / im(δ⁰).

Non-trivial H¹ means there are **edge-supported discrepancies that cannot be explained as the coboundary of any vertex section** — formal obstructions to gluing that no choice of stalks can fix.

## 5. Spectral coherence Γ_spec

Let L⁰_norm denote the symmetric normalized Laplacian:

  L⁰_norm  =  D^{-1/2} L⁰ D^{-1/2}

where D is the block-diagonal of L⁰. Let

  0 = λ₀ ≤ λ₁ ≤ λ₂ ≤ … ≤ λ_max

be its eigenvalues. The first non-zero eigenvalue λ₁ is the **Fiedler value** or **spectral gap**.

**Important note on direction.** In ordinary spectral graph theory, a *small* λ₁ indicates near-disconnection (a clean cut exists between two communities). For a **sheaf** the same logic applies — but the interpretation flips relative to v1's heuristic Γ:

  · small λ₁  ⇒  near-disconnection in the sheaf  ⇒  gluing failure
  · large λ₁  ⇒  well-mixed, well-glued sheaf

Therefore the v2 spectral coherence is

  Γ_spec  =  λ₁(L⁰_norm) / λ_max(L⁰_norm)     ∈   [0, 1]

— a normalized spectral gap. **High Γ_spec = strongly glued; low Γ_spec = severable.**

This is the *opposite directional convention* from v1's heuristic Γ (where higher was already better), so the human-facing interpretation is unchanged but the underlying computation now has clean spectral provenance.

**Calibration targets** (per spec §2.3):

| Text type | Expected Γ_spec |
|---|---|
| Textbook chapter, single topic | ≥ 0.40 |
| Mixed academic essay | 0.25 – 0.40 |
| Cavity-resonator pattern (DRK-110) | ≤ 0.18 |

### Dirichlet coherence — the *state*-sensitive variant

Spectral Γ depends only on the *topology* of the sheaf (the restriction maps and graph). It does not depend on the specific stalk values currently chosen. The **Dirichlet coherence**

  Γ_dirichlet  =  1  −  ⟨s, L⁰ s⟩ / ⟨s, s⟩

is the v1 Γ done properly: 1 minus the normalized Dirichlet energy of the *actual* stalk vectors. It is sensitive to whether the embeddings the LLM gave us actually live in the sheaf's kernel, not just whether the kernel is large.

Both should be reported; they tell different things.

## 6. The Fiedler vector and structural cuts

The eigenvector v₁ associated with λ₁(L⁰_norm) is the **Fiedler vector**. Its sign pattern partitions V into two groups corresponding to the cleanest spectral cut.

For Argument Mode this is directly diagnostic. The Fiedler cut identifies the natural fault-line of the argument graph: the partition of claims that minimizes the gluing-energy across it. If that cut separates *empirical* claims from *theoretical* claims, you have found the cavity-resonator boundary in formal terms — exactly where a critic would attack.

UI surface (per spec §6.2, §2.4): "Cleanest severance in this argument: {top 5 claims on positive side} vs {top 5 claims on negative side}, gap λ₁ = 0.07." Click to highlight in the graph.

**Spectral embedding** (post-MVP). Higher eigenvectors v₂, v₃, … give a low-dimensional embedding of claims into ℝ^k. Useful for visualizing the argument's "shape" beyond the cleanest cut. Standard spectral-embedding workflow.

## 7. Higher cohomology H¹ — three candidate constructions

H¹ measures *non-removable* obstructions: edge-cocycles that are not the coboundary of any vertex section. To compute H¹ we need 2-cells, which the underlying graph does not give us for free. **Three plausible discrete constructions for argument graphs**, each yielding a different H¹:

### Option A: Triangle 2-cells (the spec's choice)

Per spec §2.5: "if A → B, B → C, A → C all exist, that's a 2-cell." The 2-cell's boundary δ¹ checks whether the long path A → B → C agrees with the short path A → C.

  Pros: well-defined, computationally tractable, has a direct argumentative interpretation (transitive-inference consistency).
  Cons: requires triangles to exist; many argument graphs have few. Misses *non-triangular* cycles entirely.

### Option B: Flag complex (clique complex) closure

Take the clique complex of the underlying undirected graph: every k-clique becomes a (k−1)-cell. 2-cells = 3-cliques (= triangles), 3-cells = 4-cliques, etc.

  Pros: standard topological-data-analysis construction; well-studied; reduces to Option A on 2-cells.
  Cons: same triangle dependency at the 2-cell level. Higher cells (k > 2) are computationally heavy and probably not interpretable for arguments.

### Option C: Premise-set 2-cells

If a conclusion C is supported by a set of premises {P₁, …, Pₙ} *jointly* (the inference uses all premises together, not as independent paths), define a 2-cell with boundary equal to the formal sum of the inference edges P_i → C. This is the *natural* combinatorial structure for **multi-premise inferences** but does not appear in plain graph-theoretic constructions.

  Pros: matches the structure that the inference-extraction prompt actually produces.
  Cons: less standard in the cellular-sheaf literature; may have non-obvious behavior under boundary maps.

### Recommended default

**Use Option A for v2.0 MVP** (matches spec, simplest to implement, sanity-checkable against published Hansen-Ghrist results). **Track Option C as a v2.x feature** because it is the one that is *interpretively native* to the argument-extraction pipeline. Option B is unlikely to add value beyond A in the argument-graph regime.

The implementer should make this choice deliberately, not by accident, and the choice should be recorded in `worker/src/sheaf/h1.ts` with a comment citing this document.

## 8. Sanity checks and reduction to graph Laplacian

When all stalks are 1-dimensional (F(v) = ℝ¹) and all restriction maps are the identity, the sheaf Laplacian L⁰ reduces to the **standard graph Laplacian** L = D − A, where D is the degree matrix and A is the adjacency matrix.

This reduction is the implementation's first sanity check:

```typescript
// Test fixture: 1-d trivial sheaf on a 4-cycle should give the
// graph Laplacian of the 4-cycle, eigenvalues {0, 2, 2, 4}.
test("trivial sheaf on cycle reduces to graph Laplacian", () => {
  const G = cycle(4);
  const F = trivialSheaf(G, 1);
  const L = sheafLaplacian(F);
  const eigs = eigenvalues(L);
  expect(eigs).toBeCloseTo([0, 2, 2, 4], 6);
});
```

**Second sanity check.** Take any d-dimensional sheaf with **identity restriction maps**. The sheaf Laplacian decouples into d independent copies of the graph Laplacian:

  L⁰  =  L_graph ⊗ I_d.

Eigenvalues of L⁰ are eigenvalues of L_graph, each with multiplicity d. dim H⁰ = d × (number of connected components).

**Third sanity check.** If two vertices u, v have identical neighborhoods and identical restriction maps to those neighbours, they should appear in the same component of the Fiedler partition (cannot be cleanly separated by spectral cut). Useful for catching bugs in the coboundary builder.

## 9. Implementation notes

**Sparse representation is mandatory.** A dense L⁰ for 500 nodes × d=1024 stalk dim is (500·1024)² = 2.6 × 10¹¹ floats = ~1 TB. Way over the 128 MB Cloudflare Workers memory limit. The Laplacian must be stored as a sparse matrix in CSR or COO format, and the coboundary builder must construct triplets `(row, col, value)` directly.

**Block sparsity.** L⁰ has a special block structure: if the graph has E edges, L⁰ has at most (V + 2E) non-zero d×d blocks, but each block is dense. For identity restriction maps, the block-diagonal structure of L⁰ = L_graph ⊗ I_d means storage is *only* O((V + 2E) · d) — much less than the naive O((V·d)²) — and matrix-vector products are O((V+E)·d).

**Eigenvalue extraction.** Two regimes:

  · Tier 2 (Cloudflare Worker): graphs ≤ ~200 nodes × d ≤ 256 = 50k DOF. Either implement Lanczos by hand (~150 LoC TS, no dependency works out of the box; see `02-tool-stack.md` §2) or fall back to dense `EigenvalueDecomposition` from `ml-matrix` only on tiny graphs (≤ 50 nodes).

  · Tier 3 (Modal Python): use `scipy.sparse.linalg.eigsh(L_norm, k=10, which='SM', sigma=0)` (shift-invert mode for smallest eigenvalues). Standard.

**The first eigenvalue is always zero (or numerically near-zero) for connected sheaves with non-degenerate restriction maps.** Always skip λ₀ when reporting the spectral gap. The implementer should explicitly handle this:

```typescript
const allEigs = smallestEigenpairs(L_norm, 11);  // get k+1 to be safe
const lambda1 = allEigs.eigenvalues.find(λ => λ > 1e-10);
if (lambda1 === undefined) {
  // sheaf is empty or extremely degenerate
}
```

**Numerical hygiene.** Restriction-map blocks should be assembled with care for sign conventions (head minus tail, not tail minus head). The Dirichlet energy formula gives an exact way to sanity-check this: ⟨s, L⁰s⟩ should always be ≥ 0 for any s, and = 0 iff s is a global section. Add an assertion in tests.

**Edge weights from inference confidence.** Each inference comes with `explicit_strength` and `formal_validity`. A natural edge weight is

  w_e  =  α · explicit_strength_e  +  (1−α) · formal_validity_e

with α ∈ [0.3, 0.5] tuned to balance "what the text claims" against "what the model judges." Apply weight as scaling on the coboundary block: ρ_e ↦ √(w_e) · ρ_e, which equals applying weight w_e on L⁰. Document the choice of α with its calibration date in the registry.

## 10. References

**Primary:**

· Hansen, J., & Ghrist, R. (2019). *Toward a Spectral Theory of Cellular Sheaves*. Journal of Applied and Computational Topology 3(4), 315–358. https://link.springer.com/article/10.1007/s41468-019-00038-7 — the canonical citation for the sheaf Laplacian, spectral theory, and the discrete Hodge decomposition.

· Hansen, J., & Ghrist, R. (2021). *Opinion Dynamics on Discourse Sheaves*. SIAM Journal on Applied Mathematics 81(5), 2033–2060. https://epubs.siam.org/doi/abs/10.1137/20M1341088 — direct conceptual antecedent for v2's design; introduces sheaf-Laplacian-driven dynamics on opinion graphs and the role of the Laplacian in registering "discord."

**Secondary:**

· Curry, J. (2014). *Sheaves, Cosheaves and Applications*. PhD thesis, University of Pennsylvania. The standard textbook treatment of cellular sheaves.

· Robinson, M. (2014). *Topological Signal Processing*. Springer. Engineering-oriented treatment; less abstract than Curry, more applied than Hansen-Ghrist.

**Code resources:**

· `pysheaf` (https://github.com/kb1dds/pysheaf) — Python library for cellular sheaves, sheaf Laplacian, cohomology. Reference implementation; useful for cross-checking v2's outputs even though v2 is not built on it.

· `discourse-sheaves` notebook companion to Hansen-Ghrist 2021. Search Hansen's website for the link.

**Adjacent (Draken-internal):**

· Thesis v4.4, §2 "Mathematical Foundations" and §9 "Sheaf Ethology." See `static/pages/thesis.html` and the printable PDF in `static/slask/`.

· DRK-121 *The Coherence Debt* — defines K(t) and its relationship to the Laplacian's energy budget over time. Directly relevant to v2's `gamma_dirichlet` interpretation.

· DRK-125 *The Totalitarian Sheaf* — the framework's most explicit analysis of what happens topologically when restriction maps are systematically severed. Useful for prompt calibration on the cavity-resonator fixture.

