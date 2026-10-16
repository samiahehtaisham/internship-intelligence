package com.internshipintelligence.backend;

import java.util.List;

import com.internshipintelligence.backend.analysis.SavedAnalysisService;
import com.internshipintelligence.backend.analysis.model.JobAnalysis;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseStatus;

@RestController
@RequestMapping("/api/analyses")
public class SavedAnalysisController {

    private final SavedAnalysisService service;

    public SavedAnalysisController(SavedAnalysisService service) {
        this.service = service;
    }

    @GetMapping
    public List<JobAnalysis> getAllAnalyses() {
        return service.getAllAnalyses();
    }

    @GetMapping("/{id}")
    public JobAnalysis getAnalysisById(@PathVariable Long id) {
        return service.getAnalysisById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobAnalysis saveAnalysis(
            @RequestBody JobAnalysis analysis) {
        return service.saveAnalysis(analysis);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAnalysis(@PathVariable Long id) {
        service.deleteAnalysis(id);
    }
}
