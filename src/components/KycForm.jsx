import { useState } from 'react'
import { company } from '../data/company.js'

const ENDPOINT = '/api/kyc'

const EMPTY = {
  legalEntityName: '',
  tradingName: '',
  ownershipControl: '',
  registrationNumber: '',
  incorporationCountry: '',
  registeredAddress: '',
  website: '',
  businessDescription: '',
  contactName: '',
  contactTitle: '',
  contactEmail: '',
  contactPhone: '',
  capability: '',
  indicativeQuantity: '',
  timeframe: '',
  isEndUser: '',
  destinationCountry: '',
  statedPurpose: '',
  onwardTransfer: '',
  intermediaryInvolved: '',
  intermediaryDetails: '',
  sanctionsDeclaration: false,
  exportControlDeclaration: false,
  eusDeclaration: false,
  _gotcha: '',
}

const REQUIRED = [
  'legalEntityName',
  'registrationNumber',
  'incorporationCountry',
  'registeredAddress',
  'businessDescription',
  'contactName',
  'contactTitle',
  'contactEmail',
  'capability',
  'destinationCountry',
  'statedPurpose',
  'isEndUser',
  'onwardTransfer',
  'intermediaryInvolved',
]

export default function KycForm() {
  const [values, setValues] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | error | sending | sent | failed
  const [errors, setErrors] = useState({})

  const update = (e) => {
    const { name, value, type, checked } = e.target
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }))
    setErrors((er) => ({ ...er, [name]: false }))
  }

  const scrollToNotice = () => {
    requestAnimationFrame(() => {
      document.querySelector('.form-notice')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return

    const missing = {}
    REQUIRED.forEach((key) => {
      if (!String(values[key] || '').trim()) missing[key] = true
    })

    if (!values.sanctionsDeclaration) missing.sanctionsDeclaration = true
    if (!values.exportControlDeclaration) missing.exportControlDeclaration = true
    if (!values.eusDeclaration) missing.eusDeclaration = true
    if (values.intermediaryInvolved === 'yes' && !values.intermediaryDetails.trim()) {
      missing.intermediaryDetails = true
    }

    if (Object.keys(missing).length) {
      setErrors(missing)
      setStatus('error')
      scrollToNotice()
      return
    }

    setErrors({})
    setStatus('sending')

    try {
      const fd = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        fd.append(key, typeof value === 'boolean' ? String(value) : value)
      })

      const response = await fetch(ENDPOINT, { method: 'POST', body: fd })
      if (!response.ok) throw new Error('submission failed')

      setValues(EMPTY)
      setStatus('sent')
    } catch {
      setStatus('failed')
    }

    scrollToNotice()
  }

  return (
    <form className="contact-form kyc-form" onSubmit={handleSubmit} noValidate>
      {status === 'error' && (
        <div className="form-notice form-notice-error" role="alert">
          Please complete the required fields and declarations before submitting your enquiry.
        </div>
      )}

      <h3 className="kyc-section-heading">A. Organisation</h3>

      <div className={`field ${errors.legalEntityName ? 'has-error' : ''}`}>
        <label htmlFor="k-legal-name">Legal Entity Name <span aria-hidden="true">*</span></label>
        <input id="k-legal-name" name="legalEntityName" type="text" maxLength={200} required value={values.legalEntityName} onChange={update} />
      </div>

      <div className="form-row">
  <div className="field">
    <label htmlFor="k-trading-name">Trading Name</label>
    <input
      id="k-trading-name"
      name="tradingName"
      type="text"
      maxLength={200}
      value={values.tradingName}
      onChange={update}
    />
  </div>

  <div className={`field ${errors.registrationNumber ? 'has-error' : ''}`}>
    <label htmlFor="k-reg-number">
      Company / Registration Number <span aria-hidden="true">*</span>
    </label>
    <input
      id="k-reg-number"
      name="registrationNumber"
      type="text"
      maxLength={100}
      required
      value={values.registrationNumber}
      onChange={update}
    />
  </div>
</div>
      <div className="form-row">
        <div className={`field ${errors.incorporationCountry ? 'has-error' : ''}`}>
          <label htmlFor="k-inc-country">Country of Incorporation <span aria-hidden="true">*</span></label>
          <input id="k-inc-country" name="incorporationCountry" type="text" maxLength={100} required value={values.incorporationCountry} onChange={update} />
        </div>
        <div className="field">
          <label htmlFor="k-website">Organisation Website</label>
          <input id="k-website" name="website" type="url" maxLength={300} value={values.website} onChange={update} placeholder="https://" />
        </div>
      </div>

      <div className={`field ${errors.registeredAddress ? 'has-error' : ''}`}>
        <label htmlFor="k-address">Registered Address <span aria-hidden="true">*</span></label>
        <textarea id="k-address" name="registeredAddress" rows="3" maxLength={500} required value={values.registeredAddress} onChange={update} />
      </div>

      <div className={`field ${errors.businessDescription ? 'has-error' : ''}`}>
        <label htmlFor="k-business">Nature of Business / Government or Defence Role <span aria-hidden="true">*</span></label>
        <textarea id="k-business" name="businessDescription" rows="4" maxLength={2000} required value={values.businessDescription} onChange={update} />
      </div>

  <h3 className="kyc-section-heading">B. Ownership &amp; Control</h3>

<div className="field">
  <label htmlFor="k-ownership-control">
    Ownership / Control Structure
  </label>
  <textarea
    id="k-ownership-control"
    name="ownershipControl"
    rows="4"
    maxLength={3000}
    value={values.ownershipControl}
    onChange={update}
    placeholder="Briefly describe the ownership and control structure, including any parent company or controlling entity where applicable."
  />
</div>

<p className="form-help">
  Please provide sufficient information to identify the organisation's
  ownership and control. Do not submit passports, identity documents or
  other sensitive personal information through this public form.
</p>

      <div className="form-row">
        <div className={`field ${errors.contactName ? 'has-error' : ''}`}>
          <label htmlFor="k-contact-name">Full Name <span aria-hidden="true">*</span></label>
          <input id="k-contact-name" name="contactName" type="text" maxLength={200} required value={values.contactName} onChange={update} />
        </div>
        <div className={`field ${errors.contactTitle ? 'has-error' : ''}`}>
          <label htmlFor="k-contact-title">Job Title / Position <span aria-hidden="true">*</span></label>
          <input id="k-contact-title" name="contactTitle" type="text" maxLength={150} required value={values.contactTitle} onChange={update} />
        </div>
      </div>

      <div className="form-row">
        <div className={`field ${errors.contactEmail ? 'has-error' : ''}`}>
          <label htmlFor="k-email">Business Email <span aria-hidden="true">*</span></label>
          <input id="k-email" name="contactEmail" type="email" maxLength={254} required value={values.contactEmail} onChange={update} />
        </div>
        <div className="field">
          <label htmlFor="k-phone">Business Telephone</label>
          <input id="k-phone" name="contactPhone" type="tel" maxLength={50} value={values.contactPhone} onChange={update} />
        </div>
      </div>

      <h3 className="kyc-section-heading">C. Requirement</h3>

      <div className={`field ${errors.capability ? 'has-error' : ''}`}>
        <label htmlFor="k-capability">Capability / Goods Sought <span aria-hidden="true">*</span></label>
        <textarea id="k-capability" name="capability" rows="4" maxLength={3000} required value={values.capability} onChange={update} placeholder="Describe the capability or product category required. Do not include classified or sensitive technical information." />
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="k-quantity">Indicative Quantity</label>
          <input id="k-quantity" name="indicativeQuantity" type="text" maxLength={100} value={values.indicativeQuantity} onChange={update} />
        </div>
        <div className="field">
          <label htmlFor="k-timeframe">Required Timeframe</label>
          <input id="k-timeframe" name="timeframe" type="text" maxLength={200} value={values.timeframe} onChange={update} placeholder="e.g. Q4 2026" />
        </div>
      </div>

      <h3 className="kyc-section-heading">D. End-User, End-Use &amp; Destination</h3>

      <div className={`field ${errors.isEndUser ? 'has-error' : ''}`}>
        <label htmlFor="k-end-user">Is your organisation the intended end-user? <span aria-hidden="true">*</span></label>
        <select id="k-end-user" name="isEndUser" required value={values.isEndUser} onChange={update}>
          <option value="">Select</option>
          <option value="yes">Yes — our organisation is the intended end-user</option>
          <option value="no">No — another organisation is the intended end-user</option>
        </select>
      </div>

      <div className={`field ${errors.destinationCountry ? 'has-error' : ''}`}>
        <label htmlFor="k-destination">Final Destination Country <span aria-hidden="true">*</span></label>
        <input id="k-destination" name="destinationCountry" type="text" maxLength={150} required value={values.destinationCountry} onChange={update} />
      </div>

      <div className={`field ${errors.statedPurpose ? 'has-error' : ''}`}>
        <label htmlFor="k-purpose">Stated End-Use / Purpose <span aria-hidden="true">*</span></label>
        <textarea id="k-purpose" name="statedPurpose" rows="4" maxLength={3000} required value={values.statedPurpose} onChange={update} />
      </div>

      <div className={`field ${errors.onwardTransfer ? 'has-error' : ''}`}>
        <label htmlFor="k-onward-transfer">Will there be onward transfer, re-export or transshipment? <span aria-hidden="true">*</span></label>
        <select id="k-onward-transfer" name="onwardTransfer" required value={values.onwardTransfer} onChange={update}>
          <option value="">Select</option>
          <option value="no">No — no onward transfer is currently anticipated</option>
          <option value="yes">Yes — onward transfer, re-export or transshipment may occur</option>
          <option value="unknown">Not yet known</option>
        </select>
      </div>

      <h3 className="kyc-section-heading">E. Intermediaries</h3>

      <div className={`field ${errors.intermediaryInvolved ? 'has-error' : ''}`}>
        <label htmlFor="k-intermediary">Is an intermediary, broker, agent, distributor or other third party involved? <span aria-hidden="true">*</span></label>
        <select id="k-intermediary" name="intermediaryInvolved" required value={values.intermediaryInvolved} onChange={update}>
          <option value="">Select</option>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>

      {values.intermediaryInvolved === 'yes' && (
        <div className={`field ${errors.intermediaryDetails ? 'has-error' : ''}`}>
          <label htmlFor="k-intermediary-details">Intermediary Details <span aria-hidden="true">*</span></label>
          <textarea id="k-intermediary-details" name="intermediaryDetails" rows="4" maxLength={2000} required value={values.intermediaryDetails} onChange={update} placeholder="Legal name, country and role." />
        </div>
      )}

      <h3 className="kyc-section-heading">F. Compliance Declarations</h3>

      <div className={`field kyc-declaration ${errors.sanctionsDeclaration ? 'has-error' : ''}`}>
        <label htmlFor="k-sanctions" className="kyc-declaration-label">
          <input id="k-sanctions" name="sanctionsDeclaration" type="checkbox" checked={values.sanctionsDeclaration} onChange={update} />
          <span>I confirm that, to the best of my knowledge, the organisation, intended end-user and disclosed parties are not subject to applicable sanctions or relevant prohibitions that would make the proposed enquiry unlawful.</span>
        </label>
      </div>

      <div className={`field kyc-declaration ${errors.exportControlDeclaration ? 'has-error' : ''}`}>
        <label htmlFor="k-export" className="kyc-declaration-label">
          <input id="k-export" name="exportControlDeclaration" type="checkbox" checked={values.exportControlDeclaration} onChange={update} />
          <span>I understand that the proposed goods, software, technology or transaction may be subject to export, trade or transfer controls and that any required authorisation must be obtained before controlled activity proceeds.</span>
        </label>
      </div>

      <div className={`field kyc-declaration ${errors.eusDeclaration ? 'has-error' : ''}`}>
        <label htmlFor="k-eus" className="kyc-declaration-label">
          <input id="k-eus" name="eusDeclaration" type="checkbox" checked={values.eusDeclaration} onChange={update} />
          <span>I understand that Armtrex may require an End-User Certificate or Undertaking and additional supporting information before progressing an enquiry.</span>
        </label>
      </div>

      <div className="kyc-privacy-note">
        <strong>Data protection:</strong> Information submitted through this form is used for enquiry
        handling, counterparty assessment, due diligence and compliance screening. Armtrex may request
        further information where necessary. Please do not submit passport copies or other sensitive
        identity documents through this public form unless Armtrex specifically instructs you to use a
        secure submission channel.
      </div>

      <div className="kyc-declaration-summary">
        Submission of this form does not constitute approval, licensing, catalogue access or an
        obligation to supply. Armtrex conducts its own independent checks and may request additional
        documentation or decline an enquiry where the proposed activity cannot lawfully and responsibly proceed.
      </div>

      <div className="hp-field" aria-hidden="true">
        <label htmlFor="k-honeypot">Website</label>
        <input id="k-honeypot" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" value={values._gotcha} onChange={update} />
      </div>

      {status === 'sent' && (
        <div className="form-notice" role="status">
          Your enquiry has been submitted for review. Armtrex will contact you if further information
          or documentation is required.
        </div>
      )}

      {status === 'failed' && (
        <div className="form-notice form-notice-error" role="alert">
          The enquiry could not be submitted automatically. Please contact{' '}
          <a href={`mailto:${company.contact.kycEmail}`}>{company.contact.kycEmail}</a> directly.
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'Submitting…' : 'Submit Enquiry'}
      </button>
    </form>
  )
}
