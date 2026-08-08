import KycForm from '../components/KycForm.jsx'

export default function Kyc() {
  return (
    <>
      <section className="page-hero" aria-labelledby="kyc-heading">
        <div className="container">
          <span className="kicker">Restricted Access</span>
          <h1 id="kyc-heading">Request Product Catalogue Access</h1>
          <p className="page-lead">
            Product information is provided only following appropriate counterparty, end-user,
            end-use, destination and compliance screening. Complete the Stage 1 enquiry below.
            Armtrex may request further documentation before any controlled product information or
            commercial engagement is provided.
          </p>
        </div>
      </section>

      <section className="section contact-section">
        <div className="container contact-layout contact-layout-single">
          <div className="contact-form-wrap">
            <h2>Stage 1 — Supplier / Buyer Enquiry</h2>
            <p className="form-intro">
              This enquiry is a preliminary screening step. Submission does not create an obligation
              to supply, does not constitute regulatory approval, and does not guarantee catalogue access.
            </p>
            <KycForm />
          </div>
        </div>
      </section>
    </>
  )
}
