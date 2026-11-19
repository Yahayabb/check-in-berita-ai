# Check In Berita AI

Check In Berita AI is a zero-cost frontend prototype for checking Malaysian claims against a curated evidence registry. It combines an explainable claim-checking workflow with browser-based screenshot OCR; it does not make a live-web determination of truth.

## Run locally

```sh
npm install
npm run dev
```

Run the unit tests and create a production build:

```sh
npm test -- --run
npm run build
```

## Features

- Check a claim against bundled, curated Malaysian evidence and review the resulting explanation and sources.
- Extract editable text from PNG and JPG screenshots with Tesseract.js running in the browser.
- Preview the selected image, follow OCR progress, correct recognized text, and send it to the claim checker.
- Reject unsupported file types before OCR starts.
- Use a React, TypeScript, and Vite frontend with no account, API key, paid AI service, or application backend.

## Offline and OCR limitations

The bundled evidence does not need a live lookup, but a normal static build is not guaranteed to work offline on a first visit or after every refresh. Browser/hosting cache behavior determines whether the application assets remain available.

Tesseract.js may also need to fetch its worker, core, or English language assets. If those assets are unavailable, OCR for an arbitrary image can fail; the interface reports that failure honestly and preserves the image preview.

For deterministic demonstrations only, a PNG/JPG filename containing `demo` or `check-in-berita` receives prepared text if OCR cannot complete. The interface labels this as **“Demo OCR fallback — prepared text, not arbitrary-image recognition.”** The optional prepared-text shortcut is shown only for those demo-named images and never represents arbitrary-image recognition. A ready-to-upload fixture is included at `public/demo-claim.png` (served as `/demo-claim.png` by Vite).

## Evidence and human verification

The registry is curated and finite: it can be incomplete, become outdated, or fail to match the wording of a new claim. OCR can also introduce errors. Review and edit extracted text, inspect the linked original evidence, and verify important claims with a qualified human or current primary sources. A generated verdict is an aid to review, not a guarantee of truth.
