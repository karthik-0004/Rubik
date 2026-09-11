export default function ScoreTable({ students, outcomes }) {
  return (
    <div className="overflow-x-auto border border-slate-200 bg-white">
      <table className="w-full min-w-[780px] border-collapse text-left text-sm">
        <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="sticky left-0 z-20 min-w-56 border-r border-slate-200 bg-slate-50 px-5 py-3 font-semibold">
              Student
            </th>
            {outcomes.map((outcome) => (
              <th className="min-w-28 px-3 py-3 text-center font-semibold" key={outcome.code}>
                {outcome.code}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.map((student) => (
            <tr className="hover:bg-slate-50" key={student.rollNumber}>
              <th className="sticky left-0 z-[1] border-r border-slate-200 bg-white px-5 py-3 text-left font-medium text-slate-800">
                <span className="block">{student.name}</span>
                <span className="mt-1 block font-mono text-[11px] font-normal text-slate-500">
                  {student.rollNumber}
                </span>
              </th>
              {outcomes.map((outcome) => (
                <td className="px-3 py-2 text-center" key={`${student.rollNumber}-${outcome.code}`}>
                  <input
                    aria-label={`${student.name} ${outcome.code} score`}
                    className="h-9 w-20 border border-slate-300 bg-white px-2 text-center text-sm text-slate-800 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                    defaultValue={student.scores[outcome.code]}
                    inputMode="decimal"
                    min="0"
                    type="number"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
