import { expect, test } from "@playwright/test";

test("faculty can edit scores and calculate attainment", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Courses" })).toBeVisible();
  await expect(page.getByText("Database Management Systems")).toBeVisible();

  await page.getByRole("button", { name: "Open course" }).first().click();
  await expect(page.getByRole("heading", { name: "Database Management Systems" })).toBeVisible();
  await expect(page.getByText("CO1").first()).toBeVisible();

  await page.getByRole("button", { name: "Students & scores" }).click();
  await expect(page.getByText("Student scores")).toBeVisible();
  await expect(page.locator("table").first().locator("tbody tr")).toHaveCount(20);

  const firstScore = page.locator('input[aria-label="Rahul Kumar CO1 score"]');
  const originalScore = await firstScore.inputValue();
  await firstScore.fill("51");
  await page.getByRole("button", { name: "Save scores" }).click();
  await expect(firstScore).toHaveValue("51");

  await page.reload();
  await page.getByRole("button", { name: "Open course" }).first().click();
  await page.getByRole("button", { name: "Students & scores" }).click();
  await expect(page.locator('input[aria-label="Rahul Kumar CO1 score"]')).toHaveValue("51");

  await page.getByRole("button", { name: "Attainment" }).click();
  await page.getByRole("button", { name: "Calculate attainment" }).click();
  await expect(page.getByText(/%$/).first()).toBeVisible();
  await expect(page.getByText("80.00%", { exact: true }).first()).toBeVisible();

  const threshold = page.getByRole("spinbutton", { name: "Threshold" });
  await threshold.fill("60");
  await page.getByRole("button", { name: "Calculate attainment" }).click();
  await expect(page.getByText("40.00%", { exact: true }).first()).toBeVisible();

  await page.getByRole("button", { name: "Students & scores" }).click();
  await page.locator('input[aria-label="Rahul Kumar CO1 score"]').fill(originalScore);
  await page.getByRole("button", { name: "Save scores" }).click();
});
