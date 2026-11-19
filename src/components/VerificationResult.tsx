import type { ClaimEvidence, EntityInclination } from '../types';
import { CoverageProfile } from './CoverageProfile';
import { Icon } from './Icon';
import type { IconName } from './Icon';

interface VerificationResultProps {
  verdict: string;
  claim: ClaimEvidence;
  profile?: EntityInclination | null;
  matchedAlias?: string | null;
}

function verdictClass(verdict: string) {
  return verdict.toLowerCase().replace(/[^a-z]+/g, '-');
}

function verdictIcon(verdict: string): IconName {
  switch (verdict) {
    case 'Supported':
    case 'Mostly supported':
      return 'check-circle';
    case 'Contradicted':
      return 'alert';
    case 'Missing context':
      return 'info';
    default:
      return 'search';
  }
}

export function VerificationResult({
  verdict,
  claim,
  profile,
  matchedAlias,
}: VerificationResultProps) {
  const sourceUrl = claim.sourceUrl.trim();
  const officialValueLabel = claim.needsHumanVerification
    ? 'Registry comparison value'
    : 'Official value';

  return (
    <div className="result-stack">
      <article className={`verdict-card verdict-${verdictClass(verdict)}`} aria-labelledby="result-heading">
        <div className="verdict-topline">
          <p className="section-kicker">Verification result</p>
          {claim.needsHumanVerification && <span className="review-badge">Human review needed</span>}
        </div>

        <div className="verdict-heading">
          <span className="verdict-icon">
            <Icon name={verdictIcon(verdict)} size={30} />
          </span>
          <div>
            <h2 id="result-heading">{verdict}</h2>
            <p>{claim.explanation}</p>
          </div>
        </div>

        {(claim.claimant || claim.topic) && (
          <div className="claim-tags" aria-label="Claim context">
            {claim.claimant && <span>Claimant: {claim.claimant}</span>}
            {claim.topic && <span>Topic: {claim.topic}</span>}
          </div>
        )}

        {claim.needsHumanVerification && (
          <div className="fixture-warning" role="note">
            <Icon name="alert" size={20} />
            <p>Hackathon demonstration fixture. Exact value requires human verification before public release.</p>
          </div>
        )}

        <section className="evidence-section" aria-labelledby="comparison-heading">
          <div className="section-title-row">
            <div>
              <p className="section-kicker">The comparison</p>
              <h3 id="comparison-heading">Claim against the registry</h3>
            </div>
            {matchedAlias && <span className="alias-note">Matched wording: “{matchedAlias}”</span>}
          </div>

          <p className="matched-claim">
            <span>Matched registry claim</span>
            {claim.canonicalClaim}
          </p>

          <dl className="comparison-grid">
            <div className="comparison-value claimed-value">
              <dt>Claimed value</dt>
              <dd>{claim.claimedValue}</dd>
            </div>
            <div className="comparison-value official-value">
              <dt>{officialValueLabel}</dt>
              <dd>{claim.officialValue}</dd>
            </div>
            <div className="calculation-row">
              <dt>Calculation</dt>
              <dd>{claim.calculation || 'No calculation supplied for this registry entry.'}</dd>
            </div>
          </dl>
        </section>

        <section className="evidence-section source-section" aria-labelledby="source-heading">
          <div className="section-title-row">
            <div>
              <p className="section-kicker">Evidence trail</p>
              <h3 id="source-heading">Source and scope</h3>
            </div>
            <Icon name="shield" size={25} />
          </div>

          <div className="source-details">
            <div className="source-primary">
              <span>Evidence organisation</span>
              <strong>{claim.sourceOrganisation}</strong>
            </div>
            <div className="source-primary">
              <span>Source title</span>
              <strong>{claim.sourceTitle}</strong>
              {sourceUrl ? (
                <a href={sourceUrl} target="_blank" rel="noreferrer">
                  Open original source <Icon name="external" size={15} />
                </a>
              ) : (
                <p className="source-pending">Source URL pending human verification</p>
              )}
            </div>
          </div>

          <dl className="source-metadata">
            <div>
              <dt>Relevant date</dt>
              <dd>{claim.sourceUpdatedAt}</dd>
            </div>
            <div>
              <dt>Geography</dt>
              <dd>{claim.geography}</dd>
            </div>
            <div>
              <dt>Period</dt>
              <dd>{claim.period}</dd>
            </div>
          </dl>
        </section>

        <section className="limitations-section" aria-labelledby="limitations-heading">
          <h3 id="limitations-heading">
            <Icon name="info" size={19} /> Limitations to keep in view
          </h3>
          {claim.limitations.length > 0 ? (
            <ul>
              {claim.limitations.map((limitation) => (
                <li key={limitation}>{limitation}</li>
              ))}
            </ul>
          ) : (
            <p>No additional limitations are recorded for this registry entry.</p>
          )}
        </section>
      </article>

      {profile ? (
        <CoverageProfile profile={profile} />
      ) : (
        <section className="profile-empty" aria-label="Coverage inclination unavailable">
          <Icon name="info" size={21} />
          <div>
            <h3>No related coverage inclination profile</h3>
            <p>A related profile is not available for this registry entry.</p>
          </div>
        </section>
      )}
    </div>
  );
}
