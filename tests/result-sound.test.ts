// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { ResultSound, resultTone } from "@/lib/result-sound";
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
describe("result sound", () => {
  it("never uses the completion signal for suspicious, unknown or unavailable outcomes", () => {
    expect(resultTone("NO_KNOWN_THREAT_FOUND")).toBe("complete");
    expect(resultTone("SUSPICIOUS_INDICATORS")).toBe("warning");
    expect(resultTone("KNOWN_MALICIOUS")).toBe("danger");
    expect(resultTone("INSUFFICIENT_EVIDENCE")).toBe("neutral");
    expect(resultTone("ANALYSIS_UNAVAILABLE")).toBe("neutral");
  });
  it("remains optional when Web Audio is unsupported", async () => {
    vi.stubGlobal("AudioContext", undefined);
    const sound = new ResultSound();
    await expect(sound.prepare()).resolves.toBeUndefined();
    expect(() => sound.play("SUSPICIOUS_INDICATORS")).not.toThrow();
    sound.dispose();
  });
  it("bounds gain and duration and closes the context on disposal", async () => {
    vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    const stops: number[] = [];
    const peaks: number[] = [];
    const close = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal(
      "AudioContext",
      class {
        state = "running";
        currentTime = 0;
        destination = {};
        close = close;
        createGain() {
          return {
            gain: {
              setValueAtTime() {},
              linearRampToValueAtTime(v: number) {
                peaks.push(v);
              },
              exponentialRampToValueAtTime() {},
            },
            connect() {},
            disconnect() {},
          };
        }
        createOscillator() {
          return {
            frequency: { value: 0 },
            onended: null,
            type: "sine",
            connect() {},
            disconnect() {},
            start() {},
            stop(at?: number) {
              if (at !== undefined) stops.push(at);
            },
          };
        }
      },
    );
    const sound = new ResultSound();
    await sound.prepare();
    sound.play("KNOWN_MALICIOUS");
    expect(stops).toHaveLength(3);
    expect(Math.max(...stops)).toBeLessThan(0.5);
    expect(Math.max(...peaks)).toBeLessThan(0.04);
    sound.dispose();
    expect(close).toHaveBeenCalledOnce();
  });
});
