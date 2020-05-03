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

  const options: any = octokit.repos.listReleases.endpoint.merge(
    {
      owner,
      repo
    });

  for await (const response of octokit.paginate.iterator(options)) {
    const releases: any[] = response.data;
    releases.forEach(release => {
      console.log("Found Release: ", release.name);
      if (release.id && release.draft) {
        const release_id = release.id;
        console.log('Deleting Draft Release: ', release.name);
        octokit.repos.deleteRelease({
          owner,
          repo,
          release_id
        })
      }
    })
  }
})()
  .catch(err => {
    console.error("Error: ", err);
  });
