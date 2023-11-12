import * as core from '@actions/core'
import { ReleaseResponse } from "../types/release";

export function setOutputs(release: ReleaseResponse) {
    core.setOutput('releaseID', release.data.id.toString());
    core.setOutput('releaseBrowserURL', release.data.html_url);
    core.setOutput('releaseAPIURL', release.data.url);
    core.setOutput('releaseUploadURL', release.data.upload_url);
    core.setOutput('releaseAssetsURL', release.data.assets_url);
}