# Check In Berita AI Demo Script

Total time: **3-minute demonstration + 2-minute Q&A**.

Before starting, open the running app and use the included `public/demo-claim.png` fixture. Keep the original evidence source available in a browser tab for the human-verification step.

## 3-minute demonstration

### 0:00–0:20 — Problem and promise

“Check In Berita AI helps review Malaysian claims against a curated evidence registry. It supports both typed claims and screenshots, while keeping the evidence and its limitations visible.”

### 0:20–0:50 — Start with a claim

Show the claim input and the evidence-checking workflow. Paste:

> Malaysia's inflation rate was 1.8% in 2024.

Explain that the checker compares wording with bundled curated entries; it does not claim to search or settle the entire live web.

### 0:50–1:35 — Screenshot OCR with an honest fallback

Select `demo-claim.png` in the screenshot input. Point out PNG/JPG validation, the local preview, and browser-side OCR progress. When recognition finishes, edit the extracted text if needed.

If OCR assets are slow or unavailable, click **Use prepared demo OCR text** while the attempt is running, or allow the failure fallback to appear. Say explicitly:

“This is the labeled prepared-demo fallback, not arbitrary-image recognition. For an ordinary image with unavailable OCR assets, Check In Berita AI shows an error and keeps the preview instead.”

Click **Check this text** to send the reviewed text to the checker.

### 1:35–2:20 — Explain the result, then inspect evidence

Show the matched claim, verdict, and explanation. Open or point to the cited evidence and identify its publisher, wording, and date. Emphasize that the registry is finite and can age, and that a person should inspect the original source before relying on a result.

### 2:20–2:45 — Architecture and privacy

“This is a React, TypeScript, and Vite static frontend. Matching uses local curated data, and Tesseract.js OCR runs in the browser. There is no application backend, account, API key, or external AI charge. Offline use still depends on cached app and OCR language assets.”

### 2:45–3:00 — Close

“Check In Berita AI makes the path from claim to editable text, explanation, and source evidence visible. Its purpose is faster human verification—not replacing it.”

## 2-minute Q&A

### 0:00–0:30 — Does it verify any new claim on the live web?

No. It checks against a curated, bundled registry. Novel or poorly matched claims need additional research and human review.

### 0:30–1:00 — Does OCR work offline?

Only when the app and required Tesseract worker/core/language assets are available, normally through prior caching. Otherwise arbitrary-image OCR reports an error. The prepared fallback is restricted to demo-named PNG/JPG files and is always labeled.

### 1:00–1:30 — Why should anyone trust the verdict?

Trust must come from inspectable evidence, not the interface alone. Review the original source, date, context, and registry coverage; correct OCR errors and update weak or stale evidence.

### 1:30–2:00 — What does it cost, and where does processing happen?

The prototype is a zero-cost static frontend with no external AI API or application server. Claim matching and OCR happen in the browser; static hosting can use a no-cost tier. Network access may still be needed for initial assets.
