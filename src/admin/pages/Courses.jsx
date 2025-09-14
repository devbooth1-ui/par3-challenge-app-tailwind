import { courses } from "../lib/data";

export default function Courses() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Courses</h2>
      <ul className="space-y-2">
        {courses.map(c => (
          <li key={c.id} className="border p-2 rounded bg-white">
            <span className="font-semibold">{c.name}</span> – {c.holes} holes – {c.location}
          </li>
        ))}
      </ul>
    </div>
  );
}
