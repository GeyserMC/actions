import { Inputs } from "../types/inputs";
import { ReleaseResponse } from "../types/release";
import { Repo } from "../types/repo";
import { OctokitApi } from "../types/auth";
export declare function uploadFiles(inp: {
    api: OctokitApi;
    inputs: Inputs;
    release: ReleaseResponse | null;
    repoData: Repo;
}): Promise<void>;
//# sourceMappingURL=files.d.ts.map