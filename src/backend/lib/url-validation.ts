const BLOCKED_HOSTNAMES = [
  "localhost",
  "0.0.0.0",
  "127.0.0.1",
  "[::1]",
  "metadata.google.internal",
];

const PRIVATE_IP_RANGES = [
  /^127\./,                    // 127.0.0.0/8
  /^10\./,                     // 10.0.0.0/8
  /^172\.(1[6-9]|2\d|3[01])\./, // 172.16.0.0/12
  /^192\.168\./,               // 192.168.0.0/16
  /^169\.254\./,               // 169.254.0.0/16 (link-local / cloud metadata)
  /^0\./,                      // 0.0.0.0/8
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, // 100.64.0.0/10 (CGNAT)
];

export function validateUrl(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return "Invalid URL.";
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return "URL must use http or https protocol.";
  }

  const hostname = parsed.hostname.toLowerCase();

  if (BLOCKED_HOSTNAMES.includes(hostname)) {
    return "URLs pointing to local or internal addresses are not allowed.";
  }

  // Check if hostname is a private IP
  for (const pattern of PRIVATE_IP_RANGES) {
    if (pattern.test(hostname)) {
      return "URLs pointing to private or internal IP addresses are not allowed.";
    }
  }

  return null;
}
