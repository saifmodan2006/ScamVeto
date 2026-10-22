import type {
  Evidence,
  Locale,
  Outcome,
  Report,
} from "@/lib/validation/schemas";
export const summaries: Record<Locale, Record<Outcome, string>> = {
  en: {
    KNOWN_MALICIOUS:
      "A configured reputation source returned a known threat match.",
    SUSPICIOUS_INDICATORS:
      "Concerning indicators were found. They do not establish fraud; verify the request independently.",
    NO_KNOWN_THREAT_FOUND:
      "Available checks returned no known threat match. This does not establish safety.",
    INSUFFICIENT_EVIDENCE:
      "There is not enough evidence to support a safety conclusion. Independent verification is needed.",
    ANALYSIS_UNAVAILABLE:
      "Essential AI analysis could not complete. No safety conclusion is available.",
  },
  hi: {
    KNOWN_MALICIOUS: "कॉन्फ़िगर किए गए प्रतिष्ठा स्रोत में ज्ञात खतरा मिला।",
    SUSPICIOUS_INDICATORS:
      "चिंताजनक संकेत मिले। ये धोखाधड़ी का प्रमाण नहीं हैं; स्वतंत्र सत्यापन करें।",
    NO_KNOWN_THREAT_FOUND:
      "उपलब्ध जाँच में ज्ञात खतरा नहीं मिला। यह सुरक्षा का प्रमाण नहीं है।",
    INSUFFICIENT_EVIDENCE:
      "सुरक्षा का निष्कर्ष देने के लिए पर्याप्त प्रमाण नहीं हैं। स्वतंत्र सत्यापन आवश्यक है।",
    ANALYSIS_UNAVAILABLE:
      "ज़रूरी AI विश्लेषण पूरा नहीं हुआ। सुरक्षा का निष्कर्ष उपलब्ध नहीं है।",
  },
  gu: {
    KNOWN_MALICIOUS: "ગોઠવેલા પ્રતિષ્ઠા સ્ત્રોતમાં જાણીતું જોખમ મળ્યું.",
    SUSPICIOUS_INDICATORS:
      "ચિંતાજનક સંકેતો મળ્યા. આ છેતરપિંડીનો પુરાવો નથી; સ્વતંત્ર ચકાસણી કરો.",
    NO_KNOWN_THREAT_FOUND:
      "ઉપલબ્ધ તપાસમાં જાણીતું જોખમ મળ્યું નથી. આ સુરક્ષાનો પુરાવો નથી.",
    INSUFFICIENT_EVIDENCE:
      "સુરક્ષા અંગે નિષ્કર્ષ માટે પૂરતા પુરાવા નથી. સ્વતંત્ર ચકાસણી જરૂરી છે.",
    ANALYSIS_UNAVAILABLE:
      "જરૂરી AI વિશ્લેષણ પૂર્ણ થયું નથી. સુરક્ષાનો નિષ્કર્ષ ઉપલબ્ધ નથી.",
  },
};
const guidance = {
  hi: { verify: "", items: {} as Record<string, string[]> },
  gu: { verify: "", items: {} as Record<string, string[]> },
};
guidance.hi.verify = "स्वतंत्र रूप से मिले आधिकारिक माध्यम से सत्यापन करें।";
guidance.gu.verify = "સ્વતંત્ર રીતે મળેલા અધિકૃત માધ્યમથી ચકાસણી કરો.";
guidance.hi.items = {
  otp: [
    "सुरक्षा कोड माँगा गया",
    "एक बार उपयोग होने वाला कोड साझा करने से खाते तक पहुँच मिल सकती है।",
    "किसी व्यक्ति को OTP न दें।",
  ],
  password: [
    "खाते के रहस्य माँगे गए",
    "निजी रहने वाली जानकारी माँगी जा रही है।",
    "आधिकारिक ऐप या ज्ञात पते से संपर्क करें।",
  ],
  fee: [
    "अग्रिम भुगतान की माँग",
    "अवसर से जुड़ा अग्रिम शुल्क सत्यापन की आवश्यकता वाला संकेत है।",
    "पैसे भेजने से पहले प्रस्ताव स्वतंत्र रूप से सत्यापित करें।",
  ],
  urgent: [
    "जल्दबाज़ी का दबाव",
    "समय का दबाव सावधानी घटा सकता है। वैध संदेश भी ज़रूरी हो सकते हैं।",
    "रुकें और अनुरोध का स्वतंत्र सत्यापन करें।",
  ],
  remote: [
    "रिमोट एक्सेस का उल्लेख",
    "दूर से डिवाइस का नियंत्रण खाते और जानकारी को जोखिम में डाल सकता है। संदर्भ मायने रखता है।",
    "अचानक आए कॉलर को डिवाइस का नियंत्रण न दें।",
  ],
  prize: [
    "अप्रत्याशित पुरस्कार का दावा",
    "फीस या लिंक से जुड़े अप्रत्याशित पुरस्कारों की जाँच ज़रूरी है।",
    "अप्रत्याशित पुरस्कार के लिए पैसे न दें।",
  ],
  payment: [
    "वापस पाना कठिन भुगतान",
    "इस भुगतान विधि में खरीदार सुरक्षा सीमित हो सकती है।",
    "जहाँ उपलब्ध हो विवाद समाधान वाली भुगतान विधि चुनें।",
  ],
  guarantee: [
    "गारंटीकृत आर्थिक लाभ",
    "आर्थिक गारंटी और असामान्य लाभ का स्वतंत्र सत्यापन करें।",
    "निवेश से पहले आधिकारिक नियामक जानकारी देखें।",
  ],
  userinfo: [
    "भ्रामक पता",
    "@ से पहले का हिस्सा गंतव्य डोमेन नहीं, उपयोगकर्ता जानकारी है।",
  ],
  http: [
    "असुरक्षित कनेक्शन",
    "HTTP यातायात को एन्क्रिप्ट नहीं करता। अकेले इससे धोखाधड़ी सिद्ध नहीं होती।",
    "HTTP पर संवेदनशील जानकारी न दें।",
  ],
  idn: [
    "अंतरराष्ट्रीय डोमेन",
    "ऐसे डोमेन वैध हो सकते हैं, लेकिन समान दिखने वाले अक्षर गंतव्य छिपा सकते हैं।",
  ],
  subdomains: [
    "जटिल सबडोमेन",
    "पंजीकृत डोमेन से पहले कई हिस्से हैं। वास्तविक पंजीकृत डोमेन पढ़ें।",
  ],
  encoding: [
    "एन्कोड किए अक्षर",
    "एन्कोडिंग आम है, लेकिन पता समझना कठिन बना सकती है।",
  ],
  brand: [
    "ब्रांड से मिलता उल्लेख",
    "पहचाना गया ब्रांड दूसरे पंजीकृत डोमेन में है। संबंध सत्यापित नहीं है।",
  ],
  reputation: [
    "खतरा सूची में मिला",
    "Google Web Risk ने गंतव्य के लिए ज्ञात खतरा लौटाया।",
    "इस गंतव्य से संपर्क न करें। संस्था से स्वतंत्र माध्यम से संपर्क करें।",
  ],
  recruiter: [
    "भर्तीकर्ता और वेबसाइट के अलग डोमेन",
    "ईमेल और दी गई वेबसाइट के पंजीकृत डोमेन अलग हैं। एजेंसियों के लिए यह सामान्य हो सकता है; धोखाधड़ी का प्रमाण नहीं है।",
    "नियोक्ता के आधिकारिक भर्ती माध्यम से भर्तीकर्ता की पुष्टि करें।",
  ],
};
guidance.gu.items = {
  otp: [
    "સુરક્ષા કોડની માંગ",
    "એક વખતનો કોડ આપવાથી કોઈને તમારા ખાતામાં પ્રવેશ મળી શકે છે.",
    "કોઈ વ્યક્તિને OTP ન આપો.",
  ],
  password: [
    "ખાતાના રહસ્યોની માંગ",
    "ખાનગી રાખવાની માહિતી માંગવામાં આવે છે.",
    "અધિકૃત એપ અથવા જાણીતા સરનામાથી સંપર્ક કરો.",
  ],
  fee: [
    "અગાઉથી ચુકવણીની માંગ",
    "તક સાથે જોડાયેલી આગોતરી ફી ચકાસણીની જરૂર ધરાવતો સંકેત છે.",
    "પૈસા મોકલતાં પહેલાં ઓફર સ્વતંત્ર રીતે ચકાસો.",
  ],
  urgent: [
    "ઉતાવળનું દબાણ",
    "સમયનું દબાણ સાવચેતી ઘટાડી શકે છે. માન્ય સંદેશ પણ તાત્કાલિક હોઈ શકે છે.",
    "થોભો અને વિનંતી સ્વતંત્ર રીતે ચકાસો.",
  ],
  remote: [
    "રિમોટ એક્સેસનો ઉલ્લેખ",
    "દૂરથી ઉપકરણનું નિયંત્રણ ખાતા અને માહિતીને જોખમમાં મૂકી શકે છે. સંદર્ભ મહત્વનો છે.",
    "અજાણ્યા કૉલરને ઉપકરણનું નિયંત્રણ ન આપો.",
  ],
  prize: [
    "અણધાર્યા ઇનામનો દાવો",
    "ફી અથવા લિંક સાથેના અણધાર્યા ઇનામોની તપાસ જરૂરી છે.",
    "અણધાર્યું ઇનામ મેળવવા પૈસા ન આપો.",
  ],
  payment: [
    "પાછી મેળવવી મુશ્કેલ ચુકવણી",
    "આ ચુકવણી પદ્ધતિમાં ખરીદદાર સુરક્ષા મર્યાદિત હોઈ શકે છે.",
    "ઉપલબ્ધ હોય તો વિવાદ ઉકેલવાળી ચુકવણી પદ્ધતિ પસંદ કરો.",
  ],
  guarantee: [
    "ખાતરીવાળા નાણાકીય વળતર",
    "નાણાકીય ગેરંટી અને અસામાન્ય નફો સ્વતંત્ર રીતે ચકાસો.",
    "રોકાણ પહેલાં અધિકૃત નિયમનકારી માહિતી તપાસો.",
  ],
  userinfo: [
    "ભ્રામક સરનામું",
    "@ પહેલાંનો ભાગ ગંતવ્ય ડોમેન નહીં પણ વપરાશકર્તાની માહિતી છે.",
  ],
  http: [
    "એન્ક્રિપ્શન વગરનું જોડાણ",
    "HTTP માહિતીનું એન્ક્રિપ્શન કરતું નથી. માત્ર આનાથી છેતરપિંડી સાબિત થતી નથી.",
    "HTTP પર સંવેદનશીલ માહિતી ન આપો.",
  ],
  idn: [
    "આંતરરાષ્ટ્રીય ડોમેન",
    "આવા ડોમેન માન્ય હોઈ શકે છે, પણ સમાન દેખાતા અક્ષરો ગંતવ્ય છુપાવી શકે છે.",
  ],
  subdomains: [
    "જટિલ સબડોમેન",
    "નોંધાયેલા ડોમેન પહેલાં ઘણા ભાગો છે. સાચું નોંધાયેલું ડોમેન વાંચો.",
  ],
  encoding: [
    "એન્કોડ કરેલા અક્ષરો",
    "એન્કોડિંગ સામાન્ય છે, પણ સરનામું સમજવું મુશ્કેલ કરી શકે છે.",
  ],
  brand: [
    "બ્રાન્ડનો મળતો ઉલ્લેખ",
    "ઓળખીતું બ્રાન્ડ બીજા નોંધાયેલા ડોમેનમાં છે. સંબંધ ચકાસાયેલો નથી.",
  ],
  reputation: [
    "જોખમ સૂચિમાં મળ્યું",
    "Google Web Risk એ ગંતવ્ય માટે જાણીતું જોખમ આપ્યું.",
    "આ ગંતવ્ય સાથે ક્રિયા ન કરો. સંસ્થાનો સ્વતંત્ર રીતે સંપર્ક કરો.",
  ],
  recruiter: [
    "ભરતીકર્તા અને વેબસાઇટના અલગ ડોમેન",
    "ઈમેલ અને આપેલી વેબસાઇટના નોંધાયેલા ડોમેન અલગ છે. એજન્સી માટે આ સામાન્ય હોઈ શકે છે; છેતરપિંડીનો પુરાવો નથી.",
    "નોકરીદાતાના અધિકૃત ભરતી માધ્યમથી ભરતીકર્તાની પુષ્ટિ કરો.",
  ],
};
export function localizeEvidence(e: Evidence, locale: Locale): Evidence {
  if (locale === "en" || e.category === "ai") return e;
  const key = e.id.startsWith("brand-")
    ? "brand"
    : e.category === "reputation"
      ? "reputation"
      : e.id;
  const translated = guidance[locale].items[key];
  if (!translated) return e;
  return {
    ...e,
    title: translated[0],
    explanation: translated[1],
    action: translated[2] ?? guidance[locale].verify,
  };
}
const staticStrings: Record<string, [string, string]> = {
  "Deterministic indicators": ["नियम आधारित संकेत", "નિયમ આધારિત સંકેતો"],
  "URL properties and contextual text patterns evaluated.": [
    "URL की विशेषताओं और संदर्भ वाले टेक्स्ट पैटर्न की जाँच हुई।",
    "URL ના ગુણધર્મો અને સંદર્ભવાળા લખાણ પેટર્ન તપાસાયા.",
  ],
  "Privacy redaction": ["निजी जानकारी छिपाना", "ખાનગી માહિતી ઢાંકવી"],
  "Recognizable secrets and personal identifiers masked before Gemini. Redaction may miss some information.":
    [
      "Gemini से पहले पहचानी गई निजी जानकारी छिपाई गई। कुछ जानकारी छूट सकती है।",
      "Gemini પહેલાં ઓળખાયેલી ખાનગી માહિતી ઢંકાઈ. કેટલીક માહિતી રહી શકે છે.",
    ],
  "Gemini interpretation": ["Gemini का विश्लेषण", "Gemini નું વિશ્લેષણ"],
  "Structured response validated. Supporting excerpts checked against the submission.":
    [
      "संरचित उत्तर और दिए गए अंश जाँचे गए।",
      "માળખાબદ્ધ જવાબ અને આપેલા અવતરણો તપાસાયા.",
    ],
  "AI analysis is not configured.": [
    "AI विश्लेषण कॉन्फ़िगर नहीं है।",
    "AI વિશ્લેષણ ગોઠવાયેલું નથી.",
  ],
  "AI analysis could not complete. Retry later.": [
    "AI विश्लेषण पूरा नहीं हुआ। बाद में कोशिश करें।",
    "AI વિશ્લેષણ પૂર્ણ થયું નથી. પછી પ્રયાસ કરો.",
  ],
  "No supported URL was supplied.": [
    "कोई समर्थित URL नहीं दिया गया।",
    "સમર્થિત URL આપવામાં આવ્યો નથી.",
  ],
  "Known threat-list match.": [
    "ज्ञात खतरा सूची में मिला।",
    "જાણીતા જોખમની સૂચિમાં મળ્યું.",
  ],
  "No match for the query-free URL. This is not proof of safety.": [
    "क्वेरी रहित URL का मिलान नहीं मिला। यह सुरक्षा का प्रमाण नहीं है।",
    "ક્વેરી વગરના URL નો મેળ મળ્યો નથી. આ સુરક્ષાનો પુરાવો નથી.",
  ],
  "No live threat-list lookup completed.": [
    "लाइव खतरा सूची की जाँच पूरी नहीं हुई।",
    "લાઇવ જોખમ સૂચિની તપાસ પૂર્ણ થઈ નથી.",
  ],
  "Contact the claimed organization using a known official channel.": [
    "संस्था से ज्ञात आधिकारिक माध्यम से संपर्क करें।",
    "સંસ્થાનો જાણીતા અધિકૃત માધ્યમથી સંપર્ક કરો.",
  ],
  "This report cannot prove safety or fraud.": [
    "यह रिपोर्ट सुरक्षा या धोखाधड़ी सिद्ध नहीं कर सकती।",
    "આ અહેવાલ સુરક્ષા કે છેતરપિંડી સાબિત કરી શકતો નથી.",
  ],
  "Submitted sites were not opened or crawled. Reputation checks omit query strings, fragments and credentials.":
    [
      "वेबसाइट खोली या क्रॉल नहीं की गई। प्रतिष्ठा जाँच में क्वेरी, फ़्रैगमेंट और क्रेडेंशियल नहीं भेजे गए।",
      "વેબસાઇટ ખોલી કે ક્રૉલ કરી નથી. પ્રતિષ્ઠા તપાસમાં ક્વેરી, ફ્રેગમેન્ટ અને ઓળખ માહિતી મોકલેલ નથી.",
    ],
  "No employer records, reviews, ownership or registration databases were checked.":
    [
      "नियोक्ता रिकॉर्ड, समीक्षाएँ, स्वामित्व या पंजीकरण डेटाबेस नहीं जाँचे गए।",
      "નોકરીદાતા રેકોર્ડ, સમીક્ષાઓ, માલિકી કે નોંધણી ડેટાબેસ તપાસ્યા નથી.",
    ],
  "Anonymous reports are held in this tab only and are not saved by ScamVeto.":
    [
      "अनाम रिपोर्ट केवल इस टैब में रहती है; ScamVeto इसे सहेजता नहीं।",
      "અનામી અહેવાલ માત્ર આ ટૅબમાં રહે છે; ScamVeto તેને સાચવતું નથી.",
    ],
};
export function reportText(text: string, locale: Locale) {
  return locale === "en"
    ? text
    : (staticStrings[text]?.[locale === "hi" ? 0 : 1] ?? text);
}
export function localizeReport(report: Report): Report {
  const locale = report.locale;
  const evidence = report.evidence.map((e) => localizeEvidence(e, locale));
  return {
    ...report,
    summary: summaries[locale][report.outcome],
    evidence,
    checks: report.checks.map((c) => ({
      ...c,
      name: reportText(c.name, locale),
      detail: reportText(c.detail, locale),
    })),
    actions: report.actions.map((a) => {
      const index = report.evidence.findIndex((e) => e.action === a);
      return index >= 0 ? evidence[index].action : reportText(a, locale);
    }),
    limitations: report.limitations.map((a) => reportText(a, locale)),
  };
}
