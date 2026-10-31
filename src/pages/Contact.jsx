import { useSearchParams } from 'react-router-dom'
import ContactForm from '../components/ContactForm.jsx'
import { useCompany, useProducts, useCategories } from '../i18n/content.js'
import { useT } from '../i18n/ui.js'

export default function Contact() {
  const company = useCompany()
  const products = useProducts()
  const categories = useCategories()
  const t = useT()

  const catName = Object.fromEntries(categories.map((c) => [c.id, c.name]))
  const { contact, addresses } = company

  const [searchParams] = useSearchParams()
  const enquiryProduct = products.find(
    (p) => p.slug === searchParams.get('product')
  )

  const prefill = enquiryProduct
    ? {
        subject: `${t('prefill.subject')}: ${enquiryProduct.name}`,
        message: `${t('prefill.message')} ${enquiryProduct.name} (${catName[enquiryProduct.category]}).\n\n`,
      }
    : null

  return (
    <>
      {/* ============================================================
          Contact hero
          ============================================================ */}
      <section
        className="page-hero contact-hero"
        aria-labelledby="contact-heading"
      >
        <div className="container">
          <span className="kicker">{t('contact.kicker')}</span>

          <h1 id="contact-heading">Contact Armtrex</h1>

          <p className="page-lead">
            Engage with Armtrex for authorised defence procurement,
            business development, corporate, compliance and professional
            enquiries. All enquiries are handled subject to appropriate
            due diligence and applicable legal and regulatory requirements.
          </p>
        </div>
      </section>

      {/* ============================================================
          Contact introduction
          ============================================================ */}
      <section className="section contact-intro-section">
        <div className="container">
          <div className="contact-intro">
            <span className="kicker">GET IN TOUCH</span>

            <h2>Professional enquiries, handled responsibly</h2>

            <p>
              Armtrex welcomes enquiries from governmental, military,
              industrial and other authorised defence-sector organisations,
              as well as qualified corporate and strategic partners.
            </p>

            <p>
              Please provide sufficient information for us to understand
              the nature of your enquiry. Product, commercial and catalogue
              enquiries may be subject to additional verification before
              further information or engagement is provided.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          Corporate contact channels
          ============================================================ */}
      <section className="section contact-channels-section">
        <div className="container">
          <div className="contact-channel-grid">

            <article className="contact-channel" onClick={() => document.getElementById("contact-enquiry-form")?.scrollIntoView({ behavior: "smooth", block: "start" })} role="button" tabIndex={0}>
              <h2>Business &amp; Procurement</h2>
              <p>
                For defence procurement, product enquiries, commercial
                discussions, supply requirements and strategic defence
                opportunities.
              </p>
              <span className="contact-channel-link">
                Submit an enquiry below
              </span>
            </article>

            <article className="contact-channel" onClick={() => document.getElementById("contact-enquiry-form")?.scrollIntoView({ behavior: "smooth", block: "start" })} role="button" tabIndex={0}>
              <h2>Compliance &amp; Responsible Enquiries</h2>
              <p>
                For matters concerning due diligence, end-user and end-use
                requirements, sanctions, export controls and responsible
                defence trade.
              </p>
              <span className="contact-channel-link">
                Compliance enquiries welcome
              </span>
            </article>

            <article className="contact-channel" onClick={() => document.getElementById("contact-enquiry-form")?.scrollIntoView({ behavior: "smooth", block: "start" })} role="button" tabIndex={0}>
              <h2>Investors &amp; Corporate</h2>
              <p>
                For corporate enquiries, strategic relationships,
                investment-related approaches and potential industrial
                partnerships.
              </p>
              <span className="contact-channel-link">
                Corporate enquiries welcome
              </span>
            </article>

            <article className="contact-channel" onClick={() => document.getElementById("contact-enquiry-form")?.scrollIntoView({ behavior: "smooth", block: "start" })} role="button" tabIndex={0}>
              <h2>Careers</h2>
              <p>
                Armtrex is interested in connecting with experienced
                professionals who can contribute to our defence,
                manufacturing, procurement, compliance and corporate
                capabilities.
              </p>
              <span className="contact-channel-link">
                Introduce yourself through our enquiry form
              </span>
            </article>

          </div>
        </div>
      </section>

      {/* ============================================================
          Headquarters / direct contact
          ============================================================ */}
      <section className="section contact-information-section">
        <div className="container contact-information-grid">

          <article className="contact-information-card">
            <span className="kicker">HEADQUARTERS</span>

            <h2>{addresses.headquarters.label}</h2>

            <address>
              {addresses.headquarters.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
          </article>

          <article className="contact-information-card">
            <span className="kicker">GENERAL ENQUIRIES</span>

            <h2>Armtrex</h2>

            <div className="contact-direct-details">
              <div>
                <span className="contact-detail-label">Email</span>
                <a href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </div>

              <div>
                <span className="contact-detail-label">Website</span>
                <span>{contact.website}</span>
              </div>
            </div>
          </article>

        </div>
      </section>

      {/* ============================================================
          Responsible engagement notice
          ============================================================ */}
      <section className="section contact-responsible-section">
        <div className="container">
          <div className="contact-responsible-panel">

            <div className="contact-responsible-icon" aria-hidden="true">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <span className="kicker">RESPONSIBLE ENGAGEMENT</span>

              <h2>Compliance remains central to every engagement</h2>

              <p>
                An enquiry, quotation or technical-specification request does not
                constitute authorisation to supply or transfer controlled
                goods, software or technology. Prospective counterparties
                may be subject to organisation, end-user, destination,
                sanctions and export-control screening before further
                engagement.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          Enquiry form
          ============================================================ */}
      <section
        className="section contact-enquiry-section" id="contact-enquiry-form"
        aria-labelledby="send-enquiry-heading"
      >
        <div className="container contact-enquiry-layout">

          <div className="contact-enquiry-intro">
            <span className="kicker">ENQUIRY</span>

            <h2 id="send-enquiry-heading">
              Send an enquiry
            </h2>

            <p>
              Use the form to contact Armtrex regarding procurement,
              products, business development, compliance, corporate
              matters or careers.
            </p>

            <p>
              For product-related enquiries, please include the relevant
              product name and provide enough information for our team to
              assess your request.
            </p>
          </div>

          <div className="contact-form-wrap">
            {enquiryProduct && (
              <p className="enquiry-context">
                <span className="enquiry-context-label">
                  {t('contact.regarding')}
                </span>

                <span className="enquiry-context-value">
                  {enquiryProduct.name}
                </span>
              </p>
            )}

            <ContactForm
              key={enquiryProduct ? enquiryProduct.slug : 'general'}
              prefill={prefill}
            />
          </div>

        </div>
      </section>
    </>
  )
}
