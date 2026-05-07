'use client';

import { useState } from 'react';

const mockEmails = [
  {
    id: '1',
    customer: 'Adebayo Okonkwo',
    company: 'Adebayo Plastics Ltd',
    subject: 'PP T30S Quotation - Competitive Pricing for Nigeria Market',
    language: 'English',
    product: 'PP',
    sentAt: '2024-01-15 14:30',
    status: 'sent',
  },
  {
    id: '2',
    customer: 'Amara Diallo',
    company: 'Amara Trading SARL',
    subject: 'Devis PP T30S - Prix compétitifs pour le marché sénégalais',
    language: 'Français',
    product: 'PP',
    sentAt: '2024-01-14 10:15',
    status: 'sent',
  },
  {
    id: '3',
    customer: 'Samuel Owusu',
    company: 'Owusu Manufacturing',
    subject: 'ABS 750A Supply Proposal - Premium Quality for Electronics',
    language: 'English',
    product: 'ABS',
    sentAt: '2024-01-13 16:00',
    status: 'draft',
  },
  {
    id: '4',
    customer: 'Moussa Keita',
    company: 'Keita Import Export',
    subject: 'Cotação de PE HDPE 5000S - Fornecimento Regular para Mali',
    language: 'Português',
    product: 'PE',
    sentAt: '2024-01-12 09:45',
    status: 'sent',
  },
];

const emailTemplates: Record<string, Record<string, { subject: string; body: string }>> = {
  English: {
    PP: {
      subject: 'PP {grade} Quotation - Competitive Pricing for {country} Market',
      body: `Dear {name},

I hope this email finds you well. My name is Alex from SL Trade, and I'm reaching out regarding your interest in polypropylene raw materials.

We are pleased to offer you our premium PP {grade} at highly competitive prices:

Product: PP {grade} (Homopolymer)
MFR: 3.0 g/10min
Origin: China (Sinopec/PetroChina)
Price: USD $1,150/MT CIF {port}
MOQ: 25 MT
Packaging: 25kg bags on pallets
Delivery: 25-30 days after payment confirmation

Our PP {grade} is widely used in woven bags, packaging films, injection molding, and fiber production. We have a proven track record of supplying major manufacturers across Africa.

Payment Terms:
- 30% T/T advance
- 70% against copy of B/L
- L/C at sight also accepted

We can also provide SGS inspection certificates and COA for your reference.

Looking forward to building a long-term partnership with {company}.

Best regards,
Alex Chen
SL Trade International
WhatsApp: +86-138-0000-0000`,
    },
    PE: {
      subject: 'HDPE 5000S Supply Offer - Quality Materials for {country}',
      body: `Dear {name},

Greetings from SL Trade! We specialize in supplying premium plastic raw materials to the African market.

I'd like to present our competitive offer for HDPE 5000S:

Product: HDPE 5000S
MFR: 0.35 g/10min
Density: 0.954 g/cm³
Origin: China
Price: USD $1,050/MT CIF {port}
MOQ: 25 MT
Delivery: 25-30 days

HDPE 5000S is ideal for bottles, containers, pipes, and industrial tanks. Our material meets international quality standards.

Payment Terms: 30% T/T advance, 70% against B/L copy.

Please feel free to request samples or additional technical data sheets.

Best regards,
Alex Chen
SL Trade International`,
    },
    PVC: {
      subject: 'PVC SG-5 Quotation - Premium Quality for {country} Market',
      body: `Dear {name},

I hope you're doing well. I'm writing to offer you our premium PVC SG-5 resin.

Product: PVC SG-5 (Suspension Grade)
K Value: 66-68
Origin: China
Price: USD $780/MT CIF {port}
MOQ: 25 MT
Delivery: 25-30 days

Suitable for pipes, profiles, cable insulation, and films. Consistent quality with full certification.

Looking forward to your inquiry.

Best regards,
Alex Chen
SL Trade International`,
    },
    ABS: {
      subject: 'ABS 750A Supply - High Performance Materials for {company}',
      body: `Dear {name},

SL Trade is pleased to offer ABS 750A resin for your manufacturing needs.

Product: ABS 750A
MFR: 22 g/10min
Origin: China
Price: USD $1,380/MT CIF {port}
MOQ: 20 MT

Ideal for electronics housings, automotive parts, and home appliances.

Best regards,
Alex Chen
SL Trade International`,
    },
    PET: {
      subject: 'PET CZ-328 Bottle Grade - Competitive Offer for {country}',
      body: `Dear {name},

We offer premium PET CZ-328 bottle grade resin:

IV: 0.80 dL/g
Price: USD $920/MT CIF {port}
MOQ: 25 MT

Perfect for beverage bottles and food containers.

Best regards,
Alex Chen
SL Trade International`,
    },
    PS: {
      subject: 'GPPS 525 Quotation for {company}',
      body: `Dear {name},

Our GPPS 525 offer:

MFR: 8.0 g/10min
Price: USD $1,100/MT CIF {port}
MOQ: 20 MT

Excellent for food packaging and display cases.

Best regards,
Alex Chen
SL Trade International`,
    },
  },
  'Français': {
    PP: {
      subject: 'Devis PP {grade} - Prix compétitifs pour le marché {country}',
      body: `Cher(e) {name},

J'espère que vous allez bien. Je suis Alex de SL Trade, et je vous contacte concernant votre intérêt pour les matières premières en polypropylène.

Nous avons le plaisir de vous proposer notre PP {grade} premium à des prix très compétitifs :

Produit : PP {grade} (Homopolymère)
MFR : 3.0 g/10min
Origine : Chine (Sinopec/PetroChina)
Prix : USD $1,150/MT CIF {port}
MOQ : 25 MT
Emballage : Sacs de 25kg sur palettes
Livraison : 25-30 jours après confirmation du paiement

Conditions de paiement :
- 30% T/T à l'avance
- 70% contre copie du B/L
- L/C à vue également acceptée

Dans l'attente de construire un partenariat à long terme avec {company}.

Cordialement,
Alex Chen
SL Trade International
WhatsApp: +86-138-0000-0000`,
    },
    PE: {
      subject: 'Offre HDPE 5000S pour {company}',
      body: `Cher(e) {name},

Nous proposons du HDPE 5000S de qualité premium :

Prix : USD $1,050/MT CIF {port}
MOQ : 25 MT
Livraison : 25-30 jours

Cordialement,
Alex Chen - SL Trade International`,
    },
    PVC: {
      subject: 'Devis PVC SG-5 pour le marché {country}',
      body: `Cher(e) {name},

Notre offre PVC SG-5 :
Prix : USD $780/MT CIF {port}
MOQ : 25 MT

Cordialement,
Alex Chen - SL Trade International`,
    },
    ABS: {
      subject: 'Offre ABS 750A - {company}',
      body: `Cher(e) {name},

ABS 750A disponible : USD $1,380/MT CIF {port}

Cordialement, Alex Chen - SL Trade`,
    },
    PET: {
      subject: 'PET CZ-328 pour {country}',
      body: `Cher(e) {name},

PET CZ-328 : USD $920/MT CIF {port}

Cordialement, Alex Chen - SL Trade`,
    },
    PS: {
      subject: 'GPPS 525 pour {company}',
      body: `Cher(e) {name},

GPPS 525 : USD $1,100/MT CIF {port}

Cordialement, Alex Chen - SL Trade`,
    },
  },
  'Português': {
    PP: {
      subject: 'Cotação PP {grade} - Preços competitivos para o mercado {country}',
      body: `Prezado(a) {name},

Espero que esteja bem. Sou Alex da SL Trade, e entro em contato sobre seu interesse em matérias-primas de polipropileno.

Temos o prazer de oferecer nosso PP {grade} premium:

Produto: PP {grade} (Homopolímero)
MFR: 3.0 g/10min
Origem: China (Sinopec/PetroChina)
Preço: USD $1,150/MT CIF {port}
MOQ: 25 MT
Embalagem: Sacos de 25kg em paletes
Entrega: 25-30 dias após confirmação do pagamento

Condições de pagamento:
- 30% T/T antecipado
- 70% contra cópia do B/L

Aguardamos construir uma parceria duradoura com {company}.

Atenciosamente,
Alex Chen
SL Trade International
WhatsApp: +86-138-0000-0000`,
    },
    PE: {
      subject: 'Oferta HDPE 5000S para {company}',
      body: `Prezado(a) {name},

HDPE 5000S premium: USD $1,050/MT CIF {port}
MOQ: 25 MT

Atenciosamente, Alex Chen - SL Trade`,
    },
    PVC: {
      subject: 'Cotação PVC SG-5 - {country}',
      body: `Prezado(a) {name},

PVC SG-5: USD $780/MT CIF {port}
MOQ: 25 MT

Atenciosamente, Alex Chen - SL Trade`,
    },
    ABS: {
      subject: 'ABS 750A para {company}',
      body: `Prezado(a) {name},

ABS 750A: USD $1,380/MT CIF {port}

Atenciosamente, Alex Chen - SL Trade`,
    },
    PET: {
      subject: 'PET CZ-328 - {country}',
      body: `Prezado(a) {name},

PET CZ-328: USD $920/MT CIF {port}

Atenciosamente, Alex Chen - SL Trade`,
    },
    PS: {
      subject: 'GPPS 525 - {company}',
      body: `Prezado(a) {name},

GPPS 525: USD $1,100/MT CIF {port}

Atenciosamente, Alex Chen - SL Trade`,
    },
  },
};

const portMap: Record<string, string> = {
  Nigeria: 'Lagos',
  Ghana: 'Tema',
  Kenya: 'Mombasa',
  Senegal: 'Dakar',
  'Ivory Coast': 'Abidjan',
  Tanzania: 'Dar es Salaam',
  'South Africa': 'Durban',
  Cameroon: 'Douala',
  Guinea: 'Conakry',
  Mali: 'Dakar',
  Mozambique: 'Maputo',
  Angola: 'Luanda',
  Ethiopia: 'Djibouti',
};

const gradeMap: Record<string, string> = {
  PP: 'T30S',
  PE: '5000S',
  PVC: 'SG-5',
  ABS: '750A',
  PET: 'CZ-328',
  PS: '525',
};

export default function EmailsPage() {
  const [customerName, setCustomerName] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [customerCountry, setCustomerCountry] = useState('Nigeria');
  const [language, setLanguage] = useState('English');
  const [product, setProduct] = useState('PP');
  const [tone, setTone] = useState('Professional');
  const [generatedSubject, setGeneratedSubject] = useState('');
  const [generatedBody, setGeneratedBody] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emails, setEmails] = useState(mockEmails);

  const generateEmail = () => {
    if (!customerName || !customerCompany) return;

    setIsGenerating(true);
    setGeneratedSubject('');
    setGeneratedBody('');

    setTimeout(() => {
      const template = emailTemplates[language]?.[product];
      if (!template) {
        setIsGenerating(false);
        return;
      }

      const port = portMap[customerCountry] || 'Lagos';
      const grade = gradeMap[product] || '';

      const subject = template.subject
        .replace(/{name}/g, customerName)
        .replace(/{company}/g, customerCompany)
        .replace(/{country}/g, customerCountry)
        .replace(/{port}/g, port)
        .replace(/{grade}/g, grade);

      const body = template.body
        .replace(/{name}/g, customerName)
        .replace(/{company}/g, customerCompany)
        .replace(/{country}/g, customerCountry)
        .replace(/{port}/g, port)
        .replace(/{grade}/g, grade);

      let finalBody = body;
      if (tone === 'Friendly') {
        finalBody = finalBody.replace(/Dear /g, 'Hi ').replace(/Cher\(e\) /g, 'Salut ').replace(/Prezado\(a\) /g, 'Oi ');
      } else if (tone === 'Urgent') {
        const urgentLine = language === 'Français'
          ? '\n\n⚡ OFFRE SPÉCIALE - Valable 48 heures seulement! Contactez-nous maintenant pour bénéficier de ce prix.\n'
          : language === 'Português'
          ? '\n\n⚡ OFERTA ESPECIAL - Válida por apenas 48 horas! Entre em contato agora.\n'
          : '\n\n⚡ SPECIAL OFFER - Valid for 48 hours only! Contact us now to secure this pricing.\n';
        finalBody = finalBody + urgentLine;
      }

      setGeneratedSubject(subject);
      setGeneratedBody(finalBody);
      setIsGenerating(false);
    }, 1000);
  };

  const copyToClipboard = () => {
    const text = `Subject: ${generatedSubject}\n\n${generatedBody}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const markAsSent = () => {
    const newEmail = {
      id: String(emails.length + 1),
      customer: customerName,
      company: customerCompany,
      subject: generatedSubject,
      language,
      product,
      sentAt: new Date().toLocaleString(),
      status: 'sent',
    };
    setEmails([newEmail, ...emails]);
    setGeneratedSubject('');
    setGeneratedBody('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI 邮件生成器</h1>
        <p className="text-gray-500 mt-1">智能生成多语言开发信和报价邮件</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">邮件配置</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">客户姓名 *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="输入客户姓名"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公司名称 *</label>
                <input
                  type="text"
                  value={customerCompany}
                  onChange={(e) => setCustomerCompany(e.target.value)}
                  placeholder="输入公司名称"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">客户国家</label>
              <select
                value={customerCountry}
                onChange={(e) => setCustomerCountry(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent bg-white"
              >
                {Object.keys(portMap).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">语言</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent bg-white"
                >
                  <option value="English">English</option>
                  <option value="Français">Fran&ccedil;ais</option>
                  <option value="Português">Portugu&ecirc;s</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">产品</label>
                <select
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent bg-white"
                >
                  <option value="PP">PP (Polypropylene)</option>
                  <option value="PE">PE (Polyethylene)</option>
                  <option value="PVC">PVC</option>
                  <option value="ABS">ABS</option>
                  <option value="PET">PET</option>
                  <option value="PS">PS (Polystyrene)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">语气</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent bg-white"
                >
                  <option value="Professional">Professional</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
            <button
              onClick={generateEmail}
              disabled={isGenerating || !customerName || !customerCompany}
              className="w-full py-3 bg-accent hover:bg-accent-dark disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  AI 生成中...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  生成邮件
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">邮件预览</h2>
            {generatedSubject && (
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-light hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-600">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      已复制
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                      </svg>
                      复制
                    </>
                  )}
                </button>
                <button
                  onClick={markAsSent}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                  标记已发
                </button>
              </div>
            )}
          </div>
          {isGenerating ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <svg className="animate-spin w-10 h-10 text-accent mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-gray-500">AI 正在生成邮件...</p>
              </div>
            </div>
          ) : generatedSubject ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">主题</p>
                <p className="text-sm font-medium text-gray-900 p-3 bg-gray-50 rounded-lg">{generatedSubject}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">正文</p>
                <div className="text-sm text-gray-700 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
                  {generatedBody}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-gray-200 mx-auto mb-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <p className="text-gray-400">填写左侧信息后点击生成邮件</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">邮件历史</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">客户</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">主题</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">语言</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">产品</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">时间</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {emails.map((email) => (
                <tr key={email.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium text-sm text-gray-900">{email.customer}</div>
                    <div className="text-xs text-gray-500">{email.company}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 max-w-xs truncate">{email.subject}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{email.language}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{email.product}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{email.sentAt}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      email.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {email.status === 'sent' ? '已发送' : '草稿'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
