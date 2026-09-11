export default function OutcomeTable({ outcomes, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto border border-slate-200 bg-white">
      <table className="w-full min-w-[620px] border-collapse text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="w-28 px-5 py-3 font-semibold">Code</th>
            <th className="px-5 py-3 font-semibold">Description</th>
            <th className="w-44 px-5 py-3 text-right font-semibold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {outcomes.map((outcome) => (
            <tr className="hover:bg-slate-50" key={outcome.code}>
              <td className="px-5 py-4 font-mono text-xs font-semibold text-slate-700">
                {outcome.code}
              </td>
              <td className="px-5 py-4 text-slate-700">{outcome.description}</td>
              <td className="px-5 py-4 text-right">
                <button className="mr-4 text-sm font-medium text-slate-600 hover:text-slate-950" onClick={() => onEdit(outcome)} type="button">
                  Edit
                </button>
                <button className="text-sm font-medium text-red-700 hover:text-red-900" onClick={() => onDelete(outcome)} type="button">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
