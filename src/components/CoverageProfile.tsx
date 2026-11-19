import type { EntityInclination } from '../types';

const integerFormatter = new Intl.NumberFormat('en-MY', {
  maximumFractionDigits: 0,
});

const rateFormatter = new Intl.NumberFormat('en-MY', {
  maximumFractionDigits: 1,
});

function integer(value: number) {
  return integerFormatter.format(Math.round(value));
}

function rate(numerator: number, denominator: number): number | null {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator <= 0) {
    return null;
  }

  return (Math.max(0, numerator) / denominator) * 100;
}

function barWidth(value: number | null) {
  if (value === null) return 0;
  return Math.min(100, Math.max(0, value));
}

function formatRate(value: number | null) {
  return value === null ? 'Insufficient sample' : `${rateFormatter.format(value)}%`;
}

function formatLabel(value: string) {
  const label = value.replace(/[_-]+/g, ' ');
  return label.charAt(0).toUpperCase() + label.slice(1);
}

interface RateBarProps {
  value: number | null;
  label: string;
}

function RateBar({ value, label }: RateBarProps) {
  return (
    <div className="rate-bar">
      <div className="rate-track" aria-hidden="true">
        <span className="rate-fill" style={{ width: `${barWidth(value)}%` }} />
      </div>
      <span className={value === null ? 'rate-value is-insufficient' : 'rate-value'}>
        {formatRate(value)}
        <span className="sr-only"> {label}</span>
      </span>
    </div>
  );
}

interface CoverageProfileProps {
  profile: EntityInclination;
}

export function CoverageProfile({ profile }: CoverageProfileProps) {
  const topics = Object.entries(profile.topicCounts).sort(
    ([topicA, countA], [topicB, countB]) => countB - countA || topicA.localeCompare(topicB),
  );
  const scrutinyRate = rate(profile.scrutinisedClaims, profile.totalMeasurableClaims);
  const citationRate = rate(profile.officialDataCitations, profile.sampleSize);
  const hasSample = profile.sampleSize > 0;

  return (
    <section className="coverage-card" aria-labelledby="coverage-heading">
      <div className="coverage-heading-row">
        <div>
          <p className="section-kicker">Related context</p>
          <h3 id="coverage-heading">Coverage inclination</h3>
          <p className="coverage-entity">
            {profile.entityName}
            <span aria-hidden="true"> · </span>
            <span className="entity-type">{formatLabel(profile.entityType)}</span>
          </p>
        </div>
        <div className="sample-badge">
          <span>Sample size</span>
          <strong>{integer(profile.sampleSize)}</strong>
        </div>
      </div>

      <p className="coverage-description">
        Coverage inclination describes patterns in this curated sample of public claims and
        sources. It is context for reading the evidence, not a judgement about a person.
      </p>

      <dl className="profile-metadata">
        <div>
          <dt>Analysis period</dt>
          <dd>
            {profile.analysisStart} <span aria-hidden="true">–</span> {profile.analysisEnd}
          </dd>
        </div>
        <div>
          <dt>Measurable claims</dt>
          <dd>{integer(profile.totalMeasurableClaims)}</dd>
        </div>
        <div>
          <dt>Scrutinised claims</dt>
          <dd>{integer(profile.scrutinisedClaims)}</dd>
        </div>
      </dl>

      <div className="coverage-grid">
        <section className="topic-breakdown" aria-labelledby="topic-heading">
          <div className="subsection-heading">
            <h4 id="topic-heading">Topics in the sample</h4>
            <span>Count / rate of sample</span>
          </div>
          {topics.length > 0 ? (
            <div className="topic-list">
              {topics.map(([topic, count]) => {
                const topicRate = rate(count, profile.sampleSize);
                return (
                  <div className="topic-row" key={topic}>
                    <div className="topic-label">
                      <span>{formatLabel(topic)}</span>
                      <strong>{integer(count)}</strong>
                    </div>
                    <RateBar value={topicRate} label={`of the sample for ${formatLabel(topic)}`} />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="empty-note">No topic counts are available in this sample.</p>
          )}
          {!hasSample && <p className="insufficient-note">Insufficient sample to calculate topic rates.</p>}
        </section>

        <div className="coverage-rates">
          <section className="rate-metric" aria-labelledby="scrutiny-heading">
            <h4 id="scrutiny-heading">Claims scrutinised</h4>
            <p>
              <strong>{integer(profile.scrutinisedClaims)}</strong>
              <span> of {integer(profile.totalMeasurableClaims)} measurable claims</span>
            </p>
            <RateBar value={scrutinyRate} label="of measurable claims scrutinised" />
          </section>

          <section className="rate-metric" aria-labelledby="citation-heading">
            <h4 id="citation-heading">Official data citations</h4>
            <p>
              <strong>{integer(profile.officialDataCitations)}</strong>
              <span> citations in the sample</span>
            </p>
            <RateBar value={citationRate} label="official data citation rate" />
          </section>
        </div>
      </div>

      <section className="source-mix" aria-labelledby="source-mix-heading">
        <div className="subsection-heading">
          <h4 id="source-mix-heading">Source mix</h4>
          <span>Integer counts</span>
        </div>
        <dl className="source-counts">
          <div>
            <dt>Government</dt>
            <dd>{integer(profile.sourceCounts.government)}</dd>
          </div>
          <div>
            <dt>Opposition</dt>
            <dd>{integer(profile.sourceCounts.opposition)}</dd>
          </div>
          <div>
            <dt>Expert or NGO</dt>
            <dd>{integer(profile.sourceCounts.expertOrNgo)}</dd>
          </div>
        </dl>
      </section>

      {(profile.observations.length > 0 || profile.limitations.length > 0) && (
        <div className="profile-notes">
          {profile.observations.length > 0 && (
            <section aria-labelledby="observations-heading">
              <h4 id="observations-heading">Observations</h4>
              <ul>
                {profile.observations.map((observation) => (
                  <li key={observation}>{observation}</li>
                ))}
              </ul>
            </section>
          )}
          {profile.limitations.length > 0 && (
            <section aria-labelledby="profile-limitations-heading">
              <h4 id="profile-limitations-heading">Profile limitations</h4>
              <ul>
                {profile.limitations.map((limitation) => (
                  <li key={limitation}>{limitation}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </section>
  );
}
