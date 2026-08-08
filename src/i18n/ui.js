import { useLang } from './LanguageContext.jsx'

// UI chrome strings. Product/company *content* is translated in the data
// overlay file (company.ms.js); this file is only the
// interface furniture. English is the source of truth and the fallback.
const dict = {
  en: {
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.kyc': 'Request Access',
    'nav.contact': 'Contact Us',
    'nav.primary': 'Primary',
    'nav.toggle': 'Toggle navigation menu',
    'nav.footer': 'Footer',
    'skipToContent': 'Skip to main content',
    backToTop: 'Back to top',
    'brand.homeAria': 'Armtrex Ltd, home',
    'lang.label': 'Language',
    'lang.en': 'EN',
    'lang.ms': 'MS',
    'lang.enFull': 'English',
    'lang.msFull': 'Bahasa Melayu',

    'hero.region': 'Featured products',
    'hero.featured': 'Featured',
    'hero.viewProducts': 'View Products',
    'hero.contactUs': 'Contact Us',
    'hero.prev': 'Previous slide',
    'hero.next': 'Next slide',
    'hero.controls': 'Carousel controls',
    'hero.goToSlide': 'Go to slide', // "Go to slide 1: <name>"

    'cred.registration': 'Company Registration',
    'cred.exportStatus': 'Export Status',
    'cred.exportStatusValue': 'Defence-Controlled · Authorized Buyers Only',
    'cred.certification': 'Certification',
    'cred.aria': 'Company credentials',

    'brief.kicker': 'Company Profile',
    'brief.heading': 'Who We Are',
    'brief.mission': 'Mission',
    'brief.vision': 'Vision',

    'cap.kicker': 'Core Business Activities',
    'cap.heading': 'Capabilities',
    'cap.cta':
      'Explore our portfolio of artillery and mortar ammunition, unguided rockets, and propellant charge systems.',
    'cap.viewAll': 'View All Products',

    'factory.kicker': 'Procurement & Supply Chain',
    'factory.heading': 'Inside the Supply Chain',
    'factory.lead':
      'From forging and precision machining through finishing, quality assurance, and export — an integrated artillery and ammunition supply chain sourced from vetted production partners.',
    'factory.line': 'Production Line',
    'factory.machining': 'Precision Machining',
    'factory.marking': 'Finishing & Marking',
    'factory.charge': 'Charge Systems',
    'factory.inspection': 'Energetic Materials',
    'factory.logistics': 'Logistics & Export',

    'compliance.kicker': 'Compliance & Quality Assurance',
    'compliance.heading': 'Responsible Defence Procurement',

    'loc.kicker': 'Locations',
    'loc.heading': 'Office',
    'loc.directContact': 'Direct Contact',
    'loc.telephone': 'Telephone',
    'loc.email': 'Email',
    'loc.website': 'Website',

    'footer.contact': 'Contact',
    'footer.regNo': 'Company Reg. No.',
    'footer.tel': 'Tel',
    'footer.email': 'Email: ',
    'footer.web': 'Web: ',
    'footer.rights': 'All rights reserved.',
    'footer.compliance':
      'Defence-related and dual-use enquiries are subject to applicable export-control, sanctions, end-use, destination and due-diligence requirements. No enquiry or catalogue request constitutes approval or authorisation to supply.',

    'products.kicker': 'Product Portfolio',
    'products.heading': 'Products',
    'products.lead':
      'Conventional ammunition systems, artillery and mortar munitions, unguided rockets, and propellant charge systems. All product descriptions are drawn directly from the manufacturer datasheets.',
    'products.all': 'All Products',
    'products.showing': 'Showing', // "Showing 26 products"
    'products.product': 'product',
    'products.products': 'products',
    'products.item': 'item',
    'products.items': 'items',
    'products.filterAria': 'Filter products by category',
    'view.label': 'View',
    'view.item': 'Item View',
    'view.table': 'Table View',
    'table.product': 'Product',
    'table.caliber': 'Caliber',
    'table.velocity': 'Muzzle velocity',
    'table.range': 'Max range',
    'table.view': 'View',

    'card.view': 'View', // "View <name>"
    'card.viewDetails': 'View details',
    'card.noDesc': 'No product description available in source content.',
    'card.noImage': 'No product image available',

    'detail.breadcrumb': 'Breadcrumb',
    'detail.specs': 'Technical Specifications',
    'detail.systems': 'Compatible Systems',
    'detail.back': 'Back to Products',
    'detail.enquire': 'Enquire About This Product',
    'detail.noDesc': 'No product description available in source content.',

    'contact.kicker': 'Get in Touch',
    'contact.heading': 'Contact Us',
    'contact.lead':
      'For governmental, military, and authorized defence-sector enquiries, please contact Armtrex using the details below.',
    'contact.directLines': 'Direct Lines',
    'contact.complianceLabel': 'Compliance',
    'contact.complianceNote': 'All correspondence with Armtrex Ltd will be stored for UK licence compliance regulations.',
    'contact.sendEnquiry': 'Send an Enquiry',
    'contact.regarding': 'Regarding',

    'form.name': 'Name',
    'form.email': 'Email',
    'form.company': 'Company',
    'form.subject': 'Subject',
    'form.message': 'Message',
    'form.send': 'Send Message',
    'form.sending': 'Sending…',
    'form.error': 'Please complete all required fields (Name, Email, Subject, and Message).',
    'form.fieldRequired': 'This field is required.',

    'gate.kicker': 'Restricted Access',
    'gate.heading': 'KYC & Security Clearance Required',
    'gate.lead':
      'Product specifications are only available to buyers and meeting attendees who have completed Know-Your-Customer (KYC), security, and end-use capacity screening. Submit a request below — our security team will follow up with a private, time-limited access link once clearance is confirmed.',
    'gate.checking': 'Checking your access link…',
    'gate.error': 'We couldn\u2019t verify that access link. It may have expired — request a new one below.',
    'gate.cta': 'Request Access (KYC Form)',
    'gate.home': 'Back to Home',
    'form.sentThanks':
      'Thank you — your enquiry has been sent. Our team will be in touch shortly.',
    'form.failed':
      'Sorry, your message could not be sent right now. Please email us directly at',
    'form.sent':
      'Your email client should now open with this enquiry ready to send. If it doesn’t, please email us directly at',
    'form.mailPrefix': '[Website Enquiry]',
    'form.bodyName': 'Name',
    'form.bodyEmail': 'Email',
    'form.bodyCompany': 'Company',
    'prefill.subject': 'Product Enquiry', // "Product Enquiry: <name>"
    'prefill.message': 'I would like to request further information about the', // "... the <name> (<category>)."
  },
  ms: {
    'nav.home': 'Utama',
    'nav.products': 'Produk',
    'nav.kyc': 'Minta Akses',
    'nav.contact': 'Hubungi Kami',
    'nav.primary': 'Utama',
    'nav.toggle': 'Togol menu navigasi',
    'skipToContent': 'Langkau ke kandungan utama',
    'nav.footer': 'Pengaki',
    backToTop: 'Kembali ke atas',
    'brand.homeAria': 'Armtrex Ltd, laman utama',
    'lang.label': 'Bahasa',
    'lang.en': 'EN',
    'lang.ms': 'MS',
    'lang.enFull': 'English',
    'lang.msFull': 'Bahasa Melayu',

    'hero.region': 'Produk pilihan',
    'hero.featured': 'Pilihan',
    'hero.viewProducts': 'Lihat Produk',
    'hero.contactUs': 'Hubungi Kami',
    'hero.prev': 'Slaid sebelumnya',
    'hero.next': 'Slaid seterusnya',
    'hero.controls': 'Kawalan karusel',
    'hero.goToSlide': 'Pergi ke slaid',

    'cred.registration': 'Pendaftaran Syarikat',
    'cred.exportStatus': 'Status Eksport',
    'cred.exportStatusValue': 'Terkawal Pertahanan · Pembeli Sah Sahaja',
    'cred.certification': 'Pensijilan',
    'cred.aria': 'Kelayakan syarikat',

    'brief.kicker': 'Profil Syarikat',
    'brief.heading': 'Siapa Kami',
    'brief.mission': 'Misi',
    'brief.vision': 'Visi',

    'cap.kicker': 'Aktiviti Perniagaan Teras',
    'cap.heading': 'Keupayaan',
    'cap.cta':
      'Terokai portfolio kami yang merangkumi amunisi artileri dan mortar, roket tidak berpandu, serta sistem cas propelan.',
    'cap.viewAll': 'Lihat Semua Produk',

    'factory.kicker': 'Pembuatan & Pengeluaran',
    'factory.heading': 'Di Dalam Kilang',
    'factory.lead':
      'Daripada penempaan dan pemesinan persisian hingga penyudahan, jaminan kualiti, dan eksport — keupayaan pengeluaran amunisi dan artileri yang bersepadu.',
    'factory.line': 'Barisan Pengeluaran',
    'factory.machining': 'Pemesinan Persisian',
    'factory.marking': 'Penyudahan & Penandaan',
    'factory.charge': 'Sistem Cas',
    'factory.inspection': 'Bahan Bertenaga',
    'factory.logistics': 'Logistik & Eksport',

    'compliance.kicker': 'Pematuhan & Jaminan Kualiti',
    'compliance.heading': 'Pembuatan Pertahanan Bertanggungjawab',

    'loc.kicker': 'Lokasi',
    'loc.heading': 'Pejabat & Kilang',
    'loc.directContact': 'Hubungan Terus',
    'loc.telephone': 'Telefon',
    'loc.email': 'E-mel',
    'loc.website': 'Laman Web',

    'footer.contact': 'Hubungi',
    'footer.regNo': 'No. Pendaftaran Syarikat',
    'footer.tel': 'Tel',
    'footer.email': 'E-mel',
    'footer.web': 'Web',
    'footer.rights': 'Hak cipta terpelihara.',
    'footer.compliance':
      'Produk berkaitan pertahanan dan dwiguna dibekalkan kepada pelanggan kerajaan dan sektor pertahanan yang dibenarkan, mematuhi peraturan Malaysia dan antarabangsa yang berkenaan.',

    'products.kicker': 'Portfolio Produk',
    'products.heading': 'Produk',
    'products.lead':
      'Sistem amunisi konvensional, munisi artileri dan mortar, roket tidak berpandu, serta sistem cas propelan. Semua keterangan produk diambil terus daripada lembaran data pengeluar.',
    'products.all': 'Semua Produk',
    'products.showing': 'Memaparkan',
    'products.product': 'produk',
    'products.products': 'produk',
    'products.item': 'item',
    'products.items': 'item',
    'products.filterAria': 'Tapis produk mengikut kategori',
    'view.label': 'Paparan',
    'view.item': 'Paparan Item',
    'view.table': 'Paparan Jadual',
    'table.product': 'Produk',
    'table.caliber': 'Kaliber',
    'table.velocity': 'Halaju muncung',
    'table.range': 'Julat maksimum',
    'table.view': 'Lihat',

    'card.view': 'Lihat',
    'card.viewDetails': 'Lihat butiran',
    'card.noDesc': 'Tiada keterangan produk dalam kandungan sumber.',
    'card.noImage': 'Tiada imej produk tersedia',

    'detail.breadcrumb': 'Roti serbuk',
    'detail.specs': 'Spesifikasi Teknikal',
    'detail.systems': 'Sistem Serasi',
    'detail.back': 'Kembali ke Produk',
    'detail.enquire': 'Tanya Mengenai Produk Ini',
    'detail.noDesc': 'Tiada keterangan produk dalam kandungan sumber.',

    'contact.kicker': 'Hubungi Kami',
    'contact.heading': 'Hubungi Kami',
    'contact.lead':
      'Untuk pertanyaan kerajaan, tentera, dan sektor pertahanan yang dibenarkan, sila hubungi Armtrex menggunakan butiran di bawah.',
    'contact.directLines': 'Talian Terus',
    'contact.sendEnquiry': 'Hantar Pertanyaan',
    'contact.regarding': 'Berkenaan',

    'form.name': 'Nama',
    'form.email': 'E-mel',
    'form.company': 'Syarikat',
    'form.subject': 'Subjek',
    'form.message': 'Mesej',
    'form.send': 'Hantar Mesej',
    'form.sending': 'Menghantar…',
    'form.error': 'Sila lengkapkan semua medan yang diperlukan (Nama, E-mel, Subjek, dan Mesej).',
    'form.fieldRequired': 'Medan ini diperlukan.',
    'form.sentThanks':
      'Terima kasih — pertanyaan anda telah dihantar. Pasukan kami akan menghubungi anda tidak lama lagi.',
    'form.failed':
      'Maaf, mesej anda tidak dapat dihantar buat masa ini. Sila e-mel kami terus di',
    'form.sent':
      'Klien e-mel anda kini sepatutnya terbuka dengan pertanyaan ini sedia untuk dihantar. Jika tidak, sila e-mel kami terus di',
    'form.mailPrefix': '[Pertanyaan Laman Web]',
    'form.bodyName': 'Nama',
    'form.bodyEmail': 'E-mel',
    'form.bodyCompany': 'Syarikat',
    'prefill.subject': 'Pertanyaan Produk',
    'prefill.message': 'Saya ingin meminta maklumat lanjut mengenai',
  },
}

export function useT() {
  const { lang } = useLang()
  return (key) => dict[lang]?.[key] ?? dict.en[key] ?? key
}
