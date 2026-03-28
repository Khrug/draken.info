"""
SHEAF ETHOLOGY PILOT — Varanid Combat Coherence Analysis
=========================================================
First computational implementation of sheaf Laplacian diagnostics
applied to behavioral ecology data.

Implements Prediction P8 from Draken 2045 Framework v4.4:
Three competing sheaf specifications (SAG, Energetic War of Attrition,
Cumulative Assessment) encode different restriction maps over the same
combat phase graph. The model yielding highest Γ best fits observed data.

Data sources:
- Frýdlová et al. (2016): 99 dyadic encounters, V. indicus
- Dick & Clemente (2016): Allometric scaling exponents, 9 species
- Earley et al. (2002): Game-theoretic framework
- Uyeda et al. (2015): Sociometric hierarchy data, V. salvator

Author: Kai Roininen / Khrug Engineering, Göteborg
Framework: Draken 2045 Initiative (draken.info)
License: CC BY-SA 4.0
"""

import numpy as np
from dataclasses import dataclass
from typing import List, Tuple, Dict
import json

# ============================================================
# 1. DATA STRUCTURES
# ============================================================

@dataclass
class Dyad:
    """A single dyadic encounter between two varanids."""
    id: int
    mass_a: float          # Body mass of individual A (grams)
    mass_b: float          # Body mass of individual B (grams)
    elevated_by: str       # 'bigger', 'smaller', 'both_B', 'both_S', 'none'
    attack: bool           # Whether non-contact attack occurred
    attacker: str          # 'bigger', 'smaller', 'none'
    fight: bool            # Whether contact fight occurred
    offender: str          # 'bigger', 'smaller', 'none' (who initiated contact)
    max_phase_reached: int # 0=approach, 1=elevation, 2=attack, 3=fight


@dataclass
class SectionData:
    """Section data x_v at a combat phase node."""
    escalation_intensity: float  # How intense the interaction is
    information_content: float   # How much reliable info has been exchanged
    force_capacity: float        # F_max (only meaningful at clinch, α=0)


# ============================================================
# 2. SYNTHETIC DATA GENERATION (from Frýdlová et al. 2016)
# ============================================================

def generate_frydlova_dyads(n: int = 99, seed: int = 42) -> List[Dyad]:
    """
    Generate synthetic dyads matching Frýdlová et al. (2016) statistics.
    
    Key empirical constraints:
    - Animals: 134.6-3944g, ages 5-30 months
    - 62% of 99 dyads showed NO aggression
    - 37% showed direct aggression (attack and/or fight)
    - 77% showed elevated threat postures
    - Of aggressive dyads, 65% (24/37) escalated to contact fight
    - Offender was heavier in 79% of fights (19/24)
    - At >10% mass disparity: offender heavier in 88% (14/16)
    - Fight probability scales with absolute mass (P < 0.0001)
    - Fight probability does NOT scale with mass ratio (P = 0.57)
    """
    rng = np.random.RandomState(seed)
    
    # Mass distribution: log-normal, matching 134.6-3944g range
    log_masses = rng.uniform(np.log(134.6), np.log(3944), size=n * 2)
    masses = np.exp(log_masses)
    
    dyads = []
    for i in range(n):
        m_a = masses[2 * i]
        m_b = masses[2 * i + 1]
        
        # Ensure m_a >= m_b (bigger first)
        if m_b > m_a:
            m_a, m_b = m_b, m_a
        
        mean_mass = (m_a + m_b) / 2
        mass_ratio = m_b / m_a  # always <= 1
        delta_m = (m_a - m_b) / (m_a + m_b)  # normalized asymmetry
        
        # --- Elevation (77% show elevated postures) ---
        has_elevation = rng.random() < 0.77
        if has_elevation:
            # Smaller male shows elevated in 36% of those with elevation
            # Both-bigger-first in ~17%, both-smaller-first in ~15%, none in ~16%
            elev_roll = rng.random()
            if elev_roll < 0.36:
                elevated_by = 'smaller'
            elif elev_roll < 0.52:
                elevated_by = 'bigger'
            elif elev_roll < 0.69:
                elevated_by = 'both_B'
            elif elev_roll < 0.84:
                elevated_by = 'both_S'
            else:
                elevated_by = 'none'
        else:
            elevated_by = 'none'
        
        # --- Attack probability (37% of dyads) ---
        # Key finding: scales with ABSOLUTE mass, not ratio
        # Logistic model: P(attack) = sigmoid(β₀ + β₁ * log(mean_mass))
        log_mean = np.log(mean_mass)
        p_attack = 1 / (1 + np.exp(-(log_mean - 6.5) * 1.2))  # calibrated to ~37%
        has_attack = rng.random() < p_attack
        
        if has_attack:
            # Attacker identity: at non-contact level, only 3/13 offenders were heavier
            attacker = 'bigger' if rng.random() < 0.23 else 'smaller'
        else:
            attacker = 'none'
        
        # --- Fight probability (24% of dyads with aggression escalating) ---
        # Scales strongly with absolute mass (P < 0.0001)
        p_fight_given_attack = 0.65 if has_attack else 0.0
        has_fight = has_attack and (rng.random() < p_fight_given_attack)
        
        if has_fight:
            # Offender (contact initiator) is heavier in 79% overall
            # 88% when mass disparity > 10%
            if delta_m > 0.05:  # >10% disparity in total mass
                p_heavier_offends = 0.88
            else:
                p_heavier_offends = 0.50  # no effect at small disparity
            offender = 'bigger' if rng.random() < p_heavier_offends else 'smaller'
        else:
            offender = 'none'
        
        # Determine max phase
        if has_fight:
            max_phase = 3
        elif has_attack:
            max_phase = 2
        elif has_elevation:
            max_phase = 1
        else:
            max_phase = 0
        
        dyads.append(Dyad(
            id=i, mass_a=m_a, mass_b=m_b,
            elevated_by=elevated_by, attack=has_attack,
            attacker=attacker, fight=has_fight,
            offender=offender, max_phase_reached=max_phase
        ))
    
    return dyads


# ============================================================
# 3. BIOMECHANICAL PARAMETERS (from Dick & Clemente 2016)
# ============================================================

# Allometric scaling exponents for key muscle groups
# Format: (exponent, 95% CI lower, 95% CI upper)
SCALING = {
    'PCSA_GAST':    (0.82, 0.702, 0.939),    # Ankle plantarflexor
    'PCSA_ILFIB':   (0.82, 0.665, 0.968),    # Knee flexor
    'PCSA_ILFEM':   (0.83, 0.684, 0.967),    # Femur abductor
    'MASS_ILFIB':   (1.14, 1.001, 1.269),    # Knee flexor mass
    'MASS_PIT':     (1.13, 1.019, 1.244),    # Knee flexor mass
    'PENN_CFEML':   (0.045, 0.014, 0.075),   # Femur retractor pennation
    'PENN_GAST':    (0.064, 0.024, 0.104),   # Ankle plantarflexor pennation
}


def compute_f_max(mass_g: float) -> float:
    """
    Compute relative force-generating capacity.
    F_max = M * (PCSA_kneeflex / M^0.66)
    Using ILFIB scaling exponent as proxy for knee flexor PCSA.
    """
    mass_kg = mass_g / 1000.0
    pcsa_expected = mass_kg ** 0.66       # geometric expectation
    pcsa_actual = mass_kg ** SCALING['PCSA_ILFIB'][0]  # allometric actual
    return mass_kg * (pcsa_actual / pcsa_expected)


def compute_e_ratio(mass_g: float) -> float:
    """
    Compute endurance ratio: fascicle_length / PCSA.
    Higher = more endurance, Lower = more explosive force.
    As mass increases, pennation increases (Dick & Clemente),
    meaning more force but less range → lower E_ratio.
    """
    mass_kg = mass_g / 1000.0
    # Fascicle length scales ~isometrically (M^0.33)
    fascicle = mass_kg ** 0.33
    # PCSA scales with positive allometry
    pcsa = mass_kg ** SCALING['PCSA_GAST'][0]
    return fascicle / pcsa


def compute_delta_m(mass_a: float, mass_b: float) -> float:
    """Normalized mass asymmetry ∈ [-1, 1]."""
    return (mass_a - mass_b) / (mass_a + mass_b)


# ============================================================
# 4. SHEAF CONSTRUCTION
# ============================================================

# Phase indices
DISPLAY = 0
ENCOMPASS = 1
CLINCH = 2
CATCH = 3
SUBPRESSIVE = 4

PHASE_NAMES = ['Display', 'Encompassing', 'Clinch', 'Catch', 'Subpressive']
EDGES = [(0,1), (1,2), (2,3), (3,4)]  # D→E, E→Cl, Cl→Ca, Ca→S


def build_section_data(dyad: Dyad) -> Dict[int, np.ndarray]:
    """
    Build section data x_v ∈ ℝ³ at each node for a given dyad.
    Components: (escalation_intensity, information_content, force_signal)
    
    Display (α > 0): high display intensity, low info content, 
                      force_signal = perceived (can be bluffed)
    Clinch (α = 0):  max escalation, max info content,
                      force_signal = actual F_max (unfalsifiable)
    """
    f_max_a = compute_f_max(dyad.mass_a)
    f_max_b = compute_f_max(dyad.mass_b)
    e_ratio_a = compute_e_ratio(dyad.mass_a)
    e_ratio_b = compute_e_ratio(dyad.mass_b)
    delta_m = compute_delta_m(dyad.mass_a, dyad.mass_b)
    
    # Bluff factor: smaller males that display elevated postures
    # are "bluffing" — trying to appear larger than they are
    bluff = 0.0
    if dyad.elevated_by == 'smaller':
        bluff = 0.3  # significant bluff signal
    elif dyad.elevated_by in ('both_S', 'both_B'):
        bluff = 0.1  # mild mutual display
    
    # Perceived mass asymmetry (Display) vs actual (Clinch)
    perceived_delta = delta_m * (1 - bluff)  # bluff reduces perceived asymmetry
    
    sections = {}
    
    # Display: α > 0, information filtered through representation
    sections[DISPLAY] = np.array([
        0.3,                          # escalation: low
        0.4 + 0.2 * abs(perceived_delta),  # info: partial (visual assessment)
        f_max_a * (1 + bluff) - f_max_b    # force signal: can be inflated by bluff
    ])
    
    # Encompassing: α ≈ 0.5, lateral display gives better size info
    sections[ENCOMPASS] = np.array([
        0.5,                          # escalation: medium
        0.6 + 0.2 * abs(delta_m),    # info: better (side-by-side comparison)
        f_max_a - f_max_b            # force signal: closer to truth
    ])
    
    # Clinch: α = 0, direct physical contact, unfalsifiable
    sections[CLINCH] = np.array([
        0.8,                          # escalation: high
        1.0,                          # info: complete (direct contact)
        f_max_a - f_max_b            # force signal: actual (no bluff possible)
    ])
    
    # Catch: α = 0, wrestling — endurance matters
    sections[CATCH] = np.array([
        0.95,                         # escalation: very high
        1.0,                          # info: complete
        e_ratio_a - e_ratio_b        # endurance differential
    ])
    
    # Subpressive: resolution
    sections[SUBPRESSIVE] = np.array([
        1.0 if dyad.fight else 0.0,   # max if reached, 0 if not
        1.0,                           # info: complete
        delta_m                        # final asymmetry = actual mass diff
    ])
    
    return sections


# ============================================================
# 5. THREE COMPETING RESTRICTION MAPS
# ============================================================

def restriction_map_SAG(edge: Tuple[int,int], dyad: Dyad) -> np.ndarray:
    """
    Sequential Assessment Game restriction maps.
    Key assumption: contestants assess RELATIVE fighting ability.
    Restriction maps weight Δm and F_max heavily.
    The D→Cl map projects out the bluff dimension.
    """
    maps = {
        (0,1): np.array([  # Display → Encompassing
            [0.8, 0.0, 0.0],   # escalation transfers
            [0.0, 0.9, 0.0],   # info improves
            [0.0, 0.0, 0.7],   # force signal: some bluff still passes
        ]),
        (1,2): np.array([  # Encompassing → Clinch (THE CRITICAL MAP)
            [1.0, 0.0, 0.0],
            [0.0, 1.0, 0.0],   # info becomes complete
            [0.0, 0.0, 1.0],   # force signal: bluff eliminated
        ]),
        (2,3): np.array([  # Clinch → Catch
            [1.0, 0.0, 0.0],
            [0.0, 1.0, 0.0],
            [0.0, 0.0, 0.5],   # SAG: force matters less than assessment
        ]),
        (3,4): np.array([  # Catch → Subpressive
            [1.0, 0.0, 0.0],
            [0.0, 1.0, 0.0],
            [0.0, 0.0, 1.0],
        ]),
    }
    return maps[edge]


def restriction_map_ATTRITION(edge: Tuple[int,int], dyad: Dyad) -> np.ndarray:
    """
    Energetic War of Attrition restriction maps.
    Key assumption: endurance (E_ratio) determines outcome.
    Phase duration matters more than assessment accuracy.
    """
    maps = {
        (0,1): np.array([
            [0.9, 0.0, 0.0],
            [0.0, 0.5, 0.0],   # info: less important in attrition
            [0.0, 0.0, 0.9],
        ]),
        (1,2): np.array([
            [1.0, 0.0, 0.0],
            [0.0, 0.7, 0.0],
            [0.0, 0.0, 1.0],
        ]),
        (2,3): np.array([  # Clinch → Catch: endurance dominates
            [1.0, 0.0, 0.0],
            [0.0, 1.0, 0.0],
            [0.0, 0.0, 1.2],   # endurance amplified (>1 = increased weight)
        ]),
        (3,4): np.array([
            [1.0, 0.0, 0.0],
            [0.0, 1.0, 0.0],
            [0.0, 0.0, 1.0],
        ]),
    }
    return maps[edge]


def restriction_map_CUMULATIVE(edge: Tuple[int,int], dyad: Dyad) -> np.ndarray:
    """
    Cumulative Assessment Game restriction maps.
    Key assumption: each individual assesses only own accumulated cost.
    No mutual assessment required. Damage accumulates.
    """
    maps = {
        (0,1): np.array([
            [1.0, 0.0, 0.0],
            [0.0, 0.3, 0.0],   # info: irrelevant (no mutual assessment)
            [0.0, 0.0, 1.0],
        ]),
        (1,2): np.array([
            [1.0, 0.0, 0.0],
            [0.0, 0.4, 0.0],
            [0.0, 0.0, 1.0],
        ]),
        (2,3): np.array([  # Clinch → Catch: damage accumulates
            [1.2, 0.0, 0.0],   # escalation amplified (cost grows)
            [0.0, 0.5, 0.0],
            [0.0, 0.0, 0.8],
        ]),
        (3,4): np.array([
            [1.0, 0.0, 0.0],
            [0.0, 0.5, 0.0],
            [0.0, 0.0, 1.0],
        ]),
    }
    return maps[edge]


# ============================================================
# 6. SHEAF LAPLACIAN COMPUTATION
# ============================================================

def compute_edge_disagreement(
    sections: Dict[int, np.ndarray],
    edge: Tuple[int, int],
    restriction_map: np.ndarray,
    max_phase: int
) -> float:
    """
    Compute disagreement ‖F_{u→e}(x_u) - F_{v→e}(x_v)‖² at one edge.
    
    If the dyad didn't reach this phase, disagreement is 0
    (the edge is not activated — consistent with SAG prediction
    that asymmetric dyads resolve early).
    """
    u, v = edge
    
    # Only compute disagreement for phases actually reached
    if max_phase < v:
        return 0.0
    
    x_u = sections[u]
    x_v = sections[v]
    
    # Apply restriction map: what u's data predicts v should be
    predicted_v = restriction_map @ x_u
    
    # Disagreement = squared norm of difference
    return np.sum((predicted_v - x_v) ** 2)


def compute_gamma(
    dyad: Dyad,
    restriction_map_fn,
) -> Tuple[float, float, List[float]]:
    """
    Compute sheaf convergence Γ for a single dyad under a given model.
    
    Γ = 1 - (x^T L_F x) / (x^T x)
    
    Returns: (Gamma, total_energy, per_edge_disagreements)
    """
    sections = build_section_data(dyad)
    
    edge_disagreements = []
    total_energy = 0.0
    
    for edge in EDGES:
        R = restriction_map_fn(edge, dyad)
        d = compute_edge_disagreement(sections, edge, R, dyad.max_phase_reached)
        edge_disagreements.append(d)
        total_energy += d
    
    # Compute ||x||²
    x_norm_sq = sum(np.sum(sections[v] ** 2) for v in range(5))
    
    if x_norm_sq == 0:
        return 1.0, 0.0, edge_disagreements
    
    gamma = 1.0 - total_energy / x_norm_sq
    
    return gamma, total_energy, edge_disagreements


# ============================================================
# 7. MAIN ANALYSIS
# ============================================================

def run_analysis():
    """Run the full sheaf ethology pilot analysis."""
    
    print("=" * 70)
    print("SHEAF ETHOLOGY PILOT — Varanid Combat Coherence Analysis")
    print("Draken 2045 Framework, Prediction P8")
    print("=" * 70)
    
    # Generate synthetic dyads
    dyads = generate_frydlova_dyads(n=99)
    
    # Validate against Frýdlová's statistics
    n_aggressive = sum(1 for d in dyads if d.attack)
    n_fights = sum(1 for d in dyads if d.fight)
    n_elevation = sum(1 for d in dyads if d.elevated_by != 'none')
    fights_heavier_offends = sum(
        1 for d in dyads if d.fight and d.offender == 'bigger'
    )
    
    print(f"\n--- Synthetic Dataset Validation ---")
    print(f"Total dyads:             {len(dyads)}")
    print(f"With elevation:          {n_elevation} ({100*n_elevation/len(dyads):.0f}%)"
          f"  [target: 77%]")
    print(f"With aggression:         {n_aggressive} ({100*n_aggressive/len(dyads):.0f}%)"
          f"  [target: 37%]")
    print(f"With contact fight:      {n_fights} ({100*n_fights/len(dyads):.0f}%)"
          f"  [target: ~24%]")
    if n_fights > 0:
        print(f"Heavier = offender:      {fights_heavier_offends}/{n_fights}"
              f" ({100*fights_heavier_offends/n_fights:.0f}%)"
              f"  [target: 79%]")
    
    # Run three models
    models = {
        'SAG (Sequential Assessment)': restriction_map_SAG,
        'Energetic War of Attrition':  restriction_map_ATTRITION,
        'Cumulative Assessment':       restriction_map_CUMULATIVE,
    }
    
    print(f"\n--- Sheaf Laplacian Analysis ---")
    print(f"Graph: 5 nodes (D→E→Cl→Ca→S), 4 edges")
    print(f"Section data: x_v ∈ ℝ³ (escalation, information, force_signal)")
    
    results = {}
    
    for model_name, map_fn in models.items():
        gammas = []
        energies = []
        edge_disagrs = {e: [] for e in EDGES}
        
        for dyad in dyads:
            g, e, eds = compute_gamma(dyad, map_fn)
            gammas.append(g)
            energies.append(e)
            for i, edge in enumerate(EDGES):
                edge_disagrs[edge].append(eds[i])
        
        gammas = np.array(gammas)
        energies = np.array(energies)
        
        results[model_name] = {
            'mean_gamma': np.mean(gammas),
            'std_gamma': np.std(gammas),
            'median_gamma': np.median(gammas),
            'mean_energy': np.mean(energies),
            'gammas': gammas,
        }
        
        print(f"\n  {model_name}:")
        print(f"    Γ = {np.mean(gammas):.4f} ± {np.std(gammas):.4f}"
              f"  (median: {np.median(gammas):.4f})")
        print(f"    H = {np.mean(energies):.4f} ± {np.std(energies):.4f}")
        
        # Per-edge analysis
        print(f"    Per-edge mean disagreement:")
        for edge in EDGES:
            eds = np.array(edge_disagrs[edge])
            nonzero = eds[eds > 0]
            print(f"      {PHASE_NAMES[edge[0]]}→{PHASE_NAMES[edge[1]]}: "
                  f"{np.mean(eds):.4f}"
                  f"  (active in {len(nonzero)}/{len(eds)} dyads)")
    
    # Compare models
    print(f"\n--- Model Comparison ---")
    ranked = sorted(results.items(), key=lambda x: x[1]['mean_gamma'], reverse=True)
    
    for rank, (name, r) in enumerate(ranked, 1):
        print(f"  #{rank}: {name}")
        print(f"       Γ = {r['mean_gamma']:.4f} ± {r['std_gamma']:.4f}")
    
    winner = ranked[0][0]
    margin = ranked[0][1]['mean_gamma'] - ranked[1][1]['mean_gamma']
    
    print(f"\n  Winner: {winner}")
    print(f"  Margin: ΔΓ = {margin:.4f}")
    
    # Subgroup analysis: fights vs non-fights
    print(f"\n--- Subgroup Analysis: Fights vs Non-Fights ---")
    for model_name, map_fn in models.items():
        fight_gammas = []
        nonfight_gammas = []
        for dyad in dyads:
            g, _, _ = compute_gamma(dyad, map_fn)
            if dyad.fight:
                fight_gammas.append(g)
            else:
                nonfight_gammas.append(g)
        
        if fight_gammas:
            print(f"  {model_name}:")
            print(f"    Fights (n={len(fight_gammas)}):     "
                  f"Γ = {np.mean(fight_gammas):.4f}")
            print(f"    Non-fights (n={len(nonfight_gammas)}): "
                  f"Γ = {np.mean(nonfight_gammas):.4f}")
    
    # Key diagnostic: bluff detection
    print(f"\n--- Bluff Detection (α > 0 → α = 0 transition) ---")
    bluff_dyads = [d for d in dyads if d.elevated_by == 'smaller']
    nonbluff_dyads = [d for d in dyads if d.elevated_by != 'smaller' 
                      and d.elevated_by != 'none']
    
    for model_name, map_fn in models.items():
        bluff_g = [compute_gamma(d, map_fn)[0] for d in bluff_dyads]
        nonbluff_g = [compute_gamma(d, map_fn)[0] for d in nonbluff_dyads]
        
        if bluff_g and nonbluff_g:
            print(f"  {model_name}:")
            print(f"    Smaller-displays (bluff, n={len(bluff_g)}): "
                  f"Γ = {np.mean(bluff_g):.4f}")
            print(f"    Other displays (n={len(nonbluff_g)}):        "
                  f"Γ = {np.mean(nonbluff_g):.4f}")
            delta = np.mean(nonbluff_g) - np.mean(bluff_g)
            print(f"    ΔΓ (bluff penalty): {delta:+.4f}")
    
    print(f"\n{'=' * 70}")
    print(f"CONCLUSION")
    print(f"{'=' * 70}")
    print(f"The {winner} model produces the highest mean Γ,")
    print(f"suggesting its restriction maps best capture the empirical")
    print(f"coherence structure of varanid ritualized combat.")
    print(f"\nNOTE: This analysis uses synthetic data generated from")
    print(f"published aggregate statistics. Validation requires the")
    print(f"original per-dyad data from Frýdlová et al. (2016).")
    print(f"{'=' * 70}")
    
    return results


if __name__ == '__main__':
    results = run_analysis()
