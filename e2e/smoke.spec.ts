import { expect, test } from "@playwright/test";

test.describe("desktop", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("shows name, role and links without scrolling", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /Enrique\s*Martinez/ }),
    ).toBeInViewport();
    await expect(
      page.getByRole("link", { name: "View work ↓" }),
    ).toBeInViewport();
    await expect(
      page.getByRole("link", { name: "GitHub →", exact: true }),
    ).toBeInViewport();
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("still shows the hero content", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /Enrique\s*Martinez/ }),
    ).toBeVisible();
  });
});

test.describe("mobile", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  test("fits the viewport and skips the 3D scene", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /Enrique\s*Martinez/ }),
    ).toBeInViewport();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    await expect(page.locator("canvas")).toHaveCount(0);
  });
});

test.describe("reduced motion", () => {
  test.use({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });

  test("does not mount the 3D scene", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /Enrique\s*Martinez/ }),
    ).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
  });
});
