# HVAC Study Hub — Complete Deployment

**Live Site:** https://austin9746-web.github.io/HVAC-Study  
**Repository:** github.com/austin9746-web/HVAC-Study  
**Status:** UA Local 400 WCC Class of 2026 Study Platform

---

## 📊 File Inventory

### Course Practice Exams (7 tools | 1,259 questions)
1. **Master_HVAC_Exam.html** — 600 questions, all subjects, category/type selectors
2. **Hydronics_Final_Study_Tool.html** — 119 questions: piping, valves, pumps, heat transfer
3. **Steam_Exam_Study_Tool.html** — 143 questions: boilers, traps, condensate, safety
4. **HVACR_Practice_Exam_Full.html** — 120 questions: core refrigeration cycle
5. **1st_Year_Final_Study_Tool.html** — 120 questions: first-year review + 16 math problems
6. **Adv_Refrigeration_Final_Study_Tool.html** — 174 questions: advanced refrigeration
7. **Practice_Test_Study_Tool.html** — 61 questions: fundamentals (BTU, pressure, volume, density)

### Specialty & Certification (6 tools | 166 questions)
1. **EPA_608_Certification_Prep.html** — 67 questions: Core/Type I/II/III with section selector
2. **Wiring_Diagrams_Study_Tool.html** — 22 questions: 3 SVG circuit diagrams (schematic symbols)
3. **HVAC_Math_Formulas.html** — **65 questions**: BTU, compression ratio, PT charts, Ohm's Law, hydronic, conversions, tonnage, COP/SEER/EER
4. **HVAC_Math_Review.html** — 12 worked solution problems with step-by-step walkthrough (legacy)
5. **Electrical_Symbols.html** — 19 SVG flashcards: switches, relays, capacitors, motors, controls
6. **Diagram_Questions_Review.html** — Schematic diagram interpretation (legacy)

### Field Reference & Calculators (10 tools)
1. **index.html** — Landing page: auth system, cross-tool search (800+ items), 3-section navigation
2. **Tube_Bending_Calculator.html** — SB/ADV/HB/Gain formulas, 5-step procedure, bender charts
3. **EMT_Conduit_Bending.html** — Stub-ups, back-to-back, offsets, 3pt/4pt saddles, kicks
4. **Threaded_Pipe_Reference.html** — Cut length calculator, take-offs, thread engagement, NPT data
5. **Refrigerant_PT_Charts.html** — 10 refrigerants (R-410A, R-454B, R-32, R-22, R-134a, R-404A, R-407C, R-1234yf, CO2, NH3) with 1°/5°/10° toggle, A2L data
6. **Refrigerant_Charging.html** — Subcooling/superheat walkthrough, live diagnosis, 5 refrigerants
7. **Gas_Pipe_Sizing.html** — Gas pipe sizing (IFGC tables) + duct sizing with equivalent lengths
8. **Troubleshooting_Flowcharts.html** — 5 interactive diagnostic trees: no-start, high head, low suction, no heat, short cycling
9. **Nitrogen_Pressure_Test.html** — Gay-Lussac's Law calculator, temp compensation, standing test leak detection
10. **VFD_Cross_Reference.html** — Variable frequency drive reference (legacy)

### Support Files (3 files)
- **manifest.json** — PWA manifest for "Add to Home Screen" (iOS/Android)
- **sw.js** — Service worker for offline cache-first strategy
- **google_apps_script.js** — Cloud sync code (Apps Script, cloud features removed from UI)

---

## 🎯 Quiz Engine Features (all tools use canonical template)

### Core Modes
- **Practice Mode** — Answer questions, instant feedback, explanations, topic analysis on results
- **Exam Mode** — Timed, no explanations, percentage scoring, answer review after
- **Flashcard Mode** — Pure recall, one-word answers, progress tracking

### Built-in Tools
- **Scientific Calculator** — Trig, log, sqrt, pi, e, factorial, powers (CALC button in sticky nav)
- **Question Map** — Visual grid of all questions, color-coded by status (correct/wrong/flagged/unanswered)
- **Reference Panel** — Context-specific data: PT charts, steam tables, formulas (REF button)
- **Dark/Light Toggle** — Theme persistence in localStorage
- **Save & Resume** — Saves progress on every answer, picks up where you left off
- **Keyboard Nav** — Arrow keys + Enter to navigate/submit

### Question Types
- **Multiple Choice (MC)** — 4 options, per-option explanations
- **True/False (TF)**
- **Fill in the Blank**
- **Short Answer**
- **Essay**
- **Numerical** — Type the exact answer (with tolerance matching)

### Data Structure
```javascript
{n: 1,              // question number
 p: 2,              // point value
 t: 'mc',           // question type
 q: 'question text',
 o: ['A','B','C','D'], // options (MC/TF/Fill only)
 a: 0,              // answer index
 ex: ['exp0','exp1','exp2','exp3']}  // per-option explanations
```

---

## 🔐 Authentication System

- **Login/Signup** at index.html
- **Admin Dashboard** (admin / admin2026) — Manage users
- **Session Storage** — localStorage `hvac_session` (username)
- **Password Hashing** — Dual FNV-1a + murmur hash
- **Persistent Progress** — Per-tool per-user: STORE_KEY = `hvac_stats_{toolId}_{username}`

---

## 📱 Progressive Web App (PWA)

- **Offline Support** — Cache-first for static assets, stale-while-revalidate for content
- **Service Worker (sw.js)** — Registered individually in every HTML file
- **Add to Home Screen** — iOS/Android native app-like experience
- **Manifest (manifest.json)** — SVG logo (shield with snowflake/flame/wrench + gauge)

---

## 🔧 Deployment Instructions

### GitHub Pages (Current Setup)
1. Push all files to `github.com/austin9746-web/HVAC-Study`
2. Ensure `index.html` and all `.html` files are in root
3. GitHub Pages auto-deploys from main branch
4. Site goes live at `https://austin9746-web.github.io/HVAC-Study/`

### Local Testing
```bash
# Start a local HTTP server
python3 -m http.server 8000
# Visit http://localhost:8000/index.html
```

---

## 📈 Statistics

| Metric | Count |
|--------|-------|
| Total Tools | 23 |
| Total Questions | 1,500+ |
| Unique Topics | 40+ |
| SVG Diagrams | 12 |
| Audio/Video | 0 |
| Cloud Features | Deprecated (removed UI) |
| Mobile Responsive | 100% |
| PWA Capable | Yes |

---

## 🐛 Known Issues & Pending

### Completed
✅ Leaderboard removed (deprecated)  
✅ eval() security hardened → sanitized Function()  
✅ Password hashing upgraded (dual FNV-1a + murmur)  
✅ Quote escaping fixed across all tools  
✅ PWA offline caching implemented  
✅ Mobile sticky nav (CALC + REF inline)  
✅ Dark/light theme toggle  
✅ Save/resume with beforeunload handlers  
✅ Cross-tool search (800+ items indexed)  
✅ PT charts for 10 refrigerants with A2L support  
✅ Nitrogen pressure test calculator  
✅ Troubleshooting flowcharts (5 decision trees)  
✅ 65-question math problems set

### Pending / Future
- [ ] Timed mock exams (random 50 questions, 60-min countdown)
- [ ] Daily challenge streak counter
- [ ] Refrigeration cycle simulator (animated diagram)
- [ ] Instructor mode (custom quiz builder + results dashboard)
- [ ] Print results to PDF
- [ ] Motor troubleshooting guide (ohmmeter readings → diagnosis)
- [ ] More EPA 608 questions (currently 67, real exam ~100)
- [ ] More Wiring Diagram questions (currently 22)
- [ ] EPA 608 enhancement: CALC, REF, flashcards, save/resume

---

## 📝 Key Files for Update

**On each commit, ensure these are fresh:**
- `index.html` — Search index + tool manifest must reflect all 23 tools
- `manifest.json` — App name, logo, colors
- `sw.js` — Cache list must match deployed files
- All `.html` tool files — Validate JS before commit

---

## 🎓 Built for

**User:** Austin Chase (achase@400jatc.org)  
**Program:** UA Local 400 HVAC Apprenticeship  
**Class:** WCC Class of 2026  
**Purpose:** Self-study platform for theory, code references, practical calculations, and exam prep

---

**Last Updated:** April 2026  
**Deployment Status:** Production Ready ✅
