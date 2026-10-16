package com.internshipintelligence.backend.analysis;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SkillAnalysisServiceTest {

    private SkillAnalysisService service;

    @BeforeEach
    void setUp() {
        service = new SkillAnalysisService();
    }

    @Test
    void detectsSupportedSkills() {
        assertEquals(
                List.of("Java", "Python", "SQL"),
                service.extractSkills("Java and Python with SQL")
        );
    }

    @Test
    void recognizesAlternativeSkillNames() {
        assertEquals(
                List.of("JavaScript", "REST API", "Unit Testing"),
                service.extractSkills("RESTful services, JS and unit tests")
        );
    }

    @Test
    void doesNotCountRepeatedMentionsTwice() {
        assertEquals(
                List.of("REST API"),
                service.extractSkills("REST APIs and RESTful services")
        );
    }

    @Test
    void returnsNoSkillsForBlankText() {
        assertEquals(List.of(), service.extractSkills("  "));
    }

    @Test
    void returnsZeroWhenNoSkillsAreRequired() {
        assertEquals(0, service.calculateCoverage(0, 0));
    }

    @Test
    void calculatesCoveragePercentage() {
        assertEquals(56, service.calculateCoverage(5, 9));
    }

    
    @Test
    void doesNotMatchSkillsInsideLongerWords() {
        assertEquals(
                List.of(),
                service.extractSkills(
                        "The candidate enjoys adjusting projects and learning new subjects."
                )
        );
    }

    @Test
void doesNotDetectJavaScriptFromUnrelatedWords() {
    assertEquals(
            List.of(),
            service.extractSkills(
                    "The candidate enjoys projects and has strong business skills."
            )
    );
}

@Test
void detectsJavaScriptWhenJsAppearsAsAStandaloneWord() {
    assertEquals(
            List.of("JavaScript"),
            service.extractSkills("Experience with JS is preferred.")
    );
}

}