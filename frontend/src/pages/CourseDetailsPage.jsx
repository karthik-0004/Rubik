import { useEffect, useMemo, useState } from "react";

import AttainmentPanel from "../components/attainment/AttainmentPanel";
import { EmptyState, ErrorState, LoadingState } from "../components/common/StatusMessage";
import OutcomeTable from "../components/outcomes/OutcomeTable";
import ScoreTable from "../components/scores/ScoreTable";
import { api } from "../services/api";

const sections = ["Course outcomes", "Students & scores", "Attainment"];

export default function CourseDetailsPage({ course, onBack }) {
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [outcomes, setOutcomes] = useState([]);
  const [students, setStudents] = useState([]);
  const [scoreValues, setScoreValues] = useState({});
  const [savedScores, setSavedScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [operationError, setOperationError] = useState("");
  const [outcomeForm, setOutcomeForm] = useState(null);
  const [studentForm, setStudentForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [attainment, setAttainment] = useState({});
  const [attainmentLoading, setAttainmentLoading] = useState(false);

  async function loadWorkspace() {
    setLoading(true);
    setError("");
    try {
      const [loadedOutcomes, loadedStudents] = await Promise.all([
        api.getCourseOutcomes(course.id),
        api.getCourseStudents(course.id),
      ]);
      const scoreLists = await Promise.all(
        loadedStudents.map((student) => api.getStudentScores(student.id)),
      );
      const nextScores = {};
      scoreLists.flat().forEach((score) => {
        nextScores[`${score.student_id}-${score.co_id}`] = {
          id: score.id,
          marks: String(score.marks),
        };
      });
      setOutcomes(loadedOutcomes);
      setStudents(loadedStudents);
      setScoreValues(nextScores);
      setSavedScores(nextScores);
    } catch (loadError) {
      setError(loadError.message || "Unable to load course data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorkspace();
  }, [course.id]);

  const invalidScores = useMemo(
    () => Object.values(scoreValues).some((score) => score.invalid),
    [scoreValues],
  );

  function changeScore(studentId, coId, marks) {
    const key = `${studentId}-${coId}`;
    const invalid = marks !== "" && (!Number.isFinite(Number(marks)) || Number(marks) < 0);
    setScoreValues((current) => ({
      ...current,
      [key]: { ...(current[key] || {}), marks, invalid },
    }));
  }

  async function saveScores() {
    if (invalidScores) {
      setOperationError("Please correct invalid score values before saving.");
      return;
    }
    setSaving(true);
    setOperationError("");
    try {
      const changes = Object.entries(scoreValues).filter(
        ([key, value]) => value.marks !== (savedScores[key]?.marks ?? ""),
      );
      await Promise.all(
        changes.map(([key, value]) => {
          const [studentId, coId] = key.split("-").map(Number);
          if (value.marks === "") return value.id ? api.deleteScore(value.id) : Promise.resolve();
          const payload = { student_id: studentId, co_id: coId, marks: Number(value.marks) };
          return value.id ? api.updateScore(value.id, payload) : api.createScore(payload);
        }),
      );
      await loadWorkspace();
    } catch (saveError) {
      setOperationError(saveError.message || "Unable to save scores.");
    } finally {
      setSaving(false);
    }
  }

  async function saveOutcome(event) {
    event.preventDefault();
    setSaving(true);
    setOperationError("");
    try {
      const payload = { code: outcomeForm.code.trim(), description: outcomeForm.description.trim() };
      if (outcomeForm.id) await api.updateCourseOutcome(outcomeForm.id, payload);
      else await api.createCourseOutcome(course.id, payload);
      setOutcomeForm(null);
      await loadWorkspace();
    } catch (saveError) {
      setOperationError(saveError.message || "Unable to save course outcome.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteOutcome(outcome) {
    if (!window.confirm(`Delete ${outcome.code}? Its scores will also be removed.`)) return;
    try {
      await api.deleteCourseOutcome(outcome.id);
      await loadWorkspace();
    } catch (deleteError) {
      setOperationError(deleteError.message || "Unable to delete course outcome.");
    }
  }

  async function saveStudent(event) {
    event.preventDefault();
    setSaving(true);
    setOperationError("");
    try {
      const payload = { name: studentForm.name.trim(), roll_number: studentForm.roll_number.trim() };
      if (studentForm.id) await api.updateStudent(studentForm.id, payload);
      else await api.createStudent(course.id, payload);
      setStudentForm(null);
      await loadWorkspace();
    } catch (saveError) {
      setOperationError(saveError.message || "Unable to save student.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteStudent(student) {
    if (!window.confirm(`Delete ${student.name}? Their scores will also be removed.`)) return;
    try {
      await api.deleteStudent(student.id);
      await loadWorkspace();
    } catch (deleteError) {
      setOperationError(deleteError.message || "Unable to delete student.");
    }
  }

  async function calculateAttainment(threshold) {
    const numericThreshold = Number(threshold);
    if (!Number.isFinite(numericThreshold) || numericThreshold < 0) {
      setOperationError("Threshold must be a non-negative number.");
      return;
    }
    setAttainmentLoading(true);
    setOperationError("");
    try {
      const results = await Promise.all(
        outcomes.map(async (outcome) => [outcome.id, await api.getAttainment(outcome.id, numericThreshold)]),
      );
      setAttainment(Object.fromEntries(results));
    } catch (calculateError) {
      setOperationError(calculateError.message || "Unable to calculate attainment.");
    } finally {
      setAttainmentLoading(false);
    }
  }

  if (loading) return <LoadingState label="Loading course data..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <button className="mb-4 text-sm font-medium text-teal-700 hover:text-teal-900" onClick={onBack} type="button">← Back to courses</button>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Course workspace</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{course.name}</h2>
          <p className="mt-2 font-mono text-xs text-slate-500">{course.code}</p>
        </div>
        <div className="text-left text-sm text-slate-600 lg:text-right"><p>{students.length} students</p><p className="mt-1">{outcomes.length} course outcomes</p></div>
      </div>

      <nav aria-label="Course sections" className="flex gap-6 overflow-x-auto border-b border-slate-200">
        {sections.map((section) => <button className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium ${activeSection === section ? "border-teal-700 text-teal-800" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"}`} key={section} onClick={() => setActiveSection(section)} type="button">{section}</button>)}
      </nav>

      {operationError ? <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{operationError}</p> : null}

      {activeSection === "Course outcomes" ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-4"><div><h3 className="text-base font-semibold text-slate-900">Course outcomes</h3><p className="mt-1 text-sm text-slate-500">Define the outcomes used to assess this course.</p></div><button className="border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50" onClick={() => setOutcomeForm({ id: null, code: "", description: "" })} type="button">Add outcome</button></div>
          {outcomes.length ? <OutcomeTable onDelete={deleteOutcome} onEdit={setOutcomeForm} outcomes={outcomes} /> : <EmptyState title="No Course Outcomes have been added." description="Add an outcome to begin assessing this course." />}
          {outcomeForm ? <InlineForm title={outcomeForm.id ? "Edit outcome" : "Add outcome"} onCancel={() => setOutcomeForm(null)} onSubmit={saveOutcome} saving={saving}><Field label="CO code" value={outcomeForm.code} onChange={(value) => setOutcomeForm({ ...outcomeForm, code: value })} /><Field label="Description" value={outcomeForm.description} onChange={(value) => setOutcomeForm({ ...outcomeForm, description: value })} /></InlineForm> : null}
        </section>
      ) : null}

      {activeSection === "Students & scores" ? (
        <section className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h3 className="text-base font-semibold text-slate-900">Student scores</h3><p className="mt-1 text-sm text-slate-500">Edit marks directly in the table, then save all changes together.</p></div><div className="flex gap-3"><button className="border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setStudentForm({ id: null, name: "", roll_number: "" })} type="button">Add student</button><button className="bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50" disabled={saving} onClick={saveScores} type="button">{saving ? "Saving..." : "Save scores"}</button></div></div>
          {students.length ? <><div className="max-h-[calc(100vh-22rem)] overflow-auto"><ScoreTable onChange={changeScore} outcomes={outcomes} students={students} values={scoreValues} /></div><StudentTable onDelete={deleteStudent} onEdit={setStudentForm} students={students} /></> : <EmptyState title="No students found." description="Add a student to begin entering scores." />}
          {studentForm ? <InlineForm title={studentForm.id ? "Edit student" : "Add student"} onCancel={() => setStudentForm(null)} onSubmit={saveStudent} saving={saving}><Field label="Name" value={studentForm.name} onChange={(value) => setStudentForm({ ...studentForm, name: value })} /><Field label="Roll number" value={studentForm.roll_number} onChange={(value) => setStudentForm({ ...studentForm, roll_number: value })} /></InlineForm> : null}
        </section>
      ) : null}

      {activeSection === "Attainment" ? <AttainmentPanel error={operationError} loading={attainmentLoading} onCalculate={calculateAttainment} outcomes={outcomes} results={attainment} /> : null}
    </div>
  );
}

function Field({ label, onChange, value }) { return <label className="text-sm font-medium text-slate-700">{label}<input className="mt-2 h-10 w-full border border-slate-300 px-3 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100" onChange={(event) => onChange(event.target.value)} required value={value} /></label>; }

function InlineForm({ children, onCancel, onSubmit, saving, title }) { return <form className="grid gap-4 border border-slate-200 bg-white p-5 sm:grid-cols-2" onSubmit={onSubmit}><h3 className="sm:col-span-2 text-base font-semibold text-slate-900">{title}</h3>{children}<div className="sm:col-span-2"><button className="border border-slate-300 px-4 py-2 text-sm text-slate-700" onClick={onCancel} type="button">Cancel</button><button className="ml-3 bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50" disabled={saving} type="submit">{saving ? "Saving..." : "Save"}</button></div></form>; }

function StudentTable({ students, onDelete, onEdit }) { return <div className="border border-slate-200 bg-white"><div className="border-b border-slate-200 px-5 py-4"><h3 className="text-base font-semibold text-slate-900">Students</h3></div><div className="overflow-x-auto"><table className="w-full min-w-[600px] border-collapse text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Roll number</th><th className="px-5 py-3">Name</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{students.map((student) => <tr key={student.id}><td className="px-5 py-3 font-mono text-xs text-slate-600">{student.roll_number}</td><td className="px-5 py-3 font-medium text-slate-800">{student.name}</td><td className="px-5 py-3 text-right"><button className="mr-4 text-sm text-slate-600" onClick={() => onEdit({ id: student.id, name: student.name, roll_number: student.roll_number })} type="button">Edit</button><button className="text-sm text-red-700" onClick={() => onDelete(student)} type="button">Delete</button></td></tr>)}</tbody></table></div></div>; }
