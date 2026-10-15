import { test, expect } from "@playwright/test";

test.describe("Hospital Management System - Tight E2E UI & RBAC Test Suite", () => {
  // -------------------------------------------------------------
  // Test 1: Landing Page & Fast Visual Hydration
  // -------------------------------------------------------------
  test("1. Landing page loads instantly with zero hydration errors and clear branding", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/");

    // Verify Brand Logo & Navigation
    await expect(page.locator("text=Doct.")).toBeVisible({ timeout: 30000 });
    await expect(
      page.getByRole("heading", { name: /Unified Healthcare Management/i })
    ).toBeVisible();

    // Verify Action buttons
    const signInBtn = page.getByRole("link", { name: "Sign In" });
    const getStartedBtn = page.getByRole("link", { name: "Get Started" });
    await expect(signInBtn).toBeVisible();
    await expect(getStartedBtn).toBeVisible();

    // Verify Hero image rendered without hanging
    const previewImg = page.locator('img[alt="Clinical Dashboard Portal Preview"]');
    await expect(previewImg).toBeVisible();

    // Verify no critical hydration or React errors
    const criticalErrors = consoleErrors.filter(
      (err) => err.includes("Hydration failed") || err.includes("Unhandled Runtime Error")
    );
    expect(criticalErrors).toHaveLength(0);
  });

  // -------------------------------------------------------------
  // Test 2: Patient Portal Experience & Strict RBAC Boundary Defense
  // -------------------------------------------------------------
  test("2. Patient role: Personal portal view, strict data isolation, and boundary defense", async ({
    page,
    context,
  }) => {
    await context.clearCookies();

    // A. Log in as Patient
    await page.goto("/login");
    await page.fill('input[type="email"]', "eleanor.vance@gmail.com");
    await page.fill('input[type="password"]', "patient12345");
    await page.click('button[type="submit"]');

    // Should transition to dashboard via client router
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 30000 });

    // B. Verify Patient Portal UI
    await expect(page.getByText(/Patient Health Dashboard/i)).toBeVisible();
    await expect(page.getByText(/Welcome back, Eleanor Vance/i)).toBeVisible();

    // C. Verify Sidebar Menu is restricted to Patient-only links
    const sidebar = page.locator("aside");
    await expect(sidebar.getByText("Health Portal")).toBeVisible();
    await expect(sidebar.getByText("My Appointments")).toBeVisible();
    await expect(sidebar.getByText("Doctor Directory")).toBeVisible();
    await expect(sidebar.getByText("My Invoices & Bills")).toBeVisible();

    // Critical: Patient MUST NOT see clinical staff or admin navigation
    await expect(sidebar.getByText("Governance & Staff")).not.toBeVisible();
    await expect(sidebar.getByText("Patient Master")).not.toBeVisible();
    await expect(sidebar.getByText("Roster & Shifts")).not.toBeVisible();

    // D. Test Hard Boundary Defense: Patient visiting /dashboard/admin
    await page.goto("/dashboard/admin");
    // Intercepted by Edge Middleware and redirected away from /dashboard/admin
    await expect(page).not.toHaveURL(/.*\/admin/);

    // E. Test Hard Boundary Defense: Patient visiting /dashboard/patients
    await page.goto("/dashboard/patients");
    await expect(page.getByText("Access Boundary Enforced")).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByText(/The Master Patient Registry contains protected health information/i)
    ).toBeVisible();

    // F. Test Appointments Page: Patient view restrictions
    await page.goto("/dashboard/appointments");
    await expect(
      page.getByRole("heading", { name: "My Medical Appointments" })
    ).toBeVisible();
    await expect(page.locator("main").getByText("Patient Portal")).toBeVisible();

    // Patient CANNOT start clinical EHR consultations or decline appointments
    await expect(page.getByRole("button", { name: /Start Consultation/i })).not.toBeVisible();
    await expect(page.getByRole("button", { name: /Decline/i })).not.toBeVisible();

    // G. Test Doctor Directory: Patient view has NO "+ New Doctor" form
    await page.goto("/dashboard/doctors");
    await expect(page.getByText("Medical Practitioner Directory")).toBeVisible();
    await expect(page.getByText("+ New Doctor")).not.toBeVisible();

    // H. Test Billing Page: Patient view has NO "+ Bill Confirmed Encounter"
    await page.goto("/dashboard/billing");
    await expect(
      page.getByRole("heading", { name: "My Medical Invoices & Copays" })
    ).toBeVisible();
    await expect(page.getByText("Bill Confirmed Encounter")).not.toBeVisible();
    await expect(page.getByText(/Total Settled Copays/i)).toBeVisible();

    // I. Test Settings Page: Patient clinical demographics & insurance
    await page.goto("/dashboard/settings");
    await expect(page.getByRole("heading", { name: "Eleanor Vance" })).toBeVisible();
    await expect(page.getByText("Registered Patient")).toBeVisible();
    await expect(page.getByText("Demographics & Contact")).toBeVisible();
    await expect(page.getByText("Medical & Allergies")).toBeVisible();
    await expect(page.getByText("Insurance & Coverage")).toBeVisible();

    // Doctor-only tabs MUST NOT be visible to Patient
    await expect(page.getByText("Practice & Schedule")).not.toBeVisible();
    await expect(page.getByText("Hospital Governance")).not.toBeVisible();
  });

  // -------------------------------------------------------------
  // Test 3: Doctor Clinical Portal & EHR Documentation Flow
  // -------------------------------------------------------------
  test("3. Doctor role: Clinical command center, EHR consultations, and shift management", async ({
    page,
    context,
  }) => {
    await context.clearCookies();

    // A. Log in as Doctor
    await page.goto("/login");
    await page.fill('input[type="email"]', "s.jenkins@hospital.org");
    await page.fill('input[type="password"]', "doctor12345");
    await page.click('button[type="submit"]');

    // Should transition to dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 30000 });

    // B. Verify Clinical Command Center (Doctor Dashboard)
    await expect(
      page.getByRole("heading", { name: "Upcoming Appointments" })
    ).toBeVisible();
    await expect(page.getByText(/Select Roster Date/i)).toBeVisible();

    // C. Verify Sidebar Menu has Clinician routes
    const sidebar = page.locator("aside");
    await expect(sidebar.getByText("Overview")).toBeVisible();
    await expect(sidebar.getByText("Appointments")).toBeVisible();
    await expect(sidebar.getByText("Patients")).toBeVisible();
    await expect(sidebar.getByText("Schedule Timings")).toBeVisible();
    await expect(sidebar.getByText("Billing & Invoices")).toBeVisible();

    // Doctor MUST NOT have admin governance access
    await expect(sidebar.getByText("Governance & Staff")).not.toBeVisible();

    // D. Test Boundary Defense: Doctor visiting /dashboard/admin
    await page.goto("/dashboard/admin");
    await expect(page).not.toHaveURL(/.*\/admin/);

    // E. Doctor Appointments & EHR Hub
    await page.goto("/dashboard/appointments");
    await expect(
      page.getByRole("heading", { name: "Appointments & Encounters" })
    ).toBeVisible();
    await expect(page.getByText("EHR Clinical Hub")).toBeVisible();

    // F. Doctor Patient Registry
    await page.goto("/dashboard/patients");
    await expect(page.getByRole("heading", { name: "Patient Directory" })).toBeVisible();
    await expect(page.getByText("Eleanor Vance")).toBeVisible();

    // G. Doctor Shift Schedules
    await page.goto("/dashboard/Schedules");
    await expect(
      page.getByRole("heading", { name: "Doctor Shift Roster & Schedules" })
    ).toBeVisible();

    // H. Doctor Profile & Settings
    await page.goto("/dashboard/settings");
    await expect(page.getByRole("heading", { name: "Dr. Sarah Jenkins" })).toBeVisible();
    await expect(page.getByText(/Staff Physician • Cardiology/i)).toBeVisible();
    await expect(page.getByText("Clinician Profile")).toBeVisible();
    await expect(page.getByText("Practice & Schedule")).toBeVisible();

    // Patient-only tabs MUST NOT be visible to Doctor
    await expect(page.getByText("Medical & Allergies")).not.toBeVisible();
    await expect(page.getByText("Insurance & Coverage")).not.toBeVisible();
  });

  // -------------------------------------------------------------
  // Test 4: Hospital Administrator Governance & RBAC Console
  // -------------------------------------------------------------
  test("4. Admin role: Hospital governance, credentialing, and physician management", async ({
    page,
    context,
  }) => {
    await context.clearCookies();

    // A. Log in as Hospital Administrator
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@hospital.org");
    await page.fill('input[type="password"]', "admin12345");
    await page.click('button[type="submit"]');

    // Should transition to dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 30000 });

    // B. Admin Sidebar contains Governance & Staff
    const sidebar = page.locator("aside");
    await expect(sidebar.getByText("Governance & Staff")).toBeVisible();
    await expect(sidebar.getByText("Patient Master")).toBeVisible();

    // C. Access Admin Governance Console
    await page.goto("/dashboard/admin");
    await expect(
      page.getByRole("heading", { name: /Hospital Administration & Governance/i })
    ).toBeVisible();

    // Verify Admin Panels: Credentials, RBAC, Audit
    await expect(page.getByRole("button", { name: /Credentialing/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /RBAC Role Assignment/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Audit/i })).toBeVisible();

    // D. Admin Doctor Directory has "+ New Doctor" capability
    await page.goto("/dashboard/doctors");
    await expect(page.getByText("+ New Doctor")).toBeVisible();
  });

  // -------------------------------------------------------------
  // Test 5: Interactive Profile Demographic Update & Persistence
  // -------------------------------------------------------------
  test("5. Interactive clinical profile updates, demographic editing, and persistence", async ({
    page,
    context,
  }) => {
    await context.clearCookies();

    // Log in as Patient
    await page.goto("/login");
    await page.fill('input[type="email"]', "eleanor.vance@gmail.com");
    await page.fill('input[type="password"]', "patient12345");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 30000 });

    // Navigate to Settings
    await page.goto("/dashboard/settings");
    await expect(page.getByRole("heading", { name: "Eleanor Vance" })).toBeVisible();

    // Edit Primary Phone Number
    const phoneInput = page.locator('input[placeholder="+1 (555) 000-0000"]').first();
    await phoneInput.fill("+1 (555) 890-1234");

    // Click Save Demographics
    await page.getByRole("button", { name: "Save Demographics" }).click();

    // Verify confirmation toast or success feedback
    await expect(page.getByText(/Profile saved successfully/i)).toBeVisible({ timeout: 10000 });
  });
});
