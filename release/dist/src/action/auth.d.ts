import { OctokitApi } from '../types/auth';
import { BaseRepo, Repo } from '../types/repo';
export declare function authGithubApp(inp: {
    baseRepoData: BaseRepo;
}): Promise<{
    octokit: OctokitApi;
    repoData: Repo;
}>;
//# sourceMappingURL=auth.d.ts.map