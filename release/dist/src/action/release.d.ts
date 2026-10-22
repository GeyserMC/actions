import { OctokitApi } from '../types/auth';
import { Inputs } from '../types/inputs';
import { ReleaseResponse } from '../types/release';
import { Repo } from '../types/repo';
export declare function writeRelease(inp: {
    inputs: Inputs;
    api: OctokitApi;
    repoData: Repo;
}): Promise<ReleaseResponse | null>;
//# sourceMappingURL=release.d.ts.map