/**
 * WebAuthn integration checklist, expressed as a type so implementations have
 * explicit inputs instead of reaching into global request state.
 */
export type PasskeyVerificationContext = {
  expectedRpId: string;
  expectedOrigin: string;
  challenge: string;
  challengeExpiresAt: number;
  requireUserVerification: true;
};

export function assertPasskeyContext(context: PasskeyVerificationContext, now = Date.now()): void {
  if (!context.expectedRpId) throw new Error("expected RP ID required");
  if (!context.expectedOrigin.startsWith("https://")) throw new Error("HTTPS WebAuthn origin required");
  if (!context.challenge) throw new Error("challenge required");
  if (now >= context.challengeExpiresAt) throw new Error("challenge expired");
  if (context.requireUserVerification !== true) throw new Error("user verification must be required");
}
