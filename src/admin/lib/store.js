const KEY = "par3-admin-db";
export function load(){ try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; } }
export function save(data){ localStorage.setItem(KEY, JSON.stringify(data)); }
export function ensureSeed(seed){
  const db = load();
  if (!db) { save(seed); return seed; }
  // simple forward-compat: ensure new arrays exist
  if (!Array.isArray(db.claims)) db.claims = [];
  if (!Array.isArray(db.courses)) db.courses = [];
  save(db);
  return db;
}
