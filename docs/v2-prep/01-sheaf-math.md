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


