// Lineage: device + timestamp + simple signature

export function createLineage(deviceId, text) {
  const timestamp = new Date().toISOString();
  const signature = simpleSignature(deviceId, timestamp, text);
  return { deviceId, timestamp, signature };
}

// NOT cryptographically secure — just a placeholder for the prototype
function simpleSignature(deviceId, timestamp, text) {
  const base = `${deviceId}|${timestamp}|${text}`;
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash * 31 + base.charCodeAt(i)) >>> 0;
  }
  return hash.toString(16);
}
