export default function CoursesTable({ courses, onOpenCourse, onEditCourse, onDeleteCourse }) {
  return (
    <div className="overflow-x-auto border border-slate-200 bg-white">
      <table className="w-full min-w-170 border-collapse text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-3 font-semibold">Course</th>
            <th className="px-5 py-3 font-semibold">Code</th>
            <th className="px-5 py-3 text-center font-semibold">COs</th>
            <th className="px-5 py-3 text-center font-semibold">Students</th>
            <th className="px-5 py-3 text-right font-semibold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {courses.map((course) => (
            <tr className="hover:bg-slate-50" key={course.id}>
              <td className="px-5 py-4 font-medium text-slate-900">{course.name}</td>
              <td className="px-5 py-4 font-mono text-xs text-slate-600">{course.code}</td>
              <td className="px-5 py-4 text-center text-slate-600">{course.outcomes}</td>
              <td className="px-5 py-4 text-center text-slate-600">{course.students}</td>
              <td className="px-5 py-4 text-right">
                <button
                  className="font-medium text-teal-700 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
                  onClick={() => onOpenCourse(course)}
                  type="button"
                >
                  Open course
                </button>
                <button className="ml-4 text-sm font-medium text-slate-600 hover:text-slate-950" onClick={() => onEditCourse(course)} type="button">
                  Edit
                </button>
                <button className="ml-4 text-sm font-medium text-red-700 hover:text-red-900" onClick={() => onDeleteCourse(course)} type="button">
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
