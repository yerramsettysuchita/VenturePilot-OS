const requests = new Map<string, number[]>();

export function rateLimit(
  ip: string,
  limit: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;

  const requestTimes = requests.get(ip) || [];
  const recentRequests = requestTimes.filter((t) => t > windowStart);

  if (recentRequests.length >= limit) return false;

  recentRequests.push(now);
  requests.set(ip, recentRequests);
  return true;
}
