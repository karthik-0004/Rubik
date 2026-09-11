import { useState } from "react";

import AppShell from "./components/AppShell";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import CoursesPage from "./pages/CoursesPage";

export default function App() {
  const [activePage, setActivePage] = useState("courses");
  const [selectedCourse, setSelectedCourse] = useState(null);

  function openCourse(course) {
    setSelectedCourse(course);
    setActivePage("course-details");
  }

  function showCourses() {
    setSelectedCourse(null);
    setActivePage("courses");
  }

  return (
    <AppShell activePage={activePage} onNavigate={showCourses}>
      {activePage === "course-details" && selectedCourse ? (
        <CourseDetailsPage course={selectedCourse} onBack={showCourses} />
      ) : (
        <CoursesPage onOpenCourse={openCourse} />
      )}
    </AppShell>
  );
}
