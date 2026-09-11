import PageHeader from "../components/common/PageHeader";
import CoursesTable from "../components/courses/CoursesTable";

const previewCourses = [
  { id: 1, name: "Database Management Systems", code: "CS301", outcomes: 4, students: 20 },
  { id: 2, name: "Operating Systems", code: "CS302", outcomes: 4, students: 20 },
  { id: 3, name: "Computer Networks", code: "CS303", outcomes: 4, students: 20 },
];

export default function CoursesPage({ onOpenCourse }) {
  return (
    <div className="space-y-7">
      <PageHeader
        action={
          <button className="border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2" type="button">
            Add course
          </button>
        }
        description="View courses and open a course workspace for outcomes, students, scores, and attainment."
        eyebrow="Academic management"
        title="Courses"
      />
      <section aria-labelledby="course-list-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900" id="course-list-heading">
            Course register
          </h3>
          <p className="text-xs text-slate-500">3 courses</p>
        </div>
        <CoursesTable courses={previewCourses} onOpenCourse={onOpenCourse} />
      </section>
    </div>
  );
}
