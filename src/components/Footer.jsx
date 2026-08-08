import { Link } from 'react-router-dom'
import { useCompany } from '../i18n/content.js'
import { useT } from '../i18n/ui.js'

export default function Footer() {
  const company = useCompany()
  const t = useT()
  const { contact } = company
  const year = new Date().getFullYear()

  const websiteUrl = contact.website.startsWith('http')
    ? contact.website
    : `https://${contact.website}`

  return (
    <footer className="site-footer">
      <div className="container footer-inner">

        <div className="footer-brand">
          <strong>{company.legalName}</strong>

          <span>
            {t('footer.regNo')} {company.registrationNumber}
          </span>

          <div className="footer-contact">

            <div className="footer-contact-item">
              <span>{t('footer.email')}</span>
              <a href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </div>

            <div className="footer-contact-item">
              <span>{t('footer.web')}</span>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {contact.website}
              </a>
            </div>

          </div>
        </div>

        <nav
          className="footer-nav"
          aria-label={t('nav.footer')}
        >
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/products">{t('nav.products')}</Link>
          <Link to="/kyc">{t('nav.kyc')}</Link>
          <Link to="/contact">{t('nav.contact')}</Link>
        </nav>

      </div>

      <div className="footer-bar">
        <div className="container">
          <p>
            © {year} {company.legalName}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}