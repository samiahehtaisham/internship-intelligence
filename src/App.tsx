import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { skillGroups, calculateCoverage } from "./skillAnalyzer";

const sampleJob = `Software Engineering Intern

We are looking for a curious software engineering intern to join our team.

Requirements:
- Basic knowledge of Java or Python
- Familiarity with JavaScript, HTML and CSS
- Understanding of REST APIs and SQL databases
- Experience with Git and GitHub
- Knowledge of unit testing is an advantage
- Strong problem-solving and communication skills`;

type Analysis = {
  id: number;
  title: string;
  company: string;
  date: string;
  score: number;
  matched: string[];
  missing: string[];
};


type BackendAnalysis = {
  id: number;
  title: string;
  company: string;
  date: string;
  score: number;
  jobDescription: string;
  matchedSkills: string[];
  missingSkills: string[];
};


function App() {
  const [page, setPage] = useState("Overview");
  const [jobText, setJobText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [studentSkills, setStudentSkills] = useState<string[]>([
    "Java",
    "Python",
    "SQL",
    "Git",
    "GitHub",
    "JUnit",
  ]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");

  const [backendStatus, setBackendStatus] = useState("Checking...");

useEffect(() => {
  fetch("/api/health")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Backend unavailable");
      }
      return response.json();
    })
    .then((data) => {
      setBackendStatus(data.status === "UP" ? "Connected" : "Unavailable");
    })
    .catch(() => {
      setBackendStatus("Disconnected");
    });
}, []);


useEffect(() => {
  fetch("/api/analyses")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load saved analyses");
      }
      return response.json();
    })
    .then((data: BackendAnalysis[]) => {
      const loadedAnalyses: Analysis[] = data.map((item) => ({
        id: item.id,
        title: item.title,
        company: item.company,
        date: item.date,
        score: item.score,
        matched: item.matchedSkills,
        missing: item.missingSkills,
      }));

      setAnalyses(loadedAnalyses);
    })
    .catch((error) => {
      console.error("Could not load saved analyses:", error);
    });
}, []);


  const totalSkills = studentSkills.length;

  const deleteAnalysis = async (id: number) => {
  try {
    const response = await fetch(`/api/analyses/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete analysis");
    }

    setAnalyses((previous) =>
      previous.filter((analysis) => analysis.id !== id)
    );
  } catch {
    setError("Could not delete the analysis. Please check that the backend is running and try again.");
  }
};

  const runAnalysis = async () => {
    setError("");

    if (!jobText.trim()) {
      setError("Paste a job description first so we can analyze its required skills.");
      return;
    }

    let required: string[];

try {
  const response = await fetch("/api/analysis/skills", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jobDescription: jobText,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze job description.");
  }

  const data: { detectedSkills: string[]; totalSkills: number } =
    await response.json();

  required = data.detectedSkills;
} catch {
  setError("Could not analyze the job description. Please check that the backend is running and try again.");
  return;
}
    if (required.length === 0) {
      setError("No supported technical skills were detected. Try a fuller job description.");
      return;
    }

    const matched = required.filter((skill) => studentSkills.includes(skill));
    const missing = required.filter((skill) => !studentSkills.includes(skill));
    const score = calculateCoverage(matched.length, required.length);

    const result: Analysis = {
      id: Date.now(),
      title: jobTitle.trim() || "Software Engineering Intern",
      company: company.trim() || "Company not specified",
      date: new Date().toLocaleDateString(),
      score,
      matched,
      missing,
    };

    
    try {
      const response = await fetch("/api/analyses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: result.title,
          company: result.company,
          date: new Date().toISOString().slice(0, 10),
          score: result.score,
          jobDescription: jobText,
          matchedSkills: result.matched,
          missingSkills: result.missing,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save analysis");
      }

      const saved: BackendAnalysis = await response.json();

      const savedResult: Analysis = {
        id: saved.id,
        title: saved.title,
        company: saved.company,
        date: result.date,
        score: saved.score,
        matched: saved.matchedSkills,
        missing: saved.missingSkills,
      };

      setAnalyses((previous) => [savedResult, ...previous]);
      setActiveAnalysis(savedResult);
      setPage("Results");
    } catch {
      setError("Could not save the analysis to the database. Please check that the backend is running and try again.");
    }

  };

  const latestAnalysis = analyses[0];

  const recommendations = useMemo(() => {
    if (!activeAnalysis) return [];

    return activeAnalysis.missing.map((skill) => {
      const suggestions: Record<string, string> = {
        JavaScript: "Build interactive browser features using JavaScript.",
        TypeScript: "Convert a small JavaScript feature to TypeScript.",
        React: "Build a reusable component and manage its state.",
        HTML: "Create an accessible form with semantic HTML.",
        CSS: "Build a responsive layout for desktop and mobile.",
        "REST API": "Build and test a REST endpoint with Spring Boot.",
        "Spring Boot": "Create a small CRUD API using Spring Boot.",
        Docker: "Containerize a simple application.",
        Linux: "Practise common shell commands and file permissions.",
        "Unit Testing": "Write tests for valid, invalid and edge-case inputs.",
        JUnit: "Add JUnit tests for a Java service.",
        "Automated Testing": "Add automated tests to your project workflow.",
        Git: "Practise branching, merging and writing clear commits.",
        GitHub: "Document your project and track issues on GitHub.",
        SQL: "Practise joins, constraints and database design.",
        Java: "Build a small object-oriented Java application.",
        Python: "Write a small Python script that processes structured data.",
        "C++": "Practise core data structures in C++.",
      };

      return suggestions[skill] ?? `Build a small project that demonstrates ${skill}.`;
    });
  }, [activeAnalysis]);

  const toggleSkill = (skill: string) => {
    setStudentSkills((previous) =>
      previous.includes(skill)
        ? previous.filter((item) => item !== skill)
        : [...previous, skill],
    );
  };

  const navItems = [
    { name: "Overview", icon: "◫" },
    { name: "Analyze a Job", icon: "⌕" },
    { name: "My Skills", icon: "◇" },
    { name: "Saved Analyses", icon: "▤" },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">i</div>
          <div>
            <strong>internship<span>.</span></strong>
            <small>INTELLIGENCE</small>
          </div>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <div className="workspace-label">
        BACKEND: {backendStatus}
        </div>
        <nav>
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${page === item.name ? "active" : ""}`}
              onClick={() => setPage(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
              {item.name === "Saved Analyses" && analyses.length > 0 && (
                <span className="nav-count">{analyses.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="tip-card">
            <div className="tip-icon">✳</div>
            <strong>Small steps. Real progress.</strong>
            <p>Turn job requirements into a practical learning plan.</p>
          </div>
          <div className="profile">
            <div className="avatar">S</div>
            <div>
              <strong>Student profile</strong>
              <small>Software engineering</small>
            </div>
            <span className="profile-dots">···</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> {page}</div>
          <div className="topbar-right">
            <span className="status-dot" /> Personal workspace
            <div className="avatar small-avatar">S</div>
          </div>
        </header>

        <div className="page-content">
          {page === "Overview" && (
            <>
              <div className="welcome-row">
                <div>
                  <div className="eyebrow">YOUR CAREER, WITH CLARITY</div>
                  <h1>Make your next move <span>count.</span></h1>
                  <p className="page-subtitle">
                    Understand what employers ask for, identify your gaps, and build skills with purpose.
                  </p>
                </div>
                <button className="primary-button" onClick={() => setPage("Analyze a Job")}>
                  + Analyze a job <span>↗</span>
                </button>
              </div>

              <section className="stats-grid">
                <div className="stat-card">
                  <div className="stat-top"><span>Jobs analyzed</span><span className="stat-icon">▤</span></div>
                  <div className="stat-value">{analyses.length.toString().padStart(2, "0")}</div>
                  <div className="stat-note">Your analysis history</div>
                </div>
                <div className="stat-card">
                  <div className="stat-top"><span>Skills tracked</span><span className="stat-icon">◇</span></div>
                  <div className="stat-value">{totalSkills.toString().padStart(2, "0")}</div>
                  <div className="stat-note">In your personal profile</div>
                </div>
                <div className="stat-card">
                  <div className="stat-top"><span>Latest skill coverage</span><span className="stat-icon">↗</span></div>
                  <div className="stat-value">{latestAnalysis ? `${latestAnalysis.score}%` : "—"}</div>
                  <div className="stat-note">Based on your latest analysis</div>
                </div>
              </section>

              <section className="content-grid">
                <div className="panel getting-started">
                  <div className="panel-heading">
                    <div>
                      <div className="eyebrow">GET STARTED</div>
                      <h2>Your internship toolkit</h2>
                    </div>
                    <span className="panel-symbol">✳</span>
                  </div>
                  <p className="panel-description">
                    Start with a real job description. Get a clear view of the technical skills you already demonstrate and the ones to work on.
                  </p>
                  <div className="step-row">
                    <div className="step-number">01</div>
                    <div><strong>Find a role</strong><p>Copy an internship listing that interests you.</p></div>
                  </div>
                  <div className="step-row">
                    <div className="step-number">02</div>
                    <div><strong>Analyze the requirements</strong><p>Identify technical skills mentioned in the description.</p></div>
                  </div>
                  <div className="step-row">
                    <div className="step-number">03</div>
                    <div><strong>Build your action plan</strong><p>Focus on gaps you can close with real projects.</p></div>
                  </div>
                  <button className="primary-button wide-button" onClick={() => setPage("Analyze a Job")}>
                    Start your first analysis <span>→</span>
                  </button>
                </div>

                <div className="panel recent-panel">
                  <div className="panel-heading">
                    <div><div className="eyebrow">YOUR ACTIVITY</div><h2>Recent analyses</h2></div>
                    <button className="text-button" onClick={() => setPage("Saved Analyses")}>View all →</button>
                  </div>
                  {analyses.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">⌕</div>
                      <strong>Your next opportunity starts here</strong>
                      <p>Your saved job analyses will appear here.</p>
                      <button className="secondary-button" onClick={() => { setJobText(sampleJob); setPage("Analyze a Job"); }}>
                        Try a sample job
                      </button>
                    </div>
                  ) : (
                    <div className="recent-list">
                      {analyses.slice(0, 4).map((analysis) => (
                        <button className="recent-item" key={analysis.id} onClick={() => { setActiveAnalysis(analysis); setPage("Results"); }}>
                          <div className="company-avatar">{analysis.company.charAt(0).toUpperCase()}</div>
                          <div className="recent-info"><strong>{analysis.title}</strong><small>{analysis.company}</small></div>
                          <div className="recent-score">{analysis.score}%</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <div className="disclaimer">
                <span>ⓘ</span> Skill coverage measures overlap with detected skills. It is not a prediction of hiring success.
              </div>
            </>
          )}

          {page === "Analyze a Job" && (
            <section className="form-page">
              <div className="eyebrow">SKILL GAP ANALYSIS</div>
              <h1>Understand the role.</h1>
              <p className="page-subtitle">Give us a job description. We'll compare its detected skills with your profile.</p>
              <div className="panel form-panel">
                <div className="form-grid">
                  <label>Job title <span>OPTIONAL</span>
                    <input value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} placeholder="e.g. Software Engineering Intern" />
                  </label>
                  <label>Company <span>OPTIONAL</span>
                    <input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="e.g. Your target company" />
                  </label>
                </div>
                <label className="job-description-label">Job description <span>REQUIRED</span></label>
                <textarea
                  className="job-textarea"
                  value={jobText}
                  onChange={(event) => setJobText(event.target.value)}
                  placeholder="Paste the internship description here, including its responsibilities and requirements..."
                />
                <div className="textarea-footer">
                  <span>{jobText.trim() ? jobText.trim().split(/\s+/).length : 0} words</span>
                  <button className="text-button" onClick={() => setJobText(sampleJob)}>Use sample description ↗</button>
                </div>
                {error && <div className="error-message">{error}</div>}
                <div className="form-actions">
                  <button className="secondary-button" onClick={() => { setJobText(""); setError(""); }}>Clear</button>
                  <button className="primary-button" onClick={runAnalysis}>Analyze skills <span>→</span></button>
                </div>
                <div className="privacy-note"><span>ⓘ</span> This prototype analyzes text locally in your browser. No job data is uploaded.</div>
              </div>
            </section>
          )}

          {page === "My Skills" && (
            <section>
              <div className="eyebrow">YOUR BASELINE</div>
              <h1>Skills you can <span>demonstrate.</span></h1>
              <p className="page-subtitle">Select skills you can support with coursework, projects, or practical experience. Only claim what you can explain.</p>
              <div className="panel skills-panel">
                <div className="skills-header"><div><h2>Your technical toolkit</h2><p>{studentSkills.length} skills selected</p></div><span className="skill-count">{studentSkills.length}</span></div>
                {Object.entries(skillGroups).map(([group, skills]) => (
                  <div className="skill-group" key={group}>
                    <h3>{group}</h3>
                    <div className="skill-chips">
                      {skills.map((skill) => (
                        <button key={skill} onClick={() => toggleSkill(skill)} className={`skill-chip ${studentSkills.includes(skill) ? "selected" : ""}`}>
                          <span>{studentSkills.includes(skill) ? "✓" : "+"}</span> {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="skills-footnote">Be honest with your profile. Your analysis is only useful when it reflects skills you can demonstrate.</div>
              </div>
            </section>
          )}

          {page === "Results" && activeAnalysis && (
            <section>
              <button className="text-button back-button" onClick={() => setPage("Saved Analyses")}>← Back to analyses</button>
              <div className="eyebrow">ANALYSIS REPORT</div>
              <h1>{activeAnalysis.title}</h1>
              <p className="page-subtitle">{activeAnalysis.company} · Analyzed {activeAnalysis.date}</p>
              <div className="results-grid">
                <div className="panel score-panel">
                  <div className="eyebrow">SKILL COVERAGE</div>
                  <div className="score-circle" style={{ "--score": `${activeAnalysis.score}%` } as React.CSSProperties}>
                    <div><strong>{activeAnalysis.score}%</strong><small>coverage</small></div>
                  </div>
                  <p>{activeAnalysis.matched.length} of {activeAnalysis.matched.length + activeAnalysis.missing.length} detected skills match your profile.</p>
                  <div className="score-legend"><span className="legend-match" /> Matched <span className="legend-missing" /> Missing</div>
                </div>
                <div className="panel result-details">
                  <div className="result-section">
                    <div className="result-heading"><span className="result-check">✓</span><h2>Skills in your profile</h2><span className="result-count">{activeAnalysis.matched.length}</span></div>
                    {activeAnalysis.matched.length ? <div className="result-chips">{activeAnalysis.matched.map((skill) => <span className="result-chip matched" key={skill}>{skill}</span>)}</div> : <p className="muted">No matched skills detected yet.</p>}
                  </div>
                  <div className="result-section">
                    <div className="result-heading"><span className="result-cross">↗</span><h2>Skills to develop</h2><span className="result-count">{activeAnalysis.missing.length}</span></div>
                    {activeAnalysis.missing.length ? <div className="result-chips">{activeAnalysis.missing.map((skill) => <span className="result-chip missing" key={skill}>{skill}</span>)}</div> : <p className="muted">No gaps in the supported skill dictionary were detected.</p>}
                  </div>
                </div>
              </div>
              <div className="panel recommendations-panel">
                <div className="eyebrow">YOUR NEXT STEPS</div><h2>Turn gaps into progress.</h2>
                <p className="panel-description">Practical ideas to help you demonstrate missing skills. Choose one and build something you can show.</p>
                {recommendations.length ? recommendations.map((recommendation, index) => (
                  <div className="recommendation" key={recommendation}><div className="recommendation-number">{String(index + 1).padStart(2, "0")}</div><p>{recommendation}</p></div>
                )) : <p className="muted">Your detected skills already overlap with everything in this description. Try another role to compare its requirements.</p>}
                <button className="primary-button" onClick={() => setPage("My Skills")}>Update my skills →</button>
              </div>
              <div className="disclaimer"><span>ⓘ</span> This score reflects only supported keywords found in the job description. It is not a measure of your overall ability or hiring probability.</div>
            </section>
          )}

          {page === "Saved Analyses" && (
            <section>
              <div className="eyebrow">YOUR HISTORY</div>
              <h1>Saved analyses<span>.</span></h1>
              <p className="page-subtitle">Revisit the roles you've explored during this session.</p>
              <div className="panel saved-panel">
                {analyses.length === 0 ? (
                  <div className="empty-state large-empty"><div className="empty-icon">▤</div><strong>No analyses yet</strong><p>Analyze a job description to see your results here.</p><button className="primary-button" onClick={() => setPage("Analyze a Job")}>Analyze a job →</button></div>
                ) : analyses.map((analysis) => (
                  <div className="saved-row" key={analysis.id}>
                    <div className="company-avatar">{analysis.company.charAt(0).toUpperCase()}</div>
                    <div className="saved-info"><strong>{analysis.title}</strong><p>{analysis.company} · {analysis.date}</p><small>{analysis.matched.length} matched · {analysis.missing.length} to develop</small></div>
                    <div className="saved-coverage"><strong>{analysis.score}%</strong><small>coverage</small></div>
                    <button
                className="secondary-button"
                onClick={() => {
                setActiveAnalysis(analysis);
                setPage("Results");
                }}
>
                View report →
</button>

<button
  className="secondary-button"
  onClick={() => {
    if (window.confirm(`Delete "${analysis.title}"?`)) {
      void deleteAnalysis(analysis.id);
    }
  }}
>
  Delete
</button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

