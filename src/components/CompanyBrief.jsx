import { useCompany } from '../i18n/content.js'
import { useT } from '../i18n/ui.js'

export default function CompanyBrief() {
  const company = useCompany()
  const t = useT()

  return (
    <section className="section company-brief" aria-labelledby="brief-heading">
      <div className="container">
        <div className="section-head">
          <span className="kicker">{t('brief.kicker')}</span>
          <h2 id="brief-heading">{t('brief.heading')}</h2>
        </div>

        <div className="brief-body">
          {company.brief.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="brief-cards">
          <article className="brief-card">
            <h3>{t('brief.mission')}</h3>
            <p>{company.mission}</p>
          </article>
          <article className="brief-card">
            <h3>{t('brief.vision')}</h3>
            <p>{company.vision}</p>
          </article>
        </div>

        <div className="corporate-identifiers">
          <span className="corporate-identifiers-label">
            Corporate Identifiers
          </span>
          <div className="corporate-identifiers-values">
            <span><strong>D-U-N-S:</strong> 2339655548</span>
            <span><strong>NCAGE:</strong> U2JR1</span>
            <span><strong>PPON:</strong> PZZY-1786-LGDV</span>
          </div>
        </div>
      </div>
    </section>
  )
}
