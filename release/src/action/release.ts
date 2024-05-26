import { OctokitApi } from '../types/auth';
import { Inputs } from '../types/inputs';
import { ReleaseResponse } from '../types/release';
import { Repo } from '../types/repo';

export async function writeRelease(inp: {inputs: Inputs, api: OctokitApi, repoData: Repo}): Promise<ReleaseResponse | null> {
    const { inputs, api, repoData } = inp;
    
    if (!inputs.release.enabled) {
        return null;
    }

    const { owner, repo, branch } = repoData;

    const tag_name = inputs.tag.prefix + inputs.tag.separator + inputs.tag.base;
    const target_commitish = branch;
    const { name, body, draft, prerelease, discussion_category_name, generate_release_notes, make_latest } = inputs.release;

    const releaseResponse = await api.rest.repos.createRelease({ 
        owner,
        repo,
        tag_name,
        target_commitish,
        name,
        body,
        draft,
        prerelease,
        discussion_category_name,
        generate_release_notes,
        make_latest
    });

    console.log(`Release ${releaseResponse.data.id} created at ${releaseResponse.data.html_url}`);
    return releaseResponse;
}