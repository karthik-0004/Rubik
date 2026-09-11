export default function AttainmentPanel({ outcomes }) {
  return (
    <section aria-labelledby="attainment-heading" className="border border-slate-200 bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900" id="attainment-heading">
            CO attainment
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Results will be calculated from the backend for the selected threshold.
          </p>
        </div>
        <label className="flex items-center gap-3 text-sm text-slate-700">
          <span>Threshold</span>
          <input
            className="h-9 w-20 border border-slate-300 px-2 text-center outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
            defaultValue="50"
            min="0"
            type="number"
          />
          <span className="text-slate-500">marks</span>
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Outcome</th>
              <th className="px-5 py-3 font-semibold">Description</th>
              <th className="px-5 py-3 text-right font-semibold">Attainment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {outcomes.map((outcome) => (
              <tr key={outcome.code}>
                <td className="px-5 py-4 font-mono text-xs font-semibold text-slate-700">{outcome.code}</td>
                <td className="px-5 py-4 text-slate-700">{outcome.description}</td>
                <td className="px-5 py-4 text-right text-slate-500">Not calculated</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
