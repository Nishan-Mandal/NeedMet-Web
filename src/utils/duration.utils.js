/**
 * Utility functions for robust duration formatting and normalization
 * Prevents "0 Days" bugs and cleanly formats duration strings across the application.
 */

/**
 * Checks if a string or value represents a zero or empty duration.
 */
export function isZeroOrEmptyDuration(val) {
  if (val === null || val === undefined) return true;
  const str = String(val).trim();
  if (!str || str === "0") return true;
  return /^\s*0\s*(days?|months?|d|m)?\s*$/i.test(str);
}

/**
 * Returns a human-friendly duration text (e.g. "1 Month", "3 Months", "6 Months", "12 Months", "45 Days").
 * Guaranteed to NEVER return "0 Days".
 */
export function formatPlanDuration(plan) {
  if (!plan) return "1 Month";

  const rawDuration = typeof plan.duration === "string" ? plan.duration.trim() : "";
  const rawPlanType = typeof plan.planType === "string" ? plan.planType.trim() : "";
  const rawName = typeof plan.name === "string" ? plan.name.trim() : "";
  const days = Number(plan.durationDays) || 0;

  // 1. If plan.duration is a valid non-zero duration string (e.g. "3 Months", "6 Months", "45 Days")
  if (rawDuration && !isZeroOrEmptyDuration(rawDuration)) {
    return rawDuration;
  }

  // 2. Try to derive from planType if it's not zero or generic "Custom"
  if (rawPlanType && !isZeroOrEmptyDuration(rawPlanType) && rawPlanType.toLowerCase() !== "custom") {
    return rawPlanType;
  }

  // 3. Try to infer from plan.name (e.g. "Starter-3M", "Growth-6M", "Scale-12M", "Standard-1M")
  if (rawName) {
    if (/(?:^|\b|-|_|\s)12\s*m(?:onths?)?(?:\b|$)/i.test(rawName) || /1\s*year/i.test(rawName)) return "12 Months";
    if (/(?:^|\b|-|_|\s)6\s*m(?:onths?)?(?:\b|$)/i.test(rawName)) return "6 Months";
    if (/(?:^|\b|-|_|\s)3\s*m(?:onths?)?(?:\b|$)/i.test(rawName)) return "3 Months";
    if (/(?:^|\b|-|_|\s)1\s*m(?:onths?)?(?:\b|$)/i.test(rawName)) return "1 Month";
    const daysMatch = rawName.match(/(\d+)\s*days?/i);
    if (daysMatch && Number(daysMatch[1]) > 0) {
      const d = Number(daysMatch[1]);
      if (d >= 360) return "12 Months";
      if (d >= 170 && d <= 200) return "6 Months";
      if (d >= 80 && d <= 100) return "3 Months";
      if (d >= 28 && d <= 35) return "1 Month";
      return `${d} Days`;
    }
  }

  // 4. Try to derive from durationDays if > 0
  if (days > 0) {
    if (days >= 360) return "12 Months";
    if (days >= 170 && days <= 200) return "6 Months";
    if (days >= 80 && days <= 100) return "3 Months";
    if (days >= 28 && days <= 35) return "1 Month";
    return `${days} Days`;
  }

  // 5. Fallback: If rawName doesn't contain "0 Days", use rawName or default to "1 Month"
  if (rawName && !isZeroOrEmptyDuration(rawName) && !rawName.toLowerCase().includes("0 day")) {
    return rawName;
  }

  return "1 Month";
}

/**
 * Returns a valid positive integer for duration in days (minimum 1, default 30).
 */
export function getSafeDurationDays(plan) {
  if (!plan) return 30;
  const days = Number(plan.durationDays);
  if (days && days > 0) return days;

  // Infer days from duration, planType, or name
  const dur = (plan.duration || plan.planType || plan.name || "").toLowerCase();
  if (dur.includes("12 month") || dur.includes("1 year") || /(?:^|\b|-|_|\s)12m(?:\b|$)/i.test(dur)) return 365;
  if (dur.includes("6 month") || /(?:^|\b|-|_|\s)6m(?:\b|$)/i.test(dur)) return 184;
  if (dur.includes("3 month") || /(?:^|\b|-|_|\s)3m(?:\b|$)/i.test(dur)) return 92;
  if (dur.includes("2 month") || /(?:^|\b|-|_|\s)2m(?:\b|$)/i.test(dur)) return 60;
  if (dur.includes("1 month") || /(?:^|\b|-|_|\s)1m(?:\b|$)/i.test(dur)) return 30;

  const match = dur.match(/(\d+)\s*day/);
  if (match && Number(match[1]) > 0) return Number(match[1]);

  return 30;
}

/**
 * Returns a clean, user-friendly title for the plan tier.
 */
export function formatPlanTitle(plan) {
  if (!plan) return "Standard Plan";
  const name = (plan.name || "").trim();
  if (name && !/^\s*0\s*(days?|months?|d|m)?\s*(plan)?\s*$/i.test(name)) {
    return name;
  }
  return `${formatPlanDuration(plan)} Plan`;
}

/**
 * Sanitizes a plan variant object to ensure clean, non-zero duration and durationDays fields.
 */
export function sanitizePlanVariant(v = {}, defaultName = "Option") {
  const safeDuration = formatPlanDuration(v);
  const safeDays = getSafeDurationDays(v);
  const rawName = (v.name || "").trim();
  const safeName = rawName && !/^\s*0\s*(days?|months?|d|m)?\s*(plan)?\s*$/i.test(rawName)
    ? rawName
    : (defaultName ? `${defaultName} (${safeDuration})` : `${safeDuration} Plan`);

  const rawPlanType = (v.planType || "").trim();
  const safePlanType = rawPlanType && !isZeroOrEmptyDuration(rawPlanType)
    ? rawPlanType
    : safeDuration;

  return {
    ...v,
    name: safeName,
    duration: safeDuration,
    durationDays: safeDays,
    planType: safePlanType,
  };
}

