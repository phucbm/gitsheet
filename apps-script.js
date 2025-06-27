/**
 * Main function to automatically fetch and populate GitHub user repositories
 * Run this function to update all data
 */
function updateGitHubStats() {
  try {
    // Get user info from Profile sheet
    const profileSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Profile');
    if (!profileSheet) {
      throw new Error('Profile sheet not found. Please create a sheet named "Profile"');
    }
    
    // Read username from Profile sheet (assuming it's in cell B1)
    const username = profileSheet.getRange('B1').getValue();
    if (!username) {
      throw new Error('Username not found in Profile sheet (cell B1)');
    }
    
    Logger.log(`Fetching repositories for user: ${username}`);
    
    // Get all public repositories
    const repos = getAllPublicRepos(username);
    
    if (repos.length === 0) {
      throw new Error(`No public repositories found for user: ${username}`);
    }
    
    // Get or create Stats sheet
    let statsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Stats');
    if (!statsSheet) {
      statsSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Stats');
    }
    
    // Clear existing data and set up headers
    statsSheet.clear();
    setupStatsHeaders(statsSheet);
    
    // Populate repository data
    populateRepoStats(statsSheet, repos, username);
    
    // Format the sheet
    formatStatsSheet(statsSheet);
    
    // Update profile sheet with stats
    if (profileSheet) {
      profileSheet.getRange('B2').setValue(new Date().toLocaleString());
      profileSheet.getRange('B3').setValue(repos.length);
    }
    
    Logger.log(`Successfully updated ${repos.length} repositories`);
    SpreadsheetApp.getActiveSpreadsheet().toast(`✅ Success! Updated ${repos.length} repositories for ${username}`, 'GitSheet Complete', 5);
    
  } catch (error) {
    Logger.log(`Error: ${error.toString()}`);
    SpreadsheetApp.getUi().alert(`Error: ${error.toString()}`);
  }
}

/**
 * Get all public repositories for a GitHub user
 */
function getAllPublicRepos(username) {
  const repos = [];
  let page = 1;
  const perPage = 100; // Maximum per page
  
  while (true) {
    try {
      const url = `https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=${perPage}&page=${page}`;
      const response = UrlFetchApp.fetch(url);
      
      if (response.getResponseCode() !== 200) {
        throw new Error(`GitHub API error: ${response.getResponseCode()}`);
      }
      
      const data = JSON.parse(response.getContentText());
      
      if (data.length === 0) {
        break; // No more repositories
      }
      
      repos.push(...data);
      page++;
      
      // Add delay to avoid rate limiting
      if (data.length === perPage) {
        Utilities.sleep(200);
      }
      
    } catch (error) {
      Logger.log(`Error fetching repos page ${page}: ${error.toString()}`);
      break;
    }
  }
  
  return repos;
}

/**
 * Set up headers for the Stats sheet
 */
function setupStatsHeaders(sheet) {
  const headers = [
    'Repository Name',
    'Description',
    'Language',
    'Stars',
    'Forks',
    'Watchers',
    'Open Issues',
    'Open PRs',
    'Size (MB)',
    'License',
    'Is Fork',
    'Created',
    'Updated',
    'URL'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
}

/**
 * Populate repository statistics
 */
function populateRepoStats(sheet, repos, username) {
  const data = [];
  
  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    
    try {
      // Show progress in status bar
      SpreadsheetApp.getActiveSpreadsheet().toast(
        `Processing repository ${i + 1} of ${repos.length}: ${repo.name}`, 
        'GitSheet Progress', 
        3
      );
      
      // Get additional stats (PRs and accurate issue count)
      const additionalStats = getAdditionalRepoStats(username, repo.name);
      
      const row = [
        repo.name,
        repo.description || 'No description',
        repo.language || 'N/A',
        repo.stargazers_count,
        repo.forks_count,
        repo.watchers_count,
        additionalStats.issues,
        additionalStats.prs,
        Math.round(repo.size / 1024 * 100) / 100, // Convert KB to MB, round to 2 decimals
        repo.license ? repo.license.name : 'No License',
        repo.fork ? 'Yes' : 'No',
        new Date(repo.created_at).toLocaleDateString(),
        new Date(repo.updated_at).toLocaleDateString(),
        repo.html_url
      ];
      
      data.push(row);
      
      // Add delay every 10 repos to avoid rate limiting
      if (i % 10 === 0 && i > 0) {
        Utilities.sleep(500);
      }
      
    } catch (error) {
      Logger.log(`Error processing repo ${repo.name}: ${error.toString()}`);
      
      // Add basic data even if additional stats fail
      const row = [
        repo.name,
        repo.description || 'No description',
        repo.language || 'N/A',
        repo.stargazers_count,
        repo.forks_count,
        repo.watchers_count,
        repo.open_issues_count, // This includes PRs, but better than nothing
        'Error',
        Math.round(repo.size / 1024 * 100) / 100,
        repo.license ? repo.license.name : 'No License',
        repo.fork ? 'Yes' : 'No',
        new Date(repo.created_at).toLocaleDateString(),
        new Date(repo.updated_at).toLocaleDateString(),
        repo.html_url
      ];
      
      data.push(row);
    }
  }
  
  // Write all data at once for better performance
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
  }
}

/**
 * Get additional repository statistics (separate issues and PRs)
 */
function getAdditionalRepoStats(owner, repo) {
  try {
    // Get open issues (includes PRs in GitHub API)
    const issuesUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=1`;
    const issuesResponse = UrlFetchApp.fetch(issuesUrl);
    
    // Get open PRs
    const prsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=1`;
    const prsResponse = UrlFetchApp.fetch(prsUrl);
    
    const issuesCount = parseLinkHeaderCount(issuesResponse.getHeaders()['Link'] || issuesResponse.getHeaders()['link']) || 0;
    const prsCount = parseLinkHeaderCount(prsResponse.getHeaders()['Link'] || prsResponse.getHeaders()['link']) || 0;
    
    return {
      issues: Math.max(0, issuesCount - prsCount), // Subtract PRs from issues
      prs: prsCount
    };
    
  } catch (error) {
    Logger.log(`Error getting additional stats for ${repo}: ${error.toString()}`);
    return { issues: 0, prs: 0 };
  }
}

/**
 * Parse GitHub Link header to get count
 */
function parseLinkHeaderCount(linkHeader) {
  if (!linkHeader) return 0;
  
  const lastPageMatch = linkHeader.match(/[?&]page=(\d+)[^>]*>;\s*rel="last"/);
  if (lastPageMatch) {
    return parseInt(lastPageMatch[1]);
  }
  return 0;
}

/**
 * Format the Stats sheet for better readability
 */
function formatStatsSheet(sheet) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  
  if (lastRow < 2) return; // No data to format
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, lastCol);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, lastCol);
  
  // Format numbers
  const starsCol = 4, forksCol = 5, watchersCol = 6, issuesCol = 7, prsCol = 8;
  
  if (lastRow > 1) {
    // Format number columns
    [starsCol, forksCol, watchersCol, issuesCol, prsCol].forEach(col => {
      const range = sheet.getRange(2, col, lastRow - 1, 1);
      range.setNumberFormat('#,##0');
    });
  }
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Add alternating row colors
  const dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol);
  dataRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
}

/**
 * Set up the Profile sheet template
 */
function setupProfileSheet() {
  let profileSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Profile');
  
  if (!profileSheet) {
    profileSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Profile');
  }
  
  // Clear and set up profile sheet
  profileSheet.clear();
  
  const profileData = [
    ['GitHub Username:', 'phucbm'],
    ['Last Updated:', ''],
    ['Total Repositories:', ''],
    ['', ''],
    ['Instructions:', 'Change the username above and run "Update Repository Stats" from the GitSheet menu!'],
    ['Note:', 'First time users: You will see a security warning - click "Advanced" then "Go to GitSheet (unsafe)"'],
    ['', 'This is normal for Google Sheets with external API access. Your data stays private!']
  ];
  
  profileSheet.getRange(1, 1, profileData.length, 2).setValues(profileData);
  
  // Format
  profileSheet.getRange('A:A').setFontWeight('bold');
  profileSheet.autoResizeColumns(1, 2);
  
  SpreadsheetApp.getUi().alert('Profile sheet created! You can now run updateGitHubStats()');
}

/**
 * Create a custom menu for easy access
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('GitSheet')
    .addItem('Update Repository Stats', 'updateGitHubStats')
    .addItem('Setup Profile Sheet', 'setupProfileSheet')
    .addToUi();
}
