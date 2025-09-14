import React from "react";
import { players } from "../lib/data";

export default function Players() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Players</h2>
      <table className="w-full border bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Score</th>
            <th className="p-2 border">Reward</th>
          </tr>
        </thead>
        <tbody>
          {players.map(p => (
            <tr key={p.id}>
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.score}</td>
              <td className="p-2 border">{p.reward}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
