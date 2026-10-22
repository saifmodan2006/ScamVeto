import type { Locale, Outcome } from "@/lib/validation/schemas";
export const linkResultCopy = {
  en: {
    sound: "Play a short result sound",
    soundHelp:
      "A brief tone when your link check finishes. You can turn it off.",
    close: "Close result",
    details: "View full report",
    another: "Check another link",
    label: "LINK CHECK RESULT",
    caution:
      "Verify important requests independently. New or unlisted threats can be missed.",
    incomplete: "Some checks could not finish. This is a limited review.",
    titles: {
      KNOWN_MALICIOUS: "Known threat detected",
      SUSPICIOUS_INDICATORS: "This link needs caution",
      NO_KNOWN_THREAT_FOUND: "Check complete",
      INSUFFICIENT_EVIDENCE: "More verification needed",
      ANALYSIS_UNAVAILABLE: "Check incomplete",
    },
    bodies: {
      KNOWN_MALICIOUS:
        "Avoid this link. A threat list flagged this destination.",
      SUSPICIOUS_INDICATORS:
        "Suspicious indicators were found. Review the evidence before continuing.",
      NO_KNOWN_THREAT_FOUND:
        "Available checks found no known threat. This is not a guarantee of safety.",
      INSUFFICIENT_EVIDENCE:
        "There is not enough information to reach a reliable conclusion about this link.",
      ANALYSIS_UNAVAILABLE:
        "The analysis could not finish. Try again before relying on this link.",
    },
  },
  hi: {
    sound: "परिणाम आने पर छोटी ध्वनि बजाएँ",
    soundHelp:
      "लिंक की जाँच पूरी होने पर छोटी ध्वनि बजेगी। आप इसे बंद कर सकते हैं।",
    close: "परिणाम बंद करें",
    details: "पूरी रिपोर्ट देखें",
    another: "दूसरा लिंक जाँचें",
    label: "लिंक जाँच का परिणाम",
    caution:
      "महत्वपूर्ण अनुरोधों का स्वतंत्र सत्यापन करें। नए या सूची में न आए खतरे छूट सकते हैं।",
    incomplete: "कुछ जाँच पूरी नहीं हुईं। यह सीमित समीक्षा है।",
    titles: {
      KNOWN_MALICIOUS: "ज्ञात खतरा मिला",
      SUSPICIOUS_INDICATORS: "इस लिंक के लिए सावधानी रखें",
      NO_KNOWN_THREAT_FOUND: "जाँच पूरी हुई",
      INSUFFICIENT_EVIDENCE: "और सत्यापन आवश्यक है",
      ANALYSIS_UNAVAILABLE: "जाँच अधूरी है",
    },
    bodies: {
      KNOWN_MALICIOUS: "इस लिंक से बचें। खतरा सूची में यह गंतव्य मिला है।",
      SUSPICIOUS_INDICATORS:
        "संदिग्ध संकेत मिले। आगे बढ़ने से पहले प्रमाण देखें।",
      NO_KNOWN_THREAT_FOUND:
        "उपलब्ध जाँच में ज्ञात खतरा नहीं मिला। यह सुरक्षा की गारंटी नहीं है।",
      INSUFFICIENT_EVIDENCE:
        "इस लिंक के बारे में विश्वसनीय निष्कर्ष के लिए पर्याप्त जानकारी नहीं है।",
      ANALYSIS_UNAVAILABLE:
        "विश्लेषण पूरा नहीं हुआ। इस लिंक पर भरोसा करने से पहले फिर कोशिश करें।",
    },
  },
  gu: {
    sound: "પરિણામ આવે ત્યારે ટૂંકો અવાજ વગાડો",
    soundHelp:
      "લિંકની તપાસ પૂર્ણ થાય ત્યારે ટૂંકો અવાજ વાગશે. તમે તેને બંધ કરી શકો છો.",
    close: "પરિણામ બંધ કરો",
    details: "સંપૂર્ણ અહેવાલ જુઓ",
    another: "બીજી લિંક તપાસો",
    label: "લિંક તપાસનું પરિણામ",
    caution:
      "મહત્વપૂર્ણ વિનંતીઓની સ્વતંત્ર ચકાસણી કરો. નવા કે સૂચિમાં ન આવેલા જોખમો ચૂકી શકાય છે.",
    incomplete: "કેટલીક તપાસ પૂર્ણ થઈ નથી. આ મર્યાદિત સમીક્ષા છે.",
    titles: {
      KNOWN_MALICIOUS: "જાણીતું જોખમ મળ્યું",
      SUSPICIOUS_INDICATORS: "આ લિંક માટે સાવચેતી રાખો",
      NO_KNOWN_THREAT_FOUND: "તપાસ પૂર્ણ થઈ",
      INSUFFICIENT_EVIDENCE: "વધુ ચકાસણી જરૂરી છે",
      ANALYSIS_UNAVAILABLE: "તપાસ અધૂરી છે",
    },
    bodies: {
      KNOWN_MALICIOUS: "આ લિંકથી દૂર રહો. જોખમ સૂચિમાં આ ગંતવ્ય મળ્યું છે.",
      SUSPICIOUS_INDICATORS:
        "શંકાસ્પદ સંકેતો મળ્યા. આગળ વધતાં પહેલાં પુરાવા જુઓ.",
      NO_KNOWN_THREAT_FOUND:
        "ઉપલબ્ધ તપાસમાં જાણીતું જોખમ મળ્યું નથી. આ સુરક્ષાની ખાતરી નથી.",
      INSUFFICIENT_EVIDENCE:
        "આ લિંક વિશે વિશ્વસનીય નિષ્કર્ષ માટે પૂરતી માહિતી નથી.",
      ANALYSIS_UNAVAILABLE:
        "વિશ્લેષણ પૂર્ણ થયું નથી. આ લિંક પર વિશ્વાસ કરતાં પહેલાં ફરી પ્રયાસ કરો.",
    },
  },
} satisfies Record<
  Locale,
  {
    sound: string;
    soundHelp: string;
    close: string;
    details: string;
    another: string;
    label: string;
    caution: string;
    incomplete: string;
    titles: Record<Outcome, string>;
    bodies: Record<Outcome, string>;
  }
>;
