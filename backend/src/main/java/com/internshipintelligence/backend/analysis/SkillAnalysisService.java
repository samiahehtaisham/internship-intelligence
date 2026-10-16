
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
        skillAliases.put("TypeScript", List.of("typescript", "ts"));
        skillAliases.put("SQL", List.of("sql"));
        skillAliases.put("C++", List.of("c++"));

        skillAliases.put("HTML", List.of("html"));
        skillAliases.put("CSS", List.of("css"));
        skillAliases.put("React", List.of("react"));
        skillAliases.put("Spring Boot", List.of("spring boot"));
        skillAliases.put("REST API", List.of(
                "rest api",
                "rest apis",
                "restful api",
                "restful apis",
                "restful services"
        ));

        skillAliases.put("Git", List.of("git"));
        skillAliases.put("GitHub", List.of("github"));
        skillAliases.put("Docker", List.of("docker"));
        skillAliases.put("Linux", List.of("linux"));

        skillAliases.put("JUnit", List.of("junit"));
        skillAliases.put("Unit Testing", List.of(
                "unit testing",
                "unit tests"
        ));
        skillAliases.put("Automated Testing", List.of(
                "automated testing",
                "automated tests"
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
                        "(^|[^a-z0-9+#])"
                        + Pattern.quote(term)
                        + "($|[^a-z0-9+#])";

                if (Pattern.compile(regex, Pattern.CASE_INSENSITIVE)
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
        if (requiredCount <= 0) {
            return 0;
        }

        return (int) Math.round(
                (double) matchedCount / requiredCount * 100
        );
    }
}
