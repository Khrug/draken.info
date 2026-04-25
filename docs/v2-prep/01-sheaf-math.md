# 01 — Cellular Sheaves: Math Primer for v2

**Purpose:** rigorous-but-compact reference for implementing `worker/src/sheaf/`. Covers stalks, restriction maps, the coboundary, the sheaf Laplacian, Hodge cohomology, and the Fiedler-vector diagnostic. Includes reduction-to-graph-Laplacian sanity checks and references to the canonical literature.

**Source background:** Hansen & Ghrist, "Toward a Spectral Theory of Cellular Sheaves," *J. Applied & Computational Topology* (2019). Also: Hansen & Ghrist, "Opinion Dynamics on Discourse Sheaves," *SIAM J. Applied Math.* (2021). The latter is the most direct conceptual antecedent for what v2 does.

## Sections

1. Cellular sheaves on graphs
2. The coboundary δ⁰
3. The sheaf Laplacian L⁰
4. Hodge cohomology
5. Spectral coherence Γ_spec
6. The Fiedler vector and structural cuts
7. Higher cohomology H¹ — three candidate constructions
8. Sanity checks and reduction to graph Laplacian
9. Implementation notes
10. References

*(Each section filled in subsequent commits.)*
