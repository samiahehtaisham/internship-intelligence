export const skillGroups = {
  Languages: [
    "Java",
    "Python",
    "JavaScript",
    "TypeScript",
    "SQL",
    "C++",
  ],
  "Web Development": [
    "HTML",
    "CSS",
    "React",
    "Spring Boot",
    "REST API",
    "Front-End Development",
    "Back-End Development",
    "API Integration",
  ],
  Tools: ["Git", "GitHub", "Docker", "Linux"],
  Testing: [
    "JUnit",
    "Unit Testing",
    "Automated Testing",
    "Functional Testing",
    "Regression Testing",
    "Integration Testing",
  ],
  "Software Engineering": [
    "Application Development",
    "Debugging",
    "Troubleshooting",
    "Documentation",
    "Version Control",
    "Deployment",
    "Database",
    "AI",
    "Automation",
    "Data Analysis",
    "Prototyping",
    "Security",
  ],
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
  "Functional Testing": ["functional testing", "functional tests"],
  "Regression Testing": ["regression testing", "regression tests"],
  "Integration Testing": ["integration testing", "integration tests"],
  GitHub: ["github"],
  "C++": ["c++"],
  "Front-End Development": [
    "front-end",
    "frontend",
    "front end",
    "front-end development",
  ],
  "Back-End Development": [
    "back-end",
    "backend",
    "back end",
    "back-end development",
  ],
  "API Integration": ["api integration", "api integrations"],
  "Application Development": [
    "application development",
    "developing applications",
    "software development",
    "software delivery",
  ],
  Debugging: ["debugging", "debug"],
  Troubleshooting: ["troubleshooting", "troubleshoot"],
  Documentation: [
    "documentation",
    "technical notes",
    "user guides",
    "setup instructions",
  ],
  "Version Control": ["version control", "git"],
  Deployment: ["deployment", "deployments", "deployment preparation"],
  Database: ["database", "databases"],
  AI: ["artificial intelligence", "ai-assisted", " ai "],
  Automation: ["automation", "automate", "automated"],
  "Data Analysis": ["data analysis", "data preparation"],
  Prototyping: ["prototyping", "prototype", "prototypes"],
  Security: ["security", "secure coding"],
};

export function extractSkills(text: string): string[] {
  const normalized = text.toLowerCase();

  return allSkills.filter((skill) => {
    const terms = skillAliases[skill] ?? [skill.toLowerCase()];

    return terms.some((term) => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(
        `(^|[^a-z0-9+#])${escaped.trim()}($|[^a-z0-9+#])`,
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
  if (requiredCount <= 0 || matchedCount <= 0) return 0;

  return Math.min(
    100,
    Math.round((matchedCount / requiredCount) * 100),
  );
}

