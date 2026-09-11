export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex min-h-16 items-center justify-between px-6 py-4 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Faculty workspace
            </p>
            <h1 className="text-lg font-semibold">CO Attainment Calculator</h1>
          </div>
          <span className="text-sm text-slate-500">Foundation</span>
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white p-5 md:block">
          <nav aria-label="Primary navigation" className="space-y-1 text-sm">
            <span className="block border-l-2 border-slate-900 px-3 py-2 font-medium">
              Overview
            </span>
            <span className="block px-3 py-2 text-slate-500">Courses</span>
            <span className="block px-3 py-2 text-slate-500">Students</span>
            <span className="block px-3 py-2 text-slate-500">Attainment</span>
          </nav>
        </aside>
        <main className="min-w-0 flex-1 px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
