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
    throw new Error(`Request failed with status ${response.status}.`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  getCourses: () => request("/courses"),
  getCourseOutcomes: (courseId) => request(`/courses/${courseId}/outcomes`),
  getCourseStudents: (courseId) => request(`/courses/${courseId}/students`),
  getStudentScores: (studentId) => request(`/students/${studentId}/scores`),
  getAttainment: (outcomeId, threshold) =>
    request(`/outcomes/${outcomeId}/attainment?threshold=${threshold}`),
};

export { API_BASE_URL };
