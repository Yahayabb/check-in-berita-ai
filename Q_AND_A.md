# Check In Berita AI — Judge and Reviewer Q&A

**Rehearsal rule:** “Current” means behavior present in this repository. “Next,” “should,” and “would” describe proposed work, not completed features or committed dates.

## Highest-priority questions

### 1. Why is “AI” in the name when there is no external AI API?

“AI” describes the assistive workflow, not a cloud chatbot or an autonomous truth engine. The current product combines Tesseract.js screenshot OCR with deterministic text normalisation and token-similarity matching against local evidence. There is no generative model, external AI API, or machine-learned claim-verdict model. The most precise description is **an AI-assisted evidence-review prototype**.

**If pressed:** AI does not have to mean a paid external API, but the name must not imply capabilities the product lacks. The claim verdict itself is deterministic registry lookup; OCR and matching assist a human reviewer.

### 2. Can it verify any new claim against the live web?

No. It currently checks input against **six bundled, curated demonstration claim entries**; it does not crawl, search, or retrieve the live web. Source links let a reviewer open the original publisher, but the checker does not fetch those pages or reassess them. A novel claim with no qualifying registry match receives **“Insufficient evidence,” not “false.”**

**If pressed:** The entries cover selected inflation, unemployment, poverty/household-income, and public-health metadata claims. This is a workflow demonstration, not comprehensive Malaysian fact-checking coverage.

### 3. What does “Supported” or “Contradicted” actually mean, and how is the verdict calculated?

It means **the matched registry record carries that stored verdict**, based on its recorded comparison—not that the app has independently established truth. After matching, `verifyClaim` returns the entry’s verdict together with its stored explanation, claimed and comparison values, calculation, source, scope, and limitations. It does not parse arbitrary evidence and derive a new verdict, and it does not produce a truth percentage.

**If pressed:** Every bundled claim is marked as needing human verification. Treat the result as “what this demonstration registry says,” then inspect the original evidence before relying on it.

### 4. How does claim matching work, and could it match a false or opposite claim?

The matcher normalises casing, punctuation, Unicode, percentages, and common English/Malay stop words. It tries exact aliases first, then chooses the best weighted Jaccard token-set similarity at or above **0.42**; numeric tokens receive double weight. This is explainable, but it is not semantic entailment. Negation, antonyms, changed numbers, word order, and sarcasm can therefore cause false matches, so a real opposite claim could inherit the wrong stored verdict.

**If pressed:** Below-threshold input returns “Insufficient evidence,” but the threshold is not a calibrated probability or a guarantee against false positives. The interface exposes the matched registry wording for review. A future release should test negation, number/date swaps, near-duplicates, and competing matches, then calibrate rejection and ambiguity handling on a labelled benchmark.

### 5. How do you handle finite coverage and stale evidence?

The app shows each entry’s source metadata, scope, and limitations, but it does not automatically update evidence, detect staleness, or prove registry completeness. A stale entry can still produce its stored verdict if the wording matches. At present, updating evidence means changing the bundled data and rebuilding/redeploying the frontend; there is no CMS, scheduled ingestion, expiry check, or documented editorial sign-off workflow.

**If pressed:** A proposed evidence pipeline should add provenance, last-reviewed and expiry dates, reviewer sign-off, change history, and periodic revalidation. Until then, currency and coverage remain explicit human-review responsibilities.

### 6. Why should we trust the sources and registry values?

Trust should come from inspecting the evidence, not from the interface. The registry names official publishers—DOSM and the Ministry of Health—and provides titles, links, dates, calculations, and limitations. However, **all six entries are demonstration fixtures with human verification still pending**. The repository contains no independent reviewer approval record, source-credibility score, or cross-source corroboration process.

**If pressed:** The health fixture says its metadata was found through public search and its PDF was not human-reviewed in that session. Official sources are appropriate starting points for official statistics, but they are not a substitute for checking methodology, context, currency, and, where needed, independent sources. The three coverage profiles are fictional and synthetic.

### 7. Is screenshot OCR real, and what exactly is the demo fallback?

Yes. For ordinary PNG/JPEG files, the app dynamically loads Tesseract.js and performs OCR in the browser, shows progress, and places the result in an editable field. The fallback is different: a filename containing **`demo` or `check-in-berita`** can receive one prepared inflation claim, either through the visible shortcut during OCR or after OCR fails. That text is selected by filename, not recognised from the pixels, and is always labelled **“Demo OCR fallback — prepared text, not arbitrary-image recognition.”**

**If pressed:** For an ordinary image, OCR failure shows an error and preserves the preview; it does not silently substitute prepared text. The file input accepts PNG/JPEG by MIME type, and current OCR requests English (`eng`) only.

### 8. How do you stop OCR mistakes from becoming false verdicts?

The current safeguard is an editable review step, not automatic error correction. Users should compare recognised text with the screenshot and correct it before checking. OCR noise can cause a miss, but it can also contribute to a false lexical match; the app does not currently calculate OCR word-error rate, assess image quality, or block a result based on OCR uncertainty.

**If pressed:** OCR and registry matching are separate failure stages, so both need review. A future evaluation should include noisy screenshots and measure OCR quality and end-to-end false-match rates rather than demonstrating only clean prepared input.

### 9. Is it private and fully offline?

The OCR component does not upload the selected image to an application server, and claim matching runs locally in the browser. There is no application backend, account, or database. However, **“browser-based” does not mean “no network ever” or “fully offline.”** Initial app delivery, Google Fonts, Tesseract worker/core/language assets, and opened evidence links can require network access; normal hosting and third-party request metadata are not eliminated.

**If pressed:** A normal static build has no service worker guaranteeing offline reuse. Offline OCR depends on the required app and OCR assets already being available, normally through caching. The safe claim is “no application upload endpoint and local claim processing,” not absolute anonymity or guaranteed offline operation.

### 10. What does it cost to run?

The prototype has no external AI API charge, API key, application server, or database and can be deployed on a no-cost static-hosting tier, subject to the provider’s terms. That is the meaning of **“zero-cost frontend.”** It does not mean the total product or operation is cost-free.

**If pressed:** Human evidence curation, verification, maintenance, user devices, bandwidth, and hosting beyond a free tier still cost time or money. The repository does not contain a production cost model or measured hosting bill.

### 11. What is the technical architecture?

It is a static single-page frontend built with **React 19, TypeScript, and Vite**. Claim and profile fixtures ship as TypeScript data modules; pure functions handle normalisation, matching, and registry-result selection; React components handle the checker, results, and profiles. Tesseract.js is dynamically imported for browser OCR. Vitest, jsdom, and Testing Library support tests. There is no application backend, database, authentication system, or external AI service.

**If pressed:** The 500 ms “checking” delay in `App.tsx` is UI pacing, not model inference time. Because the registry ships to the browser, it is inspectable client-side data, not a protected server-side evidence store.

### 12. What testing and evaluation support your reliability claims?

At Q&A preparation, `npm test -- --run` passed **18 tests across four test files**. They cover text normalisation, exact/paraphrased/unrelated matching, deterministic verdict lookup, insufficient-evidence behavior, selected registry-data invariants, PNG/JPEG validation, and the main React result flow. These tests establish specific behaviors, **not real-world fact-checking accuracy**.

**If pressed:** There is no labelled evaluation corpus, precision/recall result, OCR word-error-rate measurement, or production user study. Real Tesseract recognition, the OCR fallback component, broad adversarial matching, cross-browser behavior, and end-to-end accessibility are not comprehensively tested here. Do not quote an accuracy percentage.

### 13. What accessibility and localisation support is actually implemented?

The current UI includes labelled inputs, a skip link, live status/result regions, semantic tabs with arrow/Home/End keyboard handling, preview alt text, and progress markup. The registry includes English and Bahasa Malaysia aliases, and a translation dictionary exists. However, the main interface is not wired to a language switch and remains primarily English; OCR currently requests English only.

**If pressed:** Do not claim full Bahasa Malaysia localisation, Malay OCR, WCAG conformance, or a completed screen-reader audit. A next localisation pass should connect all UI strings, add and test Malay OCR, review language metadata, and run keyboard, screen-reader, contrast, and automated accessibility checks.

### 14. How would this scale beyond six claims?

Static assets can be distributed cheaply through ordinary static hosting/CDNs, but evidence operations and match quality do not scale automatically. Current matching scans every claim and alias in the browser, bundled data grows the client payload, and OCR performance depends on the user’s device. There is no search index, evidence service, ingestion queue, reviewer workflow, or measured large-corpus performance.

**If pressed:** A proposed scale-up should first establish a versioned evidence store, review process, and evaluation gates, then add indexing or a backend where justified. No repository benchmarks support claims about a particular user load, corpus size, or latency.

### 15. What is the responsible human-verification workflow?

Use the result as decision support, never as the sole basis for publication or an important decision. Review and edit OCR text; inspect the matched claim and alias; compare values, units, geography, period, calculation, and limitations; open the original source; then check publisher methodology, date, context, and currency with a qualified reviewer or current primary sources.

**If pressed:** Every current registry entry carries `needsHumanVerification: true`, and the UI displays a human-review warning. The repository does not implement reviewer accounts, approval states, audit logs, or a final editorial sign-off process.

### 16. Are the coverage profiles judging real people or claiming bias?

No. The three profiles are explicitly fictional entities with synthetic demonstration counts. “Coverage inclination” summarises topic counts, scrutiny counts, official-data citation counts, and source mix within a stated sample; it is presented as context, not a judgement about a person or outlet. Rates are derived from integer counts, invalid denominators produce “Insufficient sample,” and there is deliberately no “truth percentage.”

**If pressed:** These fixtures cannot support claims about real-world bias, credibility, or behaviour. Any future real-entity profiling would need representative sampling, transparent coding rules, independent review, dispute/correction handling, and careful legal and ethical assessment.

### 17. What prevents gaming, misuse, or malicious file input?

The current prototype favours visible limitations over claims of hardened abuse resistance. Prepared fallback text can be triggered by a qualifying filename, but it is fixed and prominently labelled; lexical matching can also be gamed because it is not semantic understanding. File validation checks only the browser-provided PNG/JPEG MIME type. There is no account system, rate limit, file-size policy, security certification, or comprehensive adversarial test suite in the repository.

**If pressed:** Do not describe the MVP as tamper-proof or production-hardened. Before wider deployment, proposed work should include file size/dimension limits and real-image decoding tests, adversarial matching tests, accessible abuse reporting, and security/privacy review. Any future server ingestion would add a new threat model.

### 18. What is the strongest next milestone?

The recommended next milestone is **a human-reviewed, versioned evidence release with a repeatable evaluation harness—not immediate live-web search**. First review the existing entries and record provenance, reviewer, review date, scope, and corrections. In parallel, build an English/Bahasa Malaysia test set covering paraphrases, unrelated claims, negation, changed numbers/dates, ambiguous matches, and OCR noise; publish match false-positive/false-negative results and set release gates.

**If pressed:** This milestone attacks the largest current risks together: unverified fixtures and unmeasured matching. Live retrieval should come only after those foundations, with cited extraction, freshness checks, source diversity, and human adjudication. This is a proposed priority, not a completed roadmap item or a dated commitment.

## Do not overclaim

- **Not live-web or general-purpose fact-checking:** six bundled demonstration entries; no live retrieval or freshness verification.
- **Not an autonomous truth engine:** deterministic registry verdicts and lexical similarity, with no generative model, external AI API, truth probability, or semantic proof.
- **Not independently verified evidence:** every claim still needs human review; official-source citations are not reviewer sign-off, and all coverage profiles are fictional/synthetic.
- **Not arbitrary-image fallback OCR:** prepared text is filename-triggered, fixed, and labelled; real OCR can fail or make mistakes.
- **Not guaranteed offline or absolutely private:** processing is browser-side and there is no app upload endpoint, but app, font, OCR-asset, hosting, and source-link network activity can still occur.
- **Not fully localised or accessibility-certified:** English/Malay aliases exist, but full UI localisation, Malay OCR, and accessibility audits are not complete.
- **Not accuracy- or scale-validated:** 18 passing tests cover selected behaviors; they are not accuracy, load, security, or production-readiness metrics.
- **Next steps are proposals:** do not present the evidence pipeline, benchmark, live retrieval, or hardening work as already implemented or scheduled.
