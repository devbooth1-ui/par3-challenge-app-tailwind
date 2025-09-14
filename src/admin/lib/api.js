import { ensureSeed, load, save } from "./store";
import { seed } from "./data";

ensureSeed(seed);
const uid = () => Math.random().toString(36).slice(2, 9);

// Courses
export function getCourses(){ return load().courses; }
export function addCourse(course){
  const db = load();
  const c = {
    id: uid(),
    name: course.name.trim(),
    city: (course.city||"").trim(),
    state: (course.state||"").trim().toUpperCase(),
    par3Holes: Array.isArray(course.par3Holes) ? course.par3Holes : [],
    prizes: { birdie: 65, ace: 1000, ...(course.prizes||{}) },
  };
  db.courses.push(c); save(db); return c;
}
export function deleteCourse(id){ const db = load(); db.courses = db.courses.filter(x=>x.id!==id); save(db); }

// Claims (Awards)
export function getClaims(status){ 
  const db = load(); 
  return status ? db.claims.filter(c=>c.status===status) : db.claims;
}
export function setClaimStatus(id, status){
  const db = load();
  const c = db.claims.find(x=>x.id===id);
  if (c) { c.status = status; save(db); }
  return c;
}
export function addClaim(partial){
  const db = load();
  const amount = partial.result==="ace" ? 1000 : 65;
  const c = { id: uid(), amount, status: "pending", submittedAt: new Date().toISOString(), ...partial };
  db.claims.push(c); save(db); return c;
}
export function deleteClaim(id){ const db = load(); db.claims = db.claims.filter(c=>c.id!==id); save(db); }

// Financials
export function getFinancials(){
  const db = load();
  const byId = Object.fromEntries(db.courses.map(c=>[c.id, c]));
  const agg = {};
  for (const c of db.claims){
    const key = c.courseId;
    if (!agg[key]) agg[key] = { 
      courseId: key,
      courseName: byId[key]?.name || "Unknown Course",
      approved: 0, paid: 0, pending: 0, rejected: 0, outstanding: 0, total: 0
    };
    const a = agg[key];
    a.total += c.amount;
    a[c.status] !== undefined && (a[c.status] += c.amount);
  }
  for (const k of Object.keys(agg)){ agg[k].outstanding = (agg[k].approved + agg[k].pending) - agg[k].paid; }
  return Object.values(agg);
}
