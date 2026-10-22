export const reportingResources = [
  {
    country: "IN",
    name: "National Cyber Crime Reporting Portal",
    url: "https://cybercrime.gov.in/",
    financialFraudPhone: "1930",
    source: "https://i4c.mha.gov.in/ncrp.aspx",
    verifiedOn: "2026-10-22",
  },
];
export const articles = [
  {
    slug: "phishing",
    title: "A familiar logo isn’t proof of identity.",
    category: "LINKS & MESSAGES",
    intro:
      "Phishing uses messages and websites that imitate trusted services to obtain information or money.",
    steps: [
      [
        "Read the actual destination",
        "An address can contain a familiar brand while belonging to someone else. The registered domain matters more than a logo or a word elsewhere in the address. HTTPS protects a connection; it does not prove honesty.",
      ],
      [
        "Use a route you already trust",
        "Open the official app or type a known website address yourself. Avoid using contact details or links supplied in the suspicious message.",
      ],
      [
        "Keep authentication private",
        "Never give a caller or message sender your password or one-time code. If you initiated a sign-in, enter the code only in the service you independently opened.",
      ],
    ],
    source:
      "https://www.cisa.gov/secure-our-world/recognize-and-report-phishing",
  },
  {
    slug: "otp-scams",
    title: "Your one-time code is a key. Keep it yours.",
    category: "ACCOUNT SECURITY",
    intro:
      "A caller may claim a code is needed to reverse a payment, stop fraud, or deliver a parcel. Sharing it can authorize access or a transaction.",
    steps: [
      [
        "Stop the conversation",
        "Do not share the code or approve unexpected login prompts. Legitimate-looking caller IDs and profile photos are not reliable identity checks.",
      ],
      [
        "Verify the activity",
        "Check the official app and contact the service through a known channel. Review recent logins and transactions.",
      ],
      [
        "If you shared a code",
        "Contact the affected service immediately, secure your account from a trusted device, and tell your bank if a payment or financial account may be affected.",
      ],
    ],
    source: "https://www.cisa.gov/secure-our-world/turn-mfa",
  },
  {
    slug: "fake-job-offers",
    title: "The offer looks perfect. Is the process?",
    category: "WORK & OPPORTUNITIES",
    intro:
      "A polished offer letter does not establish an employer’s identity. Check the process, the communication channel, and any request for money.",
    steps: [
      [
        "Verify the role independently",
        "Find the employer’s official careers page yourself. Contact recruitment through official contact details, not those in the offer.",
      ],
      [
        "Question upfront payments",
        "Registration, verification, training or equipment payments before a job starts need particular scrutiny. Do not send money simply because an offer looks official.",
      ],
      [
        "Limit identity documents",
        "Before sending sensitive documents, establish who is receiving them, why they are needed and how they will be handled. Never provide banking passwords or one-time codes.",
      ],
    ],
    source: "https://consumer.ftc.gov/articles/job-scams",
  },
  {
    slug: "shopping-fraud",
    title: "Before the bargain, check the seller.",
    category: "SHOPPING & PAYMENTS",
    intro:
      "A low price is not proof of fraud. Combine the offer with verifiable seller details, a clear returns policy, and payment protections.",
    steps: [
      [
        "Look beyond the storefront",
        "Check independent information and contact details. Reviews can be fabricated; avoid relying on testimonials hosted only by the seller.",
      ],
      [
        "Keep protections in place",
        "Use the platform’s checkout and a payment method with dispute options where available. Off-platform transfers, gift cards and cryptocurrency can be difficult to reverse.",
      ],
      [
        "Document the purchase",
        "Keep the listing, order confirmation, correspondence and payment record. If something goes wrong, contact the platform and payment provider promptly.",
      ],
    ],
    source: "https://consumer.ftc.gov/articles/online-shopping",
  },
  {
    slug: "qr-payment-scams",
    title: "Scanning a QR code can start more than a payment.",
    category: "PAYMENTS",
    intro:
      "A QR code can lead to a deceptive website or prefill a payment request. Treat it with the same care as a link.",
    steps: [
      [
        "Inspect the destination",
        "Check the website or payment recipient before continuing. Beware of stickers placed over real payment or parking codes.",
      ],
      [
        "Understand what you authorize",
        "Read the amount, recipient and transaction type in your official payment app. Do not enter a PIN merely because someone says it is necessary to receive a refund.",
      ],
      [
        "If you approved an unexpected payment",
        "Contact your bank or payment provider through its official channel immediately. Preserve the QR image and transaction details for reporting.",
      ],
    ],
    source:
      "https://consumer.ftc.gov/consumer-alerts/2023/12/scammers-hide-harmful-links-qr-codes-protect-your-information",
  },
  {
    slug: "impersonation",
    title: "Recognize the request, then verify the person.",
    category: "IDENTITY & TRUST",
    intro:
      "Impersonators can copy profile photos, display names, email styles and even voices. A familiar appearance is a reason to check, not proof.",
    steps: [
      [
        "Use a second channel",
        "Call a number you already know or open the organization’s official app. Do not let the sender choose the only verification route.",
      ],
      [
        "Question secrecy and urgency",
        "Requests to hide a transaction or act without speaking to anyone else deserve a pause. Threats and emotional pressure can be tools of manipulation.",
      ],
      [
        "Report the impersonation",
        "Use the affected platform’s reporting tools. Preserve relevant messages without sharing them publicly if they contain private details.",
      ],
    ],
    source: "https://consumer.ftc.gov/articles/how-avoid-scam",
  },
  {
    slug: "account-takeover",
    title: "When an account stops feeling like yours.",
    category: "ACCOUNT RECOVERY",
    intro:
      "Unexpected password resets, login notifications or messages sent without your knowledge can indicate account compromise.",
    steps: [
      [
        "Recover through the official service",
        "Use the service’s recovery process from a trusted device. Avoid third-party recovery agents promising guaranteed access.",
      ],
      [
        "Secure the whole chain",
        "Change reused passwords, secure the email account used for recovery, review recovery details and revoke unfamiliar sessions or connected apps.",
      ],
      [
        "Warn contacts when relevant",
        "If the account sent suspicious messages, tell contacts through a separate trusted channel. Enable stronger multi-factor authentication where available.",
      ],
    ],
    source: "https://www.cisa.gov/secure-our-world/use-strong-passwords",
  },
  {
    slug: "investment-fraud",
    title: "A guaranteed return deserves a real question.",
    category: "FINANCIAL CLAIMS",
    intro:
      "High returns, urgency, and claims of zero risk can be warning signs. Independent checks matter more than a dashboard showing apparent profits.",
    steps: [
      [
        "Verify registration independently",
        "Check the relevant financial regulator’s official website for your location. A registration claim or screenshot alone is not verification.",
      ],
      [
        "Watch for withdrawal traps",
        "Requests for extra tax, deposits or unlocking fees to withdraw funds can compound losses. Do not send more money just to recover an earlier payment.",
      ],
      [
        "Avoid recovery promises",
        "People promising guaranteed recovery for an upfront fee may be targeting victims again. Seek help from your bank and official reporting channels.",
      ],
    ],
    source:
      "https://www.investor.gov/protect-your-investments/fraud/how-avoid-fraud",
  },
  {
    slug: "after-sharing-information",
    title: "Already clicked? Focus on what’s next.",
    category: "RECOVERY",
    intro:
      "A click does not always mean an account was compromised. The right next steps depend on what you shared, downloaded or approved.",
    steps: [
      [
        "If you only opened a page",
        "Close it. Do not download files, enable notifications or enter information. Update your browser and device. If you installed software, use your device’s security tools and seek trusted technical help.",
      ],
      [
        "If you shared credentials or access",
        "Change the affected password from a trusted device, revoke unfamiliar sessions, and replace reused passwords elsewhere. If you granted remote access, disconnect that session and secure accounts from another trusted device.",
      ],
      [
        "If money or bank details are involved",
        "Contact your bank or payment provider immediately using an official number. Ask about blocking affected instruments and disputing transactions. Preserve messages, timestamps and payment records. In India, call 1930 promptly for financial cyber fraud and report at cybercrime.gov.in.",
      ],
    ],
    source: "https://consumer.ftc.gov/articles/what-do-if-you-were-scammed",
  },
] as const;
