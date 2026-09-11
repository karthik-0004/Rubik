export default function AppShell({ activePage, children, onNavigate }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex min-h-16 items-center justify-between px-5 py-4 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Faculty workspace</p>
            <h1 className="mt-1 text-lg font-semibold tracking-tight">CO Attainment Calculator</h1>
          </div>
          <span className="hidden text-sm text-slate-500 sm:block">Academic management</span>
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
        <aside className="w-full shrink-0 border-b border-slate-200 bg-white md:w-56 md:border-b-0 md:border-r lg:w-60">
          <nav aria-label="Primary navigation" className="flex gap-1 overflow-x-auto p-3 md:block md:space-y-1 md:p-5">
            <button
              className={`whitespace-nowrap border-b-2 px-3 py-2 text-left text-sm font-medium md:block md:w-full md:border-b-0 md:border-l-2 ${
                activePage === "courses" || activePage === "course-details"
                  ? "border-teal-700 text-slate-950 md:bg-slate-50"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
              onClick={onNavigate}
              type="button"
            >
              Courses
            </button>
          </nav>
        </aside>
        <main className="min-w-0 flex-1 px-5 py-7 lg:px-10 lg:py-9">{children}</main>
      </div>
    </div>
  );
}
