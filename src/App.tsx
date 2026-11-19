import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { claims } from './data/claims';
import { profiles } from './data/profiles';
import ScreenshotOcr from './features/ocr/ScreenshotOcr';
import { verifyClaim } from './lib/verifyClaim';
import { Icon } from './components/Icon';
import { VerificationResult } from './components/VerificationResult';

const ENGLISH_EXAMPLE = "Malaysia's inflation rate was 1.8% in 2024.";
const MALAY_EXAMPLE = 'Kadar inflasi Malaysia ialah 1.8% pada 2024.';
const UNMATCHED_MESSAGE =
  'Insufficient evidence: Check In Berita AI could not confidently match this claim to the currently approved evidence registry.';

type InputTab = 'text' | 'screenshot';
type CheckStatus = 'idle' | 'checking' | 'success' | 'error';
type VerificationOutcome = ReturnType<typeof verifyClaim>;

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 44 44" aria-hidden="true">
      <rect width="44" height="44" rx="12" fill="currentColor" />
      <path d="M12 13.5h20M12 30.5h8" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity=".72" />
      <path d="m14 22 5 5 11-12" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<InputTab>('text');
  const [claimText, setClaimText] = useState('');
  const [status, setStatus] = useState<CheckStatus>('idle');
  const [result, setResult] = useState<VerificationOutcome | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [ocrSession, setOcrSession] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestRef = useRef(0);
  const textTabRef = useRef<HTMLButtonElement>(null);
  const screenshotTabRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isChecking = status === 'checking';

  const cancelPendingCheck = useCallback(() => {
    requestRef.current += 1;
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => cancelPendingCheck, [cancelPendingCheck]);

  const runVerification = useCallback(
    (rawText: string) => {
      const input = rawText.trim();
      cancelPendingCheck();
      setResult(null);

      if (!input) {
        setStatus('error');
        setErrorMessage('Enter a claim or use text from a screenshot before checking.');
        return;
      }

      const requestId = requestRef.current;
      setClaimText(rawText);
      setErrorMessage('');
      setStatus('checking');

      timerRef.current = setTimeout(() => {
        if (requestId !== requestRef.current) return;

        try {
          const outcome = verifyClaim(input, claims, profiles);
          if (requestId !== requestRef.current) return;
          setResult(outcome);
          setStatus('success');
        } catch {
          if (requestId !== requestRef.current) return;
          setStatus('error');
          setErrorMessage('The evidence check could not be completed. Please try again.');
        } finally {
          timerRef.current = null;
        }
      }, 500);
    },
    [cancelPendingCheck],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runVerification(claimText);
  };

  const loadExample = (example: string) => {
    cancelPendingCheck();
    setActiveTab('text');
    setClaimText(example);
    setResult(null);
    setErrorMessage('');
    setStatus('idle');
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const resetChecker = () => {
    cancelPendingCheck();
    setClaimText('');
    setResult(null);
    setErrorMessage('');
    setStatus('idle');
    setActiveTab('text');
    setOcrSession((session) => session + 1);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const handleOcrText = useCallback(
    (text: string) => {
      setClaimText(text);
      runVerification(text);
    },
    [runVerification],
  );

  const changeTab = (tab: InputTab) => {
    setActiveTab(tab);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    let nextTab: InputTab | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      nextTab = activeTab === 'text' ? 'screenshot' : 'text';
    } else if (event.key === 'Home') {
      nextTab = 'text';
    } else if (event.key === 'End') {
      nextTab = 'screenshot';
    }

    if (!nextTab) return;
    event.preventDefault();
    changeTab(nextTab);
    (nextTab === 'text' ? textTabRef : screenshotTabRef).current?.focus();
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#checker">
        Skip to claim checker
      </a>

      <header className="site-header" id="top">
        <nav className="topbar page-width" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="Check In Berita AI home">
            <BrandMark />
            <span className="brand-name">
              <strong>Check In</strong>
              <span>Berita AI</span>
            </span>
          </a>
          <div className="topbar-actions">
            <span className="demo-label">
              <span className="status-dot" aria-hidden="true" />
              <span className="demo-full">Curated demo · 6 claims</span>
              <span className="demo-compact">Demo · 6 claims</span>
            </span>
            <a className="methodology-link" href="#methodology" aria-label="Read the methodology">
              <span>Methodology</span> <Icon name="arrow" size={16} />
            </a>
          </div>
        </nav>
      </header>

      <main className="main-content">
        <section className="hero-workspace page-width" aria-labelledby="hero-heading" data-enter>
          <div className="hero-copy">
            <p className="hero-eyebrow">Evidence verification for Malaysia</p>
            <h1 id="hero-heading">Check Malaysian claims against the evidence.</h1>
            <p className="hero-intro">
              Compare a statement with six curated registry entries, inspect the calculation and source, then decide what the evidence supports.
            </p>
            <p className="bm-tagline" lang="ms">Semak fakta. Fahami konteks. Kongsi dengan yakin.</p>

            <ol className="hero-steps" aria-label="How a claim is checked">
              <li>
                <span>01</span>
                <div><strong>Match the wording</strong><p>Find the closest approved registry claim.</p></div>
              </li>
              <li>
                <span>02</span>
                <div><strong>Inspect the evidence</strong><p>Compare values, calculations and sources.</p></div>
              </li>
              <li>
                <span>03</span>
                <div><strong>Read the limits</strong><p>Keep registry gaps and coverage context in view.</p></div>
              </li>
            </ol>
          </div>

          <section className="checker-card" id="checker" aria-labelledby="checker-heading">
            <div className="checker-header">
              <div>
                <p className="section-kicker">Claim checker</p>
                <h2 id="checker-heading">Start with the exact wording</h2>
              </div>
            <span className="registry-status"><span aria-hidden="true" /> Approved registry</span>
          </div>

          <div className="input-tabs" role="tablist" aria-label="Claim input method">
            <button
              ref={textTabRef}
              id="text-tab"
              type="button"
              role="tab"
              aria-selected={activeTab === 'text'}
              aria-controls="text-panel"
              tabIndex={activeTab === 'text' ? 0 : -1}
              className={activeTab === 'text' ? 'input-tab is-active' : 'input-tab'}
              onClick={() => changeTab('text')}
              onKeyDown={handleTabKeyDown}
            >
              <Icon name="file" size={19} /> Text
            </button>
            <button
              ref={screenshotTabRef}
              id="screenshot-tab"
              type="button"
              role="tab"
              aria-selected={activeTab === 'screenshot'}
              aria-controls="screenshot-panel"
              tabIndex={activeTab === 'screenshot' ? 0 : -1}
              className={activeTab === 'screenshot' ? 'input-tab is-active' : 'input-tab'}
              onClick={() => changeTab('screenshot')}
              onKeyDown={handleTabKeyDown}
            >
              <Icon name="camera" size={19} /> Screenshot
            </button>
          </div>

          <div className="input-body">
            {activeTab === 'text' ? (
              <div
                id="text-panel"
                role="tabpanel"
                aria-labelledby="text-tab"
                className="text-panel"
              >
                <form onSubmit={handleSubmit}>
                  <div className="textarea-heading">
                    <label htmlFor="claim-input">Claim to check</label>
                    <span>English or Bahasa Malaysia</span>
                  </div>
                  <textarea
                    ref={textareaRef}
                    id="claim-input"
                    value={claimText}
                    onChange={(event) => {
                      setClaimText(event.target.value);
                      setResult(null);
                      setStatus('idle');
                      setErrorMessage('');
                    }}
                    placeholder="Paste a statement, headline or statistic…"
                    aria-describedby="claim-help"
                    rows={5}
                    readOnly={isChecking}
                    required
                  />
                  <p className="field-help" id="claim-help">
                    Use a specific public claim. Names, numbers and dates improve registry matching.
                  </p>

                  <div className="examples-block">
                    <div className="examples-heading">
                      <span>Try a prepared claim</span>
                      <span>One claim, two languages</span>
                    </div>
                    <div className="example-buttons" role="group" aria-label="Prepared example claims">
                      <button
                        className="example-button example-en"
                        type="button"
                        aria-label={ENGLISH_EXAMPLE}
                        onClick={() => loadExample(ENGLISH_EXAMPLE)}
                      >
                        {ENGLISH_EXAMPLE}
                      </button>
                      <button
                        className="example-button example-bm"
                        type="button"
                        lang="ms"
                        aria-label={MALAY_EXAMPLE}
                        onClick={() => loadExample(MALAY_EXAMPLE)}
                      >
                        {MALAY_EXAMPLE}
                      </button>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      className="primary-button"
                      type="submit"
                      disabled={!claimText.trim() || isChecking}
                    >
                      {isChecking ? (
                        <><span className="spinner" aria-hidden="true" /> Checking evidence…</>
                      ) : (
                        <>Check claim <Icon name="arrow" size={19} /></>
                      )}
                    </button>
                    <button className="secondary-button" type="button" onClick={resetChecker}>
                      <Icon name="reset" size={17} /> Clear / reset
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div
                id="screenshot-panel"
                role="tabpanel"
                aria-labelledby="screenshot-tab"
                className="screenshot-panel"
              >
                <div className="screenshot-intro">
                  <div>
                    <h3>Check a claim from an image</h3>
                    <p>Upload a screenshot, review the extracted text, then use the edited text to run the evidence check.</p>
                  </div>
                  <span>OCR + registry match</span>
                </div>
                <ScreenshotOcr key={ocrSession} onUseText={handleOcrText} />
                <div className="screenshot-reset">
                  <button className="secondary-button" type="button" onClick={resetChecker}>
                    <Icon name="reset" size={17} /> Clear / reset
                  </button>
                </div>
              </div>
            )}
          </div>

            <div className="checker-footnote">
              <Icon name="shield" size={16} />
              <span>Frontend-only demonstration. Always consult the original evidence for important decisions.</span>
            </div>
          </section>
        </section>

        <div className="page-width outcome-content">
        {status === 'error' && (
          <div className="error-banner" role="alert">
            <Icon name="alert" size={22} />
            <div><strong>Unable to check this claim</strong><p>{errorMessage}</p></div>
          </div>
        )}

        <div className="results-region" aria-live="polite" aria-busy={isChecking}>
          {isChecking && (
            <div className="checking-card" role="status">
              <span className="checking-symbol"><Icon name="search" size={26} /></span>
              <div>
                <p className="section-kicker">Please wait</p>
                <h2>Checking the approved evidence registry…</h2>
                <p>Matching the wording, values and context of your claim.</p>
              </div>
              <div className="checking-lines" aria-hidden="true"><span /><span /><span /></div>
            </div>
          )}

          {status === 'success' && result && !result.claim && (
            <section className="unmatched-card" aria-labelledby="unmatched-heading">
              <span className="unmatched-icon"><Icon name="search" size={30} /></span>
              <p className="section-kicker">Registry result</p>
              <h2 id="unmatched-heading">Insufficient evidence</h2>
              <p className="unmatched-message">{UNMATCHED_MESSAGE}</p>
              <div className="unmatched-guidance">
                <Icon name="info" size={19} />
                <p>Try a prepared claim, add a specific number or date, or check the original source manually. No verdict is inferred without a confident registry match.</p>
              </div>
            </section>
          )}

          {status === 'success' && result?.claim && (
            <VerificationResult
              verdict={result.verdict}
              claim={result.claim}
              profile={result.profile}
              matchedAlias={result.matchedAlias}
            />
          )}
        </div>

        {status === 'idle' && !result && (
          <section className="principles-grid" aria-label="Verification principles">
            <article>
              <span><Icon name="search" size={21} /></span>
              <div><h3>Specific, not speculative</h3><p>No confident registry match means no claim verdict.</p></div>
            </article>
            <article>
              <span><Icon name="file" size={21} /></span>
              <div><h3>Evidence in the open</h3><p>Values, calculations, sources and limitations stay visible.</p></div>
            </article>
            <article>
              <span><Icon name="shield" size={21} /></span>
              <div><h3>Context over certainty</h3><p>Coverage inclination adds sample-based context, not a judgement.</p></div>
            </article>
          </section>
        )}

        <details className="methodology" id="methodology">
          <summary>
            <span className="methodology-icon"><Icon name="info" size={21} /></span>
            <span><strong>How Check In Berita AI works</strong><small>Methodology, scope and responsible use</small></span>
            <Icon name="chevron" size={20} />
          </summary>
          <div className="methodology-content">
            <div>
              <span>01</span>
              <h3>Curated evidence only</h3>
              <p>This MVP checks claims against a small, approved demonstration registry. It does not search the live web or represent the full evidence landscape.</p>
            </div>
            <div>
              <span>02</span>
              <h3>Transparent matching</h3>
              <p>Submitted or edited OCR text is matched to known claims. A successful match returns the registry verdict, comparison values, calculation, evidence and limitations.</p>
            </div>
            <div>
              <span>03</span>
              <h3>Sample-based context</h3>
              <p>Related coverage inclination uses integer counts and rates derived from the stated sample. Zero denominators are labelled as insufficient sample.</p>
            </div>
            <div>
              <span>04</span>
              <h3>Human verification matters</h3>
              <p>Demonstration fixtures and missing source URLs are identified clearly. Confirm important claims with the original publisher before public release.</p>
            </div>
          </div>
        </details>
        </div>
      </main>

      <footer className="footer">
        <div className="page-width footer-inner">
          <div className="footer-brand"><BrandMark /><div><strong>Check In Berita AI</strong><span lang="ms">Semak dahulu, kongsi kemudian.</span></div></div>
          <p>Six claim fixtures <span aria-hidden="true">·</span> Browser-based OCR <span aria-hidden="true">·</span> Original sources linked</p>
          <a href="#checker">Back to checker <span aria-hidden="true">↑</span></a>
        </div>
      </footer>
    </div>
  );
}
