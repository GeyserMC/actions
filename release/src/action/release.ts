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

    const tag_name = inputs.tag.formatted;
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

    if (inputs.additionalTags) {
        for (const i in inputs.additionalTags) {
            const ref = `tags/${inputs.additionalTags[i]}`;
            let exists = true;
            try {
                await api.rest.git.getRef({ owner, repo, ref: `tags/${inputs.additionalTags[i]}` });
            } catch (error) {
                exists = false;
            }

            if (exists) {
                await api.rest.git.updateRef({ owner, repo, ref, sha: repoData.lastCommit });
            } else {
                await api.rest.git.createRef({ owner, repo, ref: `refs/${ref}`, sha: repoData.lastCommit });
            }
        }
    }

    console.log(`Release ${releaseResponse.data.id} created at ${releaseResponse.data.html_url}`);
    return releaseResponse;
}