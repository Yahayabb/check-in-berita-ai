# How Qoder Built Check In Berita AI

## Model used

Qoder Desktop coding agent; exact underlying model identifier not exposed

## `/tdd` instruction

The feature instruction began with `/tdd` and explicitly assigned test-first behavior. In this workflow, `/tdd` means:

1. Write a small failing test for the required behavior.
2. Run it and record the expected red result.
3. Write the minimum implementation needed to pass.
4. Rerun the focused test, then run the wider tests and production build.
5. Refactor only while preserving passing behavior.

For screenshot OCR, the first test covered file validation rather than invoking a heavyweight OCR engine. `src/tests/ocr.test.ts` initially failed because `validateImageFile` did not exist. The pure validator was then implemented and the PNG/JPG acceptance and unsupported-type rejection tests passed. Real Tesseract recognition remains a browser integration concern, not a unit-test dependency.

## Four parallel subagents with isolated ownership

The lead divided implementation into four workstreams so parallel edits would not overlap:

| Workstream | Owned scope |
| --- | --- |
| Application shell and interface | `App`, UI components, and styles |
| Curated registry | Claim/evidence fixtures, fictional profiles, and translations |
| Checking engine | Claim matching, verdict explanation, and engine tests |
| OCR and essential documents | `src/features/ocr/`, `src/tests/ocr.test.ts`, `README.md`, `QODER_USAGE.md`, and `DEMO_SCRIPT.md` |

Each agent was instructed to edit only its assigned files. Shared configuration and package files remained outside the OCR/documentation agent's ownership.

## Lead integration

The lead agent owned integration across workstream boundaries: wiring the OCR callback into the claim input, reconciling shared types and UI expectations, running the complete test suite, and checking the strict TypeScript production build. Integration review also checked that unsupported files were rejected, preview object URLs were revoked, OCR races could not overwrite a newer selection, and demo output was visibly distinguished from actual recognition.

## Human evidence review

Qoder assisted with software implementation; it did not independently establish that a claim was true. Curated evidence requires human review of the original publisher, wording, date, context, and source link. Reviewers must correct stale or weak registry entries, inspect OCR output before checking it, and treat the displayed verdict as decision support rather than final adjudication. Demonstration fallback text is prepared content and must never be presented as text recognized from an arbitrary image.

## Zero-cost frontend architecture

Check In Berita AI uses React, TypeScript, and Vite as a static frontend. The curated registry and claim-checking logic ship with the application, while Tesseract.js performs OCR in the browser. There is no application server, database, account system, external AI API, or API key to pay for or secure. It can be hosted on a no-cost static-hosting tier, subject to that provider's terms.

“Zero-cost frontend” does not mean “always offline.” Initial application delivery and Tesseract worker/core/language assets can require network access and depend on caching. Arbitrary-image OCR fails visibly when required assets are unavailable; only narrowly named demo images may use the disclosed prepared fallback.
