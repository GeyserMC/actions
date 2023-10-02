import { OctokitApi } from 'src/types/auth';
import { Inputs } from 'src/types/inputs';
import { ReleaseResponse } from 'src/types/release';
import { Repo } from 'src/types/repo';

export async function writeRelease(inputs: Inputs, api: OctokitApi, repoData: Repo): Promise<ReleaseResponse> {
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

    if (releaseResponse.status === 201) {
        console.log(`Release ${releaseResponse.data.id} created at ${releaseResponse.data.html_url}`);
        return releaseResponse;
    }

    if (releaseResponse.status === 404) {
        throw new Error(`Specified discussion category ${discussion_category_name} does not exist`);
    }

    if (releaseResponse.status === 422) {
        throw new Error(`Release ${tag_name} already exists`);
    }

    throw new Error(`Failed to create release for tag ${tag_name}`);
}