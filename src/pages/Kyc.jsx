import KycForm from '../components/KycForm.jsx'

export default function Kyc() {
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Compliance &amp; Assurance</span>
            <h1>Restricted Access</h1>
            <p className="lead">
              Request Product Catalogue Access
            </p>
            <p>
              Product information is provided only following appropriate
              counterparty, end-user, end-use, destination and compliance
              screening. Complete the Stage 1 enquiry below.
            </p>
            <p>
              Armtrex may request further documentation before any controlled
              product information or commercial engagement is provided.
            </p>
          </div>

          <div className="compliance-grid">
            <article className="compliance-card">
              <span className="compliance-number">01</span>
              <h2>Governance &amp; Accountability</h2>
              <p>
                Armtrex applies defined responsibility for compliance,
                counterparty due diligence, export controls, sanctions
                screening, quality assurance and information security.
              </p>
              <p>
                Transactions are reviewed according to their risk,
                jurisdiction, product, customer and applicable contractual
                requirements. Compliance concerns are escalated for review
                before a transaction proceeds.
              </p>
            </article>

            <article className="compliance-card">
              <span className="compliance-number">02</span>
              <h2>Controlled Decision-Making</h2>
              <p>
                Compliance decisions are made on a transaction-by-transaction
                basis. Where additional evidence, authorisation or approval is
                required, Armtrex will seek and review the relevant
                documentation before proceeding.
              </p>
              <p>
                Armtrex does not treat preliminary enquiries, screening or
                catalogue access as regulatory approval or an obligation to
                supply.
              </p>
            </article>

            <article className="compliance-card">
              <span className="compliance-number">03</span>
              <h2>Evidence &amp; Oversight</h2>
              <p>
                Relevant compliance reviews, supporting documentation and
                decisions are maintained in accordance with applicable legal,
                regulatory and contractual requirements.
              </p>
              <p>
                Where a compliance concern cannot be satisfactorily resolved,
                Armtrex may pause, decline or otherwise restrict the proposed
                transaction.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section contact-section">
        <div className="container contact-layout contact-layout-single">
          <div className="contact-form-wrap">
            <h2>Stage 1 — Supplier / Buyer Enquiry</h2>
            <p className="form-intro">
              This enquiry is a preliminary screening step. Submission does
              not create an obligation to supply, does not constitute
              regulatory approval, and does not guarantee catalogue access.
            </p>
            <KycForm />
          </div>
        </div>
      </section>
    </>
  )
}