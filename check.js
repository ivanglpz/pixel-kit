import { readFileSync, writeFileSync } from "fs";

const MALICIOUS_PACKAGES = {
  "backslash": ["0.2.1"],
  "chalk": ["5.6.1"],
  "chalk-template": ["1.1.1"],
  "color-convert": ["3.1.1"],
  "color-name": ["2.0.1"],
  "color-string": ["2.1.1"],
  "wrap-ansi": ["9.0.1"],
  "supports-hyperlinks": ["4.1.1"],
  "strip-ansi": ["7.1.1"],
  "slice-ansi": ["7.1.1"],
  "simple-swizzle": ["0.2.3"],
  "is-arrayish": ["0.3.3"],
  "error-ex": ["1.3.3"],
  "has-ansi": ["6.0.1"],
  "ansi-regex": ["6.2.1"],
  "ansi-styles": ["6.2.2"],
  "supports-color": ["10.2.1"],
  "proto-tinker-wc": ["1.8.7"],
  "debug": ["4.4.2"],
  next:["13.3.0"]
};

// Utility functions
const readPackageJson = (filePath) => {
  try {
    const content = readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to read package.json at ${filePath}: ${error.message}`);
  }
};

const fetchPackageInfo = async (packageName) => {
  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch ${packageName}: ${error.message}`);
  }
};

const getRepositoryUrl = (repository) => {
  if (!repository) return null;

  const repoUrl = typeof repository === "string" ? repository : repository.url;
  if (!repoUrl) return null;

  // Convert git URLs to GitHub URLs
  const githubMatch = repoUrl.match(/github\.com[/:]([\w-]+\/[\w-]+)/);
  if (githubMatch) {
    return `https://github.com/${githubMatch[1]}/blob/main/package.json`;
  }

  return null;
};

const checkForMaliciousVersions = (packageName, availableVersions) => {
  const maliciousVersions = MALICIOUS_PACKAGES[packageName] || [];
  return maliciousVersions.filter(version => availableVersions.includes(version));
};

const getLatestVersion = (versions) => {
  const versionKeys = Object.keys(versions);
  return versionKeys[versionKeys.length - 1];
};

// Main analysis functions
const analyzeRootDependencies = (packageJsonPath) => {
  const packageData = readPackageJson(packageJsonPath);
  const dependencies = Object.keys(packageData.dependencies || {});
  const devDependencies = Object.keys(packageData.devDependencies || {});

  return {
    name: packageData.name || "root-project",
    dependencies,
    devDependencies,
    allDependencies: [...dependencies, ...devDependencies]
  };
};

const analyzeSingleDependency = async (packageName) => {
  console.log(`Analyzing: ${packageName}...`);

  try {
    const packageInfo = await fetchPackageInfo(packageName);
    const latestVersion = getLatestVersion(packageInfo.versions);
    const latestPackageData = packageInfo.versions[latestVersion];

    const dependencies = Object.keys(latestPackageData.dependencies || {});
    const devDependencies = Object.keys(latestPackageData.devDependencies || {});
    const availableVersions = Object.keys(packageInfo.versions);
    const maliciousVersionsFound = checkForMaliciousVersions(packageName, availableVersions);
    const repositoryUrl = getRepositoryUrl(packageInfo.repository);

    return {
      name: packageName,
      version: latestVersion,
      isMalicious: maliciousVersionsFound.length > 0,
      maliciousVersions: maliciousVersionsFound,
      dependencies,
      devDependencies,
      dependencyCount: dependencies.length,
      devDependencyCount: devDependencies.length,
      totalDependencies: dependencies.length + devDependencies.length,
      repositoryUrl,
      error: null
    };
  } catch (error) {
    console.error(`Error analyzing ${packageName}: ${error.message}`);
    return {
      name: packageName,
      version: null,
      isMalicious: false,
      maliciousVersions: [],
      dependencies: [],
      devDependencies: [],
      dependencyCount: 0,
      devDependencyCount: 0,
      totalDependencies: 0,
      repositoryUrl: null,
      error: error.message
    };
  }
};

const analyzeAllDependencies = async (dependencyNames) => {
  const results = [];

  for (const packageName of dependencyNames) {
    const analysis = await analyzeSingleDependency(packageName);
    results.push(analysis);

    // Add a small delay to avoid overwhelming the npm registry
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
};

// Report generation functions
const generateSummary = (analyses) => {
  const totalDependencies = analyses.length;
  const maliciousDependencies = analyses.filter(analysis => analysis.isMalicious);
  const failedAnalyses = analyses.filter(analysis => analysis.error);

  return {
    totalDependencies,
    maliciousCount: maliciousDependencies.length,
    failedCount: failedAnalyses.length,
    successfulCount: totalDependencies - failedAnalyses.length,
    maliciousDependencies: maliciousDependencies.map(dep => ({
      name: dep.name,
      versions: dep.maliciousVersions
    }))
  };
};

const formatReportSection = (title, content, level = 1) => {
  const headerSymbol = "=".repeat(level === 1 ? 60 : 40);
  return `\n${headerSymbol}\n${title.toUpperCase()}\n${headerSymbol}\n${content}\n`;
};

const formatDependencyAnalysis = (analysis) => {
  const sections = [];

  sections.push(`Package: ${analysis.name}`);
  sections.push(`Version: ${analysis.version || "N/A"}`);

  if (analysis.error) {
    sections.push(`Status: ERROR - ${analysis.error}`);
    return sections.join("\n") + "\n" + "-".repeat(50) + "\n";
  }

  sections.push(`Malicious: ${analysis.isMalicious ? "YES ⚠️" : "NO"}`);

  if (analysis.isMalicious) {
    sections.push(`Malicious Versions: ${analysis.maliciousVersions.join(", ")}`);
  }

  sections.push(`Total Dependencies: ${analysis.totalDependencies}`);
  sections.push(`  - Dependencies: ${analysis.dependencyCount}`);
  sections.push(`  - Dev Dependencies: ${analysis.devDependencyCount}`);

  if (analysis.dependencies.length > 0) {
    sections.push(`Dependencies List: ${analysis.dependencies.join(", ")}`);
  }

  if (analysis.devDependencies.length > 0) {
    sections.push(`Dev Dependencies List: ${analysis.devDependencies.join(", ")}`);
  }

  if (analysis.repositoryUrl) {
    sections.push(`Repository package.json: ${analysis.repositoryUrl}`);
  } else {
    sections.push(`Repository package.json: Not available`);
  }

  return sections.join("\n") + "\n" + "-".repeat(50) + "\n";
};

const generateFullReport = (rootInfo, analyses, summary) => {
  const timestamp = new Date().toISOString();

  let report = formatReportSection(
    "Dependency Security Analysis Report",
    `Generated on: ${timestamp}\nProject: ${rootInfo.name}`
  );

  // Summary section
  const summaryContent = [
    `Total Dependencies Analyzed: ${summary.totalDependencies}`,
    `Successful Analyses: ${summary.successfulCount}`,
    `Failed Analyses: ${summary.failedCount}`,
    `Malicious Dependencies Found: ${summary.maliciousCount}`,
    ""
  ];

  if (summary.maliciousCount > 0) {
    summaryContent.push("⚠️  MALICIOUS DEPENDENCIES DETECTED:");
    summary.maliciousDependencies.forEach(dep => {
      summaryContent.push(`  - ${dep.name} (versions: ${dep.versions.join(", ")})`);
    });
  } else {
    summaryContent.push("✅ No malicious dependencies detected.");
  }

  report += formatReportSection("Executive Summary", summaryContent.join("\n"), 2);

  // Root project dependencies
  const rootContent = [
    `Dependencies (${rootInfo.dependencies.length}):`,
    rootInfo.dependencies.length > 0 ? `  ${rootInfo.dependencies.join(", ")}` : "  None",
    "",
    `Dev Dependencies (${rootInfo.devDependencies.length}):`,
    rootInfo.devDependencies.length > 0 ? `  ${rootInfo.devDependencies.join(", ")}` : "  None"
  ];

  report += formatReportSection("Root Project Dependencies", rootContent.join("\n"), 2);

  // Detailed analysis
  report += formatReportSection("Detailed Dependency Analysis", "", 2);

  analyses.forEach(analysis => {
    report += formatDependencyAnalysis(analysis);
  });

  return report;
};

const saveReport = (report, filename = "dependency-security-report.txt") => {
  try {
    writeFileSync(filename, report, "utf-8");
    console.log(`✅ Report saved to: ${filename}`);
  } catch (error) {
    console.error(`❌ Failed to save report: ${error.message}`);
  }
};

// Main execution function
const main = async () => {
  try {
    console.log("🔍 Starting dependency security analysis...\n");

    // Analyze root dependencies
    console.log("📋 Reading root package.json...");
    const rootInfo = analyzeRootDependencies("package.json");
    console.log(`Found ${rootInfo.allDependencies.length} dependencies to analyze\n`);

    // Analyze each dependency
    console.log("🔎 Analyzing individual dependencies...");
    const analyses = await analyzeAllDependencies(rootInfo.allDependencies);

    // Generate summary
    const summary = generateSummary(analyses);

    // Generate and save report
    console.log("\n📊 Generating report...");
    const report = generateFullReport(rootInfo, analyses, summary);
    saveReport(report);

    // Console summary
    console.log("\n" + "=".repeat(50));
    console.log("ANALYSIS COMPLETE");
    console.log("=".repeat(50));
    console.log(`Total dependencies analyzed: ${summary.totalDependencies}`);
    console.log(`Malicious dependencies found: ${summary.maliciousCount}`);
    console.log(`Failed analyses: ${summary.failedCount}`);

    if (summary.maliciousCount > 0) {
      console.log("\n⚠️  WARNING: Malicious dependencies detected!");
      summary.maliciousDependencies.forEach(dep => {
        console.log(`  - ${dep.name} (versions: ${dep.versions.join(", ")})`);
      });
    } else {
      console.log("\n✅ No malicious dependencies detected.");
    }

  } catch (error) {
    console.error(`❌ Fatal error: ${error.message}`);
    process.exit(1);
  }
};

// Execute the analysis
main().catch(console.error);