import { useSearchParams } from 'react-router-dom'
import KycForm from '../components/KycForm.jsx'
import { useProducts } from '../i18n/content.js'

export default function Kyc() {
  const [searchParams] = useSearchParams()
  const products = useProducts()

  const productSlug = searchParams.get('product')
  const selectedProduct = products.find(
    (product) => product.slug === productSlug
  )

  return (
    <>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Compliance &amp; Assurance</span>

            <h1>Due Diligence Enquiry</h1>

            <p className="lead">
              Please provide the information below to allow Armtrex to conduct its internal due diligence and compliance assessment.
            </p>

            <p>
              Armtrex will review the information provided and contact you following its assessment, where appropriate.
            </p>

            {selectedProduct && (
              <div className="enquiry-context">
                <span className="enquiry-context-label">
                  Enquiry regarding
                </span>
                <span className="enquiry-context-value">
                  {selectedProduct.name}
                </span>
              </div>
            )}

            <p>
                Further information or clarification may be requested before Armtrex proceeds with any commercial engagement.
            </p>
          </div>

          <div className="compliance-grid">
            <article className="compliance-card">
              <h2>Governance &amp; Accountability</h2>

              <p>
                Armtrex applies defined responsibility for compliance,
                counterparty due diligence, export controls, sanctions
                screening, quality assurance and information security.
              </p>

              <p>
                Enquiries are reviewed according to their risk, jurisdiction,
                product, customer and applicable legal, regulatory and
                contractual requirements.
              </p>
            </article>

            <article className="compliance-card">
              <h2>Controlled Decision-Making</h2>

              <p>
                Compliance decisions are made on a transaction-by-transaction
                basis. Where additional evidence, authorisation or approval is
                required, Armtrex will seek and review the relevant
                documentation before proceeding.
              </p>

              <p>
                Submission of this enquiry does not constitute approval, authorisation to supply, or an obligation to proceed with a transaction.
              </p>
            </article>

            <article className="compliance-card">
              <h2>Evidence &amp; Oversight</h2>

              <p>
                Relevant compliance reviews, supporting documentation and
                decisions are maintained in accordance with applicable legal,
                regulatory and contractual requirements.
              </p>

              <p>
                Where a compliance concern cannot be satisfactorily resolved,
                Armtrex may pause, decline or otherwise restrict the proposed
                enquiry or transaction.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section contact-section">
        <div className="container contact-layout contact-layout-single">
          <div className="contact-form-wrap">
            <h2>Supplier / Buyer Due Diligence Enquiry</h2>

        <p className="form-intro">
          This enquiry is a preliminary screening step. Submission does
          not constitute approval, authorisation to supply, or an obligation
          to proceed with a transaction.
        </p>

            <KycForm />
          </div>
        </div>
      </section>
    </>
  )
}
