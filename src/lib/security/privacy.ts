export class PrivacyRedactionService {
  static redact(text: string): string {
    return text
      .normalize("NFKC")
      .replace(
        /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
        "[email redacted]",
      )
      .replace(/\b(?:\d[ -]?){12,19}\b/g, "[number redacted]")
      .replace(/\b(?:\+?\d[ .()-]?){10,11}\b/g, "[phone redacted]")
      .replace(
        /((?:otp|one.time.password|verification code|pin|password|passcode|cvv|पासवर्ड|ઓટીપી|ओटीपी)\s*(?:is|:|=|है)?\s*)[\w!@#$%^&*.-]{3,}/gi,
        "$1[secret redacted]",
      )
      .replace(/\b\d{4,8}\b/g, "[digits redacted]")
      .replace(
        /([?&](?:token|key|password|secret|code|auth|email|phone|session|access_token)=)[^&#\s]*/gi,
        "$1[redacted]",
      )
      .replace(
        /(https?:\/\/)[^\s/@]+:[^\s/@]+@/gi,
        "$1[credentials redacted]@",
      );
  }
  static providerUrl(raw: string): string {
    const u = new URL(raw);
    u.username = "";
    u.password = "";
    u.hash = "";
    u.search = "";
    return u.toString();
  }
}
