
package com.internshipintelligence.backend.analysis;

import java.util.List;

import com.internshipintelligence.backend.analysis.model.JobAnalysis;
import com.internshipintelligence.backend.analysis.model.JobAnalysisRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SavedAnalysisService {

    private final JobAnalysisRepository repository;

    public SavedAnalysisService(JobAnalysisRepository repository) {
        this.repository = repository;
    }

    public List<JobAnalysis> getAllAnalyses() {
        return repository.findAll();
    }

    public JobAnalysis getAnalysisById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Analysis not found: " + id));
    }

    public JobAnalysis saveAnalysis(JobAnalysis analysis) {
        return repository.save(analysis);
    }

    @Transactional
    public void deleteAnalysis(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Analysis not found: " + id);
        }

        repository.deleteById(id);
    }
}

