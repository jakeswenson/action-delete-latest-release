const { Octokit } = require("@octokit/rest");
const {env} = require ("process");
const token = env.INPUT_GITHUB_TOKEN
const repository = env.INPUT_REPOSITORY || env.GITHUB_REPOSITORY
const [owner, repo] = repository.split("/")

const octokit = new Octokit({
    auth: token
});


for await (const release of octokit.paginate.iterator(
  octokit.repo.listReleases,
  {
    owner,
    repo
  }
)) {
    if (release.id && release.draft) {
        const release_id = release.id;
        console.log('Deleting Draft Release: ', release.name);
        octokit.repos.deleteRelease({
            owner,
            repo,
            release_id
        })
    }
}


