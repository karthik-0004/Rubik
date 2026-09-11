import math
from collections.abc import Iterable
from dataclasses import dataclass
from numbers import Real


@dataclass(frozen=True)
class AttainmentResult:
    total_students: int
    students_met: int
    attainment_percentage: float


def _validated_scores(scores: Iterable[float]) -> list[float]:
    values = list(scores)
    for score in values:
        if isinstance(score, bool) or not isinstance(score, Real):
            raise ValueError("Scores must be numeric")
        if not math.isfinite(float(score)):
            raise ValueError("Scores must be finite numbers")
    return [float(score) for score in values]


def _validated_threshold(threshold: float) -> float:
    if isinstance(threshold, bool) or not isinstance(threshold, Real):
        raise ValueError("Threshold must be numeric")
    if not math.isfinite(float(threshold)):
        raise ValueError("Threshold must be a finite number")
    return float(threshold)


def _calculate_counts(scores: Iterable[float], threshold: float) -> tuple[int, int]:
    values = _validated_scores(scores)
    validated_threshold = _validated_threshold(threshold)
    students_met = sum(score >= validated_threshold for score in values)
    return len(values), students_met


def calculate_attainment(scores: Iterable[float], threshold: float) -> float:
    """Return percentage of scores greater than or equal to the threshold."""
    total_students, students_met = _calculate_counts(scores, threshold)
    if total_students == 0:
        return 0.0
    return round((students_met / total_students) * 100, 2)


def calculate_attainment_summary(
    scores: Iterable[float], threshold: float
) -> AttainmentResult:
    """Return counts and a two-decimal attainment percentage for an API response."""
    total_students, students_met = _calculate_counts(scores, threshold)
    percentage = 0.0
    if total_students > 0:
        percentage = round((students_met / total_students) * 100, 2)
    return AttainmentResult(total_students, students_met, percentage)
