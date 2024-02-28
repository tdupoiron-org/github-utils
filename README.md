# GitHub Utils

This project contains utility scripts for working with GitHub repositories.

Before running any scripts, you need to add your GitHub Personal Access Token (PAT) to your environment variables as `REPO_PAT`. This is necessary for authentication with the GitHub API.

## Installation

Before you can run the scripts, you need to install the necessary dependencies. You can do this by running the following command in your terminal:

```bash
npm install
```

## Get the Size of All Repos in an Organization

We have a script that can calculate the size of all repositories in a GitHub organization. To run this script, use the following command:

```bash
node repo_size.js <organization_name>
```