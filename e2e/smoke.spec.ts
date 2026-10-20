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

test.describe("theme", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("defaults to the dark theme", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test.describe("system prefers light", () => {
    test.use({ colorScheme: "light" });

    test("starts light and mounts the astronaut scene", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
      await expect(
        page.getByRole("heading", { level: 1, name: /Enrique\s*Martinez/ }),
      ).toBeInViewport();
      await expect(page.locator("canvas")).toHaveCount(1);
    });

    test.describe("with reduced motion", () => {
      test.use({ reducedMotion: "reduce" });

      test("shows the dune poster instead of the 3D scene", async ({
        page,
      }) => {
        await page.goto("/");
        await expect(
          page.getByRole("heading", { level: 1, name: /Enrique\s*Martinez/ }),
        ).toBeVisible();
        await expect(page.locator("canvas")).toHaveCount(0);
      });
    });

    test("toggle switches theme and remembers the choice", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: "Switch to dark theme" }).click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await expect(
        page.getByRole("button", { name: "Switch to light theme" }),
      ).toBeVisible();
    });
  });
});
