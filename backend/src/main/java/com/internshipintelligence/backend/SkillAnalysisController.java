package com.internshipintelligence.backend;

import java.util.List;
import java.util.Map;

import com.internshipintelligence.backend.analysis.SkillAnalysisService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analysis")
public class SkillAnalysisController {

    private final SkillAnalysisService skillAnalysisService;

    public SkillAnalysisController(
            SkillAnalysisService skillAnalysisService) {
        this.skillAnalysisService = skillAnalysisService;
    }

    @PostMapping("/skills")
    public Map<String, Object> analyzeSkills(
            @RequestBody Map<String, String> request) {

        String jobDescription = request.getOrDefault("jobDescription", "");

        List<String> detectedSkills =
                skillAnalysisService.extractSkills(jobDescription);

        return Map.of(
                "detectedSkills", detectedSkills,
                "totalSkills", detectedSkills.size()
        );
    }
}

