// Local-only identity gate: simulates "one human, one identity" + kid/adult mode

const LOCAL_KEY = 'cleanRoom.identity';

export function getCurrentIdentity() {
  const raw = localStorage.getItem(LOCAL_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setIdentity({ displayName, mode }) {
  const deviceId = getOrCreateDeviceId();
  const identity = { displayName, mode, deviceId };
  localStorage.setItem(LOCAL_KEY, JSON.stringify(identity));
  return identity;
}

function getOrCreateDeviceId() {
  const key = 'cleanRoom.deviceId';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}
