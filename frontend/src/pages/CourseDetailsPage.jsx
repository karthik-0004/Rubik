import { useState } from "react";

import AttainmentPanel from "../components/attainment/AttainmentPanel";
import OutcomeTable from "../components/outcomes/OutcomeTable";
import ScoreTable from "../components/scores/ScoreTable";

const courseOutcomes = [
  { code: "CO1", description: "Understand database fundamentals" },
  { code: "CO2", description: "Design normalized relational schemas" },
  { code: "CO3", description: "Write SQL queries" },
  { code: "CO4", description: "Understand transactions and concurrency" },
];

const students = [
  { name: "Rahul Kumar", rollNumber: "23R01A0501", scores: { CO1: 75, CO2: 60, CO3: 80, CO4: 55 } },
  { name: "Priya Sharma", rollNumber: "23R01A0502", scores: { CO1: 80, CO2: 45, CO3: 70, CO4: 65 } },
  { name: "Anil Reddy", rollNumber: "23R01A0503", scores: { CO1: 50, CO2: 70, CO3: 60, CO4: 80 } },
  { name: "Sneha Patel", rollNumber: "23R01A0504", scores: { CO1: 92, CO2: 88, CO3: 84, CO4: 90 } },
  { name: "Vikram Singh", rollNumber: "23R01A0505", scores: { CO1: 42, CO2: 54, CO3: 48, CO4: 51 } },
  { name: "Kavya Nair", rollNumber: "23R01A0506", scores: { CO1: 68, CO2: 72, CO3: 64, CO4: 60 } },
];

const sections = ["Course outcomes", "Students & scores", "Attainment"];

export default function CourseDetailsPage({ course, onBack }) {
  const [activeSection, setActiveSection] = useState(sections[0]);

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <button className="mb-4 text-sm font-medium text-teal-700 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2" onClick={onBack} type="button">
            ← Back to courses
          </button>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Course workspace</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{course.name}</h2>
          <p className="mt-2 font-mono text-xs text-slate-500">{course.code}</p>
        </div>
        <div className="text-left text-sm text-slate-600 lg:text-right">
          <p>{course.students} students</p>
          <p className="mt-1">{course.outcomes} course outcomes</p>
        </div>
      </div>

      <nav aria-label="Course sections" className="flex gap-6 overflow-x-auto border-b border-slate-200">
        {sections.map((section) => (
          <button
            className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 ${
              activeSection === section
                ? "border-teal-700 text-teal-800"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
            }`}
            key={section}
            onClick={() => setActiveSection(section)}
            type="button"
          >
            {section}
          </button>
        ))}
      </nav>

      {activeSection === "Course outcomes" ? (
        <section aria-labelledby="outcomes-heading" className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900" id="outcomes-heading">Course outcomes</h3>
              <p className="mt-1 text-sm text-slate-500">Define the outcomes used to assess this course.</p>
            </div>
            <button className="border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2" type="button">Add outcome</button>
          </div>
          <OutcomeTable outcomes={courseOutcomes} />
        </section>
      ) : null}

      {activeSection === "Students & scores" ? (
        <section aria-labelledby="scores-heading" className="space-y-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900" id="scores-heading">Student scores</h3>
            <p className="mt-1 text-sm text-slate-500">Enter marks for each student and course outcome.</p>
          </div>
          <ScoreTable outcomes={courseOutcomes} students={students} />
        </section>
      ) : null}

      {activeSection === "Attainment" ? <AttainmentPanel outcomes={courseOutcomes} /> : null}
    </div>
  );
}
