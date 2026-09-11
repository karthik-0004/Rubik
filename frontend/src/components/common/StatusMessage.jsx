export function LoadingState({ label = "Loading..." }) {
  return (
    <div className="border border-slate-200 bg-white px-5 py-8 text-sm text-slate-600">
      {label}
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
    </div>
  );
}

export function ErrorState({ message = "Unable to load data. Please try again." }) {
  return (
    <div className="border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
      {message}
    </div>
  );
}
