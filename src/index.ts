import { Octokit } from "@octokit/rest";
import { env } from "process";
const token = env.INPUT_GITHUB_TOKEN;
const repository = env.INPUT_REPOSITORY || env.GITHUB_REPOSITORY;
const [owner, repo] = repository.split("/");

(async function () {

  const octokit = new Octokit({
    auth: token
  });

  console.log("Looking for releases");

  for await (const response of octokit.paginate.iterator(
    octokit.repo.listReleases,
    {
      owner,
      repo
    }
  )) {
    const release: any = response.data;
    console.log("Found Release: ", release.name, JSON.stringify(release));
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
})();
