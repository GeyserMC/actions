import { OctokitApi } from '../types/auth';
import core from '@actions/core';
import { Inputs } from "../types/inputs";
import { Repo } from "../types/repo";
import { isDeepStrictEqual } from 'util';

export async function storeReleaseData(inp: {inputs: Inputs, api: OctokitApi, repoData: Repo}) {
    const { inputs, api, repoData } = inp;

    if (!inputs.release.update_release_data) {
        return;
    }

    const lastCommit = core.getInput('lastCommit') === 'auto' ? process.env.GITHUB_SHA! : core.getInput('lastCommit');
    let updated = await checkStoreReleaseData({inputs, api, repoData, lastCommit});

    let retries = 0;
    while (!updated && retries < 10) {
        console.log(`Previous release data not updated, retrying in 5 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        updated = await checkStoreReleaseData({inputs, api, repoData, lastCommit});
        retries++;

        if (retries === 10) {
            core.setFailed(`Previous release data not updated after 10 retries`);
        }
    }

    console.log(`Updated previous commit ${lastCommit}`);
    console.log(`Updated previous base tag to ${inputs.tag.base}`);
}

async function checkStoreReleaseData(inp: {inputs: Inputs, api: OctokitApi, repoData: Repo, lastCommit: string}): Promise<boolean> {
    const { inputs, api, repoData, lastCommit } = inp;

    const { owner, repo, branch } = repoData;
    const newEntry = { c: lastCommit, t: inputs.tag.base };

    const variable = 'releaseAction_prevRelease';
    const varResponse = await api.rest.actions.getRepoVariable({ owner, repo, name: variable });
    const value: Record<string, { c: string, t: string }> = JSON.parse(varResponse.data.value);

    value[branch] = newEntry;

    await api.rest.actions.updateRepoVariable({ 
        owner, 
        repo, 
        name: variable,
        value: JSON.stringify(value)
    });

    // Wait a bit for the variable to update then check if it's updated
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedVarResponse = await api.rest.actions.getRepoVariable({ owner, repo, name: variable });
    const updatedValue: Record<string, { c: string, t: string }> = JSON.parse(updatedVarResponse.data.value);
    return isDeepStrictEqual(value, updatedValue);
}