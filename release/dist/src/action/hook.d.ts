import { Inputs } from '../types/inputs';
import { ReleaseResponse } from '../types/release';
import { Repo } from '../types/repo';
import { OctokitApi } from '../types/auth';
export declare function sendWebhook(inp: {
    inputs: Inputs;
    api: OctokitApi;
    repoData: Repo;
    releaseResponse: ReleaseResponse | null;
}): Promise<void>;
//# sourceMappingURL=hook.d.ts.map