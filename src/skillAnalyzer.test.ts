
import { describe, expect, it } from "vitest";
import { calculateCoverage, extractSkills } from "./skillAnalyzer";

describe("extractSkills", () => {
  it("detects supported skills", () => {
    expect(extractSkills("Java and Python with SQL")).toEqual([
      "Java",
      "Python",
      "SQL",
    ]);
  });

  it("recognizes alternative skill names", () => {
    expect(
      extractSkills("RESTful services, JS and unit tests"),
    ).toEqual(["JavaScript", "REST API", "Unit Testing"]);
  });

  it("does not count repeated mentions twice", () => {
    expect(
      extractSkills("REST APIs and RESTful services"),
    ).toEqual(["REST API"]);
  });

  it("does not match skills inside longer words", () => {
    expect(
      extractSkills("I enjoy javascripted activities"),
    ).not.toContain("JavaScript");
  });

  it("returns no skills for unrelated text", () => {
    expect(
      extractSkills("Excellent communication and teamwork"),
    ).toEqual([]);
  });
});

describe("calculateCoverage", () => {
  it("calculates and rounds the coverage percentage", () => {
    expect(calculateCoverage(5, 9)).toBe(56);
  });

  it("returns zero when no requirements are detected", () => {
    expect(calculateCoverage(0, 0)).toBe(0);
  });

    it("returns zero when there are no matched skills", () => {
    expect(calculateCoverage(0, 5)).toBe(0);
  });

  it("returns zero when the required skill count is negative", () => {
    expect(calculateCoverage(3, -1)).toBe(0);
  });
});
