import * as core from '@actions/core'
import { Octokit } from '@octokit/action';
import { getInputs } from 'src/action/inputs';
import { writeRelease } from 'src/action/release';
import { getRepoData } from 'src/action/repo';
import { storeReleaseData } from 'src/action/store';
import { uploadFiles } from 'src/action/files';

async function run(): Promise<void> {
    try {
        const repoData = getRepoData();
        const octokit = new Octokit();

        const inputs = await getInputs(octokit, repoData);
        const releaseResponse = await writeRelease(inputs, octokit, repoData);
        await storeReleaseData(inputs, octokit, repoData);
        await uploadFiles(octokit, inputs, releaseResponse, repoData);
        
        core.setOutput('releaseID', releaseResponse.data.id.toString());
        core.setOutput('releaseBrowserURL', releaseResponse.data.html_url);
        core.setOutput('releaseAPIURL', releaseResponse.data.url);
        core.setOutput('releaseUploadURL', releaseResponse.data.upload_url);
        core.setOutput('releaseAssetsURL', releaseResponse.data.assets_url);
        console.log(`Release finished`);
    } catch (error: any) {
        core.setFailed(error.message)
    }
}

run();