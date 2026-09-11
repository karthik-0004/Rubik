const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}.`;
    try {
      const body = await response.json();
      if (body.detail) {
        detail = Array.isArray(body.detail)
          ? body.detail.map((item) => item.msg).join(" ")
          : body.detail;
      }
    } catch {
      // Keep the status message when the server does not return JSON.
    }
    throw new Error(detail);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  getCourses: () => request("/courses"),
  createCourse: (course) => request("/courses", { method: "POST", body: JSON.stringify(course) }),
  updateCourse: (courseId, course) => request(`/courses/${courseId}`, { method: "PUT", body: JSON.stringify(course) }),
  deleteCourse: (courseId) => request(`/courses/${courseId}`, { method: "DELETE" }),
  getCourseOutcomes: (courseId) => request(`/courses/${courseId}/outcomes`),
  createCourseOutcome: (courseId, outcome) => request(`/courses/${courseId}/outcomes`, { method: "POST", body: JSON.stringify(outcome) }),
  updateCourseOutcome: (outcomeId, outcome) => request(`/outcomes/${outcomeId}`, { method: "PUT", body: JSON.stringify(outcome) }),
  deleteCourseOutcome: (outcomeId) => request(`/outcomes/${outcomeId}`, { method: "DELETE" }),
  getCourseStudents: (courseId) => request(`/courses/${courseId}/students`),
  createStudent: (courseId, student) => request(`/courses/${courseId}/students`, { method: "POST", body: JSON.stringify(student) }),
  updateStudent: (studentId, student) => request(`/students/${studentId}`, { method: "PUT", body: JSON.stringify(student) }),
  deleteStudent: (studentId) => request(`/students/${studentId}`, { method: "DELETE" }),
  getStudentScores: (studentId) => request(`/students/${studentId}/scores`),
  createScore: (score) => request("/scores", { method: "POST", body: JSON.stringify(score) }),
  updateScore: (scoreId, score) => request(`/scores/${scoreId}`, { method: "PUT", body: JSON.stringify(score) }),
  deleteScore: (scoreId) => request(`/scores/${scoreId}`, { method: "DELETE" }),
  getAttainment: (outcomeId, threshold) =>
    request(`/outcomes/${outcomeId}/attainment?threshold=${encodeURIComponent(threshold)}`),
};

export { API_BASE_URL };
