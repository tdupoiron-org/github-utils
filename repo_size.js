const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.REPO_PAT,
});

function formatSize(size) {
  const units = ["KB", "MB", "GB", "TB"];
  let index = 0;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }
  return `${size.toFixed(2)} ${units[index]}`;
}

async function listRepos(org = "github") {
  let repos = [];
  let page = 1;
  let response;

  do {
    response = await octokit.request("GET /orgs/{org}/repos", {
      org: org,
      per_page: 100,
      page: page,
    });

    repos = repos.concat(response.data);
    page++;
  } while (response.headers.link && response.headers.link.includes('rel="next"'));

  return repos;
}

async function main() {

  const orgName = process.argv[2];
  if (!orgName) {
    console.log('Please provide an organization name as a command-line argument.');
    process.exit(1);
  }


  const repos = await listRepos(orgName);

  // display the number of repos
  console.log(`Number of repos: ${repos.length}`);

  // sort repositories by size desc
  repos.sort((a, b) => b.size - a.size);

  // display the mean of the repos sizes
  const totalSize = repos.reduce((acc, repo) => acc + repo.size, 0);
  console.log(`Mean repo size: ${formatSize(totalSize / repos.length)}`);

  const topPercentage = Math.ceil(repos.length * 0.1);
  const bottomPercentage = Math.ceil(repos.length * 0.1);
  
  // calculate the average after removing the top 10% and the bottom 10% repositories
  const middleRepos = repos.slice(topPercentage, -bottomPercentage);
  const middleTotalSize = middleRepos.reduce((acc, repo) => acc + repo.size, 0);
  console.log(`Mean repo size (excluding top 10% and bottom 10%): ${formatSize(middleTotalSize / middleRepos.length)}`);

  repos.slice(0, 20).forEach((repo) => {
    console.log(`Repo Name: ${repo.name}, Repo Size: ${formatSize(repo.size)}, Repo Visibility: ${repo.private ? 'Private' : 'Public'}`);
  });
}

main();