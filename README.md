# GitSheet 📊

> **GitHub Repository Analytics in Google Sheets - Track stars, issues, PRs, and more!**

Transform how you monitor your GitHub repositories with a beautiful, automated Google Sheets dashboard. No more switching between tabs or manually tracking stats - just enter your username and get instant insights into all your public repositories.

![GitSheet Demo](https://github.com/user-attachments/assets/6fad2db7-81cf-4500-8915-2f0567c53928)


## ✨ Features

🔥 **Auto-fetch all public repositories** for any GitHub user  
📊 **Complete repository analytics** - stars, forks, issues, PRs, watchers, size  
🎯 **Smart data separation** - accurately separates issues from pull requests  
📋 **Rich metadata** - license info, fork detection, creation/update dates  
🎨 **Beautiful formatting** - professional styling with colors and auto-sizing  
⚡ **Zero setup required** - works immediately after copying template  
🔄 **One-click updates** - refresh all data with a single menu click  
🛡️ **Rate limit protection** - built-in delays to respect GitHub API limits  

## 🚀 Quick Start

### Option 1: Use the Template (Recommended)
1. **[📋 Copy the GitSheet Template](https://docs.google.com/spreadsheets/d/1yDYncOyZMl9EgtafObJzCeg7FK4h5qTmEUhycpOi6zo/edit?usp=sharing)**
2. Click "File > Make a copy" to create your own copy
3. Go to "GitSheet" menu → "Setup Profile Sheet"
4. Change the username from "phucbm" to your GitHub username
5. Click "GitSheet" → "Update Repository Stats"
6. **Done!** 🎉

![Setup Process](https://github.com/user-attachments/assets/1d36f6e0-5e6f-4a38-bf58-b3764c36deb0)

### Option 2: Manual Setup
If you prefer to set it up manually:

1. Create a new Google Sheet
2. Go to Extensions → Apps Script
3. Copy the code from [`apps-script.js`]([gitsheet.js](https://github.com/phucbm/gitsheet/blob/main/apps-script.js))
4. Save and authorize permissions
5. Follow steps 3-6 from Option 1

## 📋 What Data Does GitSheet Track?

| Column | Description |
|--------|-------------|
| **Repository Name** | Name of the repository |
| **Description** | Repository description |
| **Language** | Primary programming language |
| **Stars** | Number of stargazers |
| **Forks** | Number of forks |
| **Watchers** | Number of watchers |
| **Open Issues** | Current open issues (excludes PRs) |
| **Open PRs** | Current open pull requests |
| **Size (MB)** | Repository size in megabytes |
| **License** | Repository license (MIT, Apache, etc.) |
| **Is Fork** | Whether the repo is a fork |
| **Created** | Repository creation date |
| **Updated** | Last update date |
| **URL** | Direct link to repository |

## 🔧 Advanced Usage

### Refresh Data
- Use "GitSheet" → "Update Repository Stats" to refresh all data
- Data automatically updates timestamps in the Profile sheet

### Multiple Users
- Create separate sheets for different GitHub users
- Each sheet maintains its own profile and data

### Export & Sharing
- Use Google Sheets' built-in export (Excel, CSV, PDF)
- Share read-only copies with team members
- Create charts and pivot tables for deeper analysis

## ⚠️ First-Time Setup: Security Warning

When you first run GitSheet, Google will show a security warning because the script accesses external APIs (GitHub). This is completely normal and safe.

![Security Warning](https://github.com/user-attachments/assets/f70b8a37-30e6-4477-8dd2-4abc3b87ae47)

**What to do:**
1. Click "Advanced"
2. Click "Go to GitSheet (unsafe)"
3. Review permissions and click "Allow"

**Why this happens:** Google shows this warning for any script that accesses external APIs. Your data stays completely private and secure.

## 🛠️ Technical Details

### Rate Limiting
- GitSheet respects GitHub's API rate limits (60 requests/hour for unauthenticated users)
- Built-in delays prevent hitting rate limits
- Progress indicators show update status

### Data Accuracy
- Issues and PRs are accurately separated (GitHub API combines them)
- Real-time data fetched directly from GitHub
- Handles errors gracefully and continues processing

### Performance
- Batch API calls for optimal speed
- Efficient Google Sheets operations
- Handles repositories of any size

## 🔮 Roadmap

GitSheet is actively developed! Here's what's coming:

### v2.0 - Write Operations (Coming Soon)
- ✏️ Edit repository descriptions directly in sheets
- 🏷️ Bulk update topics/tags
- ⚙️ Modify repository settings
- 📝 Batch operations across multiple repos

### Future Features
- 📈 Historical data tracking and charts
- 🔔 Automated reports and notifications
- 👥 Team collaboration features
- 🌐 Support for organizations
- 📱 Mobile app companion

## 🤝 Contributing

We love contributions! Here's how you can help:

- 🐛 **Report bugs** by opening an issue
- 💡 **Suggest features** in the discussions
- 📖 **Improve documentation** 
- 🔧 **Submit pull requests**
- ⭐ **Star the repository** to show support

## 📚 Use Cases

**Individual Developers:**
- Track personal project popularity
- Monitor repository health
- Identify trending projects
- Portfolio management

**Open Source Maintainers:**
- Monitor multiple projects at once
- Track community engagement
- Identify repositories needing attention
- Generate project reports

**Development Teams:**
- Competitive analysis
- Portfolio overview
- Project prioritization
- Stakeholder reporting

## ❓ FAQ

**Q: Is GitSheet free?**  
A: Yes! GitSheet is completely free and open source.

**Q: Do I need a GitHub account?**  
A: You need a GitHub account to have repositories, but anyone can view public repository data.

**Q: Can I track private repositories?**  
A: Currently GitSheet only supports public repositories. Private repo support is planned for v2.0.

**Q: How often should I update the data?**  
A: Whenever you want fresh data! There's no automatic refresh to respect API limits.

**Q: Can I track organizations?**  
A: Yes! Just enter the organization name instead of a username.

**Q: What about GitHub rate limits?**  
A: GitSheet includes built-in rate limiting protection. For heavy usage, consider using a GitHub Personal Access Token (v2.0 feature).

## 📄 License

MIT License - feel free to use GitSheet for any purpose!

## 🙋‍♂️ Support

- 📖 **Documentation**: Check this README first
- 🐛 **Bug Reports**: [Open an issue](../../issues)
- 💬 **Questions**: [Start a discussion](../../discussions)
- 📧 **Contact**: [Your contact info]

## 🌟 Show Your Support

If GitSheet helps you manage your GitHub repositories, please:
- ⭐ Star this repository
- 🐦 Share on social media
- 📝 Write a blog post about your experience
- 🗣️ Tell other developers

---

**Built with ❤️ for the developer community**

*GitSheet v1.0 - Making GitHub repository management effortless, one spreadsheet at a time.*
