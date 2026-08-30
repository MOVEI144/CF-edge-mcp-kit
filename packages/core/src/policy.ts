export type PolicyAction = "deny" | "ask" | "allow";
export type PolicyRule = { action: PolicyAction; tool?: string | RegExp; subject?: string; oauthClientId?: string; deviceId?: string; };
export type PolicyContext = { tool: string; subject: string; oauthClientId: string; deviceId: string; };
const rank: Record<PolicyAction, number> = { allow: 1, ask: 2, deny: 3 };
function matches(rule: PolicyRule, context: PolicyContext): boolean { if (rule.subject && rule.subject !== context.subject) return false; if (rule.oauthClientId && rule.oauthClientId !== context.oauthClientId) return false; if (rule.deviceId && rule.deviceId !== context.deviceId) return false; if (typeof rule.tool === "string" && rule.tool !== context.tool) return false; if (rule.tool instanceof RegExp && !rule.tool.test(context.tool)) return false; return true; }
export function evaluatePolicy(rules: PolicyRule[], context: PolicyContext): PolicyAction { const actions = rules.filter((rule) => matches(rule, context)).map((rule) => rule.action); if (actions.length === 0) return "deny"; return actions.reduce((current, candidate) => (rank[candidate] > rank[current] ? candidate : current)); }
