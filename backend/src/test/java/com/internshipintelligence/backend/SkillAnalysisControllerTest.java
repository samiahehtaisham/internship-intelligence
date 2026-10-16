package com.internshipintelligence.backend;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class SkillAnalysisControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void analyzesSkillsFromJobDescription() throws Exception {
        mockMvc.perform(post("/api/analysis/skills")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "jobDescription": "Java, Python and SQL"
                    }
                    """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.detectedSkills[0]").value("Java"))
                .andExpect(jsonPath("$.detectedSkills[1]").value("Python"))
                .andExpect(jsonPath("$.detectedSkills[2]").value("SQL"))
                .andExpect(jsonPath("$.totalSkills").value(3));
    }

    @Test
    void returnsEmptySkillsForBlankDescription() throws Exception {
        mockMvc.perform(post("/api/analysis/skills")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "jobDescription": ""
                    }
                    """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.detectedSkills").isEmpty())
                .andExpect(jsonPath("$.totalSkills").value(0));
    }
}