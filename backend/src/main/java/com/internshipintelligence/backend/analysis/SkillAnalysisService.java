package com.internshipintelligence.backend.analysis;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

@Service
public class SkillAnalysisService {

    private final Map<String, List<String>> skillAliases =
            new LinkedHashMap<>();

    public SkillAnalysisService() {
        skillAliases.put("Java", List.of("java"));
        skillAliases.put("Python", List.of("python"));
        skillAliases.put("JavaScript", List.of("javascript", "js"));
        skillAliases.put("TypeScript", List.of("typescript"));
        skillAliases.put("SQL", List.of("sql"));
        skillAliases.put("C++", List.of("c++"));

        skillAliases.put("HTML", List.of("html"));
        skillAliases.put("CSS", List.of("css"));
        skillAliases.put("React", List.of("react"));
        skillAliases.put("Spring Boot", List.of("spring boot"));
        skillAliases.put("REST API", List.of(
                "rest api", "rest apis", "restful api",
                "restful apis", "restful services"
        ));

        skillAliases.put("Front-End Development", List.of(
                "front-end", "front end", "frontend"
        ));
        skillAliases.put("Back-End Development", List.of(
                "back-end", "back end", "backend"
        ));
        skillAliases.put("Database", List.of(
                "database", "databases"
        ));

        skillAliases.put("Git", List.of("git", "version control"));
        skillAliases.put("GitHub", List.of("github"));
        skillAliases.put("Docker", List.of("docker"));
        skillAliases.put("Linux", List.of("linux"));

        skillAliases.put("JUnit", List.of("junit"));
        skillAliases.put("Unit Testing", List.of(
                "unit testing", "unit tests"
        ));
        skillAliases.put("Automated Testing", List.of(
                "automated testing", "automated tests"
        ));
        skillAliases.put("Functional Testing", List.of(
                "functional testing", "functional tests"
        ));
        skillAliases.put("Regression Testing", List.of(
                "regression testing", "regression tests"
        ));
        skillAliases.put("Integration Testing", List.of(
                "integration testing", "integration tests"
        ));

        skillAliases.put("Application Development", List.of(
                "application development", "software development",
                "developing applications", "application enhancement",
                "maintaining applications", "coding",
                "programming"
        ));
        skillAliases.put("Debugging", List.of(
                "debugging", "debug", "investigate issues",
                "troubleshoot defects", "troubleshooting"
        ));
        skillAliases.put("Documentation", List.of(
                "documentation", "technical notes", "user guides",
                "setup instructions", "technical knowledge"
        ));
        skillAliases.put("Deployment", List.of(
                "deployment", "deployments", "release practices",
                "deployment preparation", "post-release support"
        ));
        skillAliases.put("AI", List.of(
                "artificial intelligence", "ai-assisted",
                "ai tools", "ai technologies"
        ));
        skillAliases.put("Automation", List.of(
                "automation", "automate", "automated",
                "process improvement"
        ));
        skillAliases.put("Data Analysis", List.of(
                "data analysis", "data preparation"
        ));
        skillAliases.put("Prototyping", List.of(
                "prototyping", "prototype", "prototypes"
        ));
        skillAliases.put("Security", List.of(
                "security", "secure coding"
        ));
        skillAliases.put("API Integration", List.of(
                "api integration", "integration tasks"
        ));
        skillAliases.put("Requirements Analysis", List.of(
                "requirements", "requirements gathering",
                "task breakdown"
        ));
        skillAliases.put("Google Workspace", List.of(
                "google workspace", "google suite"
        ));
        skillAliases.put("GitHub Copilot", List.of(
                "github copilot"
        ));
    }

    public List<String> extractSkills(String text) {
        if (text == null || text.isBlank()) {
            return List.of();
        }

        String normalized = text.toLowerCase(Locale.ROOT);
        List<String> detectedSkills = new ArrayList<>();

        for (Map.Entry<String, List<String>> entry
                : skillAliases.entrySet()) {
            for (String term : entry.getValue()) {
                String regex =
                        "(?<![a-z0-9+#])"
                        + Pattern.quote(term.toLowerCase(Locale.ROOT))
                        + "(?![a-z0-9+#])";

                if (Pattern.compile(regex)
                        .matcher(normalized)
                        .find()) {
                    detectedSkills.add(entry.getKey());
                    break;
                }
            }
        }

        return detectedSkills;
    }

    public int calculateCoverage(int matchedCount, int requiredCount) {
        if (requiredCount <= 0 || matchedCount <= 0) {
            return 0;
        }

        return Math.min(100, (int) Math.round(
                (double) matchedCount / requiredCount * 100
        ));
    }

    
    public Map<String, String> extractSkillEvidence(String text) {
        Map<String, String> evidence = new LinkedHashMap<>();

        if (text == null || text.isBlank()) {
            return evidence;
        }

        String normalized = text.toLowerCase(Locale.ROOT);

        for (Map.Entry<String, List<String>> entry
                : skillAliases.entrySet()) {
            for (String term : entry.getValue()) {
                String regex =
                        "(?<![a-z0-9+#])"
                        + Pattern.quote(term.toLowerCase(Locale.ROOT))
                        + "(?![a-z0-9+#])";

                var matcher = Pattern.compile(regex).matcher(normalized);

                if (matcher.find()) {
                    int start = matcher.start();
                    int end = matcher.end();

                    int contextStart = Math.max(0, start - 60);
                    int contextEnd = Math.min(text.length(), end + 60);

                    String excerpt = text.substring(contextStart, contextEnd)
                            .replaceAll("\\s+", " ")
                            .trim();

                    evidence.put(entry.getKey(), excerpt);
                    break;
                }
            }
        }

        return evidence;
    }

}

