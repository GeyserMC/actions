import * as core from '@actions/core'
import { ReleaseResponse } from "../types/release";
import { Inputs } from '../types/inputs';

export async function setOutputs(inp: {release: ReleaseResponse | null, inputs: Inputs}): Promise<void> {
    const { release, inputs } = inp;
    
    if (release) {
        core.setOutput('releaseID', release.data.id.toString());
        core.setOutput('releaseBrowserURL', release.data.html_url);
        core.setOutput('releaseAPIURL', release.data.url);
        core.setOutput('releaseUploadURL', release.data.upload_url);
        core.setOutput('releaseAssetsURL', release.data.assets_url);
    }

    const tag = inputs.tag.prefix + inputs.tag.separator + inputs.tag.base;

    core.setOutput('tag', tag);
    core.setOutput('tagPrefix', inputs.tag.prefix);
    core.setOutput('tagBase', inputs.tag.base);
    core.setOutput('tagSeparator', inputs.tag.separator);
}