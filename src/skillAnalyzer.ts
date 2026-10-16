
export const skillGroups = {
  Languages: ["Java", "Python", "JavaScript", "TypeScript", "SQL", "C++"],
  "Web Development": ["HTML", "CSS", "React", "Spring Boot", "REST API"],
  Tools: ["Git", "GitHub", "Docker", "Linux"],
  Testing: ["JUnit", "Unit Testing", "Automated Testing"],
};

export const allSkills = Object.values(skillGroups).flat();

const skillAliases: Record<string, string[]> = {
  JavaScript: ["javascript", "js"],
  TypeScript: ["typescript", "ts"],
  "REST API": [
    "rest api",
    "rest apis",
    "restful api",
    "restful apis",
    "restful services",
  ],
  "Spring Boot": ["spring boot"],
  "Unit Testing": ["unit testing", "unit tests"],
  "Automated Testing": ["automated testing", "automated tests"],
  GitHub: ["github"],
  "C++": ["c++"],
};

export function extractSkills(text: string): string[] {
  const normalized = text.toLowerCase();

  return allSkills.filter((skill) => {
    const terms = skillAliases[skill] ?? [skill.toLowerCase()];

    return terms.some((term) => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(
        `(^|[^a-z0-9+#])${escaped}($|[^a-z0-9+#])`,
        "i",
      );

      return pattern.test(normalized);
    });
  });
}

export function calculateCoverage(
  matchedCount: number,
  requiredCount: number,
): number {
  if (requiredCount <= 0) return 0;

  return Math.round((matchedCount / requiredCount) * 100);
}
