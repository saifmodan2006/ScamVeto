import type { Outcome } from "@/lib/validation/schemas";
export function resultTone(outcome: Outcome) {
  if (outcome === "KNOWN_MALICIOUS") return "danger";
  if (outcome === "SUSPICIOUS_INDICATORS") return "warning";
  if (outcome === "NO_KNOWN_THREAT_FOUND") return "complete";
  return "neutral";
}
// One quiet, finite signal per completed user-initiated request; no external audio assets.
export class ResultSound {
  private context: AudioContext | undefined;
  private oscillators = new Set<OscillatorNode>();
  async prepare() {
    try {
      if (typeof window === "undefined" || !window.AudioContext) return;
      this.context ??= new window.AudioContext();
      if (this.context.state === "suspended") await this.context.resume();
    } catch {
      /* Audio is optional; the visual result remains available. */
    }
  }
  play(outcome: Outcome) {
    const context = this.context;
    if (!context || context.state !== "running" || document.hidden) return;
    this.stop();
    const tone = resultTone(outcome);
    const notes =
      tone === "complete"
        ? [520, 660]
        : tone === "warning"
          ? [440, 330]
          : tone === "danger"
            ? [330, 260, 220]
            : [390];
    try {
      notes.forEach((frequency, index) => {
        const oscillator = context.createOscillator(),
          gain = context.createGain();
        const start = context.currentTime + index * 0.15;
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.035, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.13);
        oscillator.connect(gain);
        gain.connect(context.destination);
        this.oscillators.add(oscillator);
        oscillator.onended = () => {
          oscillator.disconnect();
          gain.disconnect();
          this.oscillators.delete(oscillator);
        };
        oscillator.start(start);
        oscillator.stop(start + 0.14);
      });
    } catch {
      this.stop();
    }
  }
  stop() {
    for (const oscillator of this.oscillators) {
      try {
        oscillator.stop();
      } catch {
        /* Already stopped. */
      }
    }
    this.oscillators.clear();
  }
  dispose() {
    this.stop();
    void this.context?.close().catch(() => {});
    this.context = undefined;
  }
}
