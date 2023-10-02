import { Repo } from "src/types/repo";
import * as parse from 'src/util/parse';

export function getRepoData(): Repo {
    if(!process.env.GITHUB_REPOSITORY) {
        throw new Error("GITHUB_REPOSITORY is not defined");
    }

    if(!process.env.GITHUB_REF) {
        throw new Error("GITHUB_REF is not defined");
    }

    const branch = parse.removePrefix(process.env.GITHUB_REF, 'refs/heads/');

    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

    console.log(`Using repo ${owner}/${repo} on branch ${branch}`)
    return { owner, repo, branch };
}