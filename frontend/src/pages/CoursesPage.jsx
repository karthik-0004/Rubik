import { useEffect, useState } from "react";

import { api } from "../services/api";
import { ErrorState, EmptyState, LoadingState } from "../components/common/StatusMessage";
import PageHeader from "../components/common/PageHeader";
import CoursesTable from "../components/courses/CoursesTable";

export default function CoursesPage({ onOpenCourse }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadCourses() {
    setLoading(true);
    setError("");
    try {
      const rawCourses = await api.getCourses();
      const enriched = await Promise.all(rawCourses.map(async (course) => {
        const [outcomes, students] = await Promise.all([
          api.getCourseOutcomes(course.id),
          api.getCourseStudents(course.id),
        ]);
        return { ...course, outcomes: outcomes.length, students: students.length };
      }));
      setCourses(enriched);
    } catch (loadError) {
      setError(loadError.message || "Unable to load courses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCourses(); }, []);

  function openCreateForm() {
    setForm({ id: null, name: "", code: "" });
    setFormError("");
  }

  function openEditForm(course) {
    setForm({ id: course.id, name: course.name, code: course.code });
    setFormError("");
  }

  async function saveCourse(event) {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (form.id) await api.updateCourse(form.id, { name: form.name.trim(), code: form.code.trim() });
      else await api.createCourse({ name: form.name.trim(), code: form.code.trim() });
      setForm(null);
      await loadCourses();
    } catch (saveError) {
      setFormError(saveError.message || "Unable to save course.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCourse(course) {
    if (!window.confirm(`Delete ${course.name}? Its outcomes, students, and scores will also be removed.`)) return;
    try {
      await api.deleteCourse(course.id);
      await loadCourses();
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete course.");
    }
  }

  return (
    <div className="space-y-7">
      <PageHeader
        action={
          <button className="border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2" onClick={openCreateForm} type="button">
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
          <p className="text-xs text-slate-500">{courses.length} courses</p>
        </div>
        {loading ? <LoadingState label="Loading courses..." /> : error ? <ErrorState message={error} /> : courses.length === 0 ? <EmptyState title="No courses available." description="Add a course to begin managing outcomes and scores." /> : <CoursesTable courses={courses} onDeleteCourse={deleteCourse} onEditCourse={openEditForm} onOpenCourse={onOpenCourse} />}
      </section>
      {form ? (
        <div className="border border-slate-200 bg-white p-5">
          <h3 className="text-base font-semibold text-slate-900">{form.id ? "Edit course" : "Add course"}</h3>
          <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={saveCourse}>
            <label className="text-sm font-medium text-slate-700">Course name<input className="mt-2 h-10 w-full border border-slate-300 px-3 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100" onChange={(event) => setForm({ ...form, name: event.target.value })} required value={form.name} /></label>
            <label className="text-sm font-medium text-slate-700">Course code<input className="mt-2 h-10 w-full border border-slate-300 px-3 font-normal uppercase outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100" onChange={(event) => setForm({ ...form, code: event.target.value })} required value={form.code} /></label>
            <div className="sm:col-span-2">{formError ? <p className="mb-3 text-sm text-red-700">{formError}</p> : null}<button className="border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setForm(null)} type="button">Cancel</button><button className="ml-3 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50" disabled={saving} type="submit">{saving ? "Saving..." : "Save course"}</button></div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
