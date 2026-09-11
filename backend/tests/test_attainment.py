import pytest

from app.services.attainment import calculate_attainment


def test_exact_threshold_counts_as_attained() -> None:
    assert calculate_attainment([40, 50, 60], threshold=50) == 66.67


def test_all_students_meet_threshold() -> None:
    assert calculate_attainment([60, 70, 80], threshold=50) == 100.0


def test_no_students_meet_threshold() -> None:
    assert calculate_attainment([20, 30, 40], threshold=50) == 0.0


def test_empty_scores_return_zero() -> None:
    assert calculate_attainment([], threshold=50) == 0.0


@pytest.mark.parametrize("scores", [[float("nan")], [float("inf")], ["50"]])
def test_invalid_scores_are_rejected(scores: list[float]) -> None:
    with pytest.raises(ValueError):
        calculate_attainment(scores, threshold=50)
