import { OctokitApi } from '../types/auth';
import core from '@actions/core';
import { Inputs } from "../types/inputs";
import { Repo } from "../types/repo";
import { isDeepStrictEqual } from 'util';

export async function storeReleaseData(inputs: Inputs, api: OctokitApi, repoData: Repo) {
    let updated = await checkStoreReleaseData(inputs, api, repoData);

    let retries = 0;
    while (!updated && retries < 10) {
        console.log(`Previous release data not updated, retrying in 5 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        updated = await checkStoreReleaseData(inputs, api, repoData);
        retries++;

        if (retries === 10) {
            core.setFailed(`Previous release data not updated after 10 retries`);
        }
    }


    console.log(`Updated previous commit ${process.env.GITHUB_SHA!}`);
    console.log(`Updated previous base tag to ${inputs.tag.base}`);
}

async function checkStoreReleaseData(inputs: Inputs, api: OctokitApi, repoData: Repo): Promise<boolean> {
    const { owner, repo, branch } = repoData;
    const newEntry = { c: process.env.GITHUB_SHA!, t: inputs.tag.base };

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

    const updatedVarResponse = await api.rest.actions.getRepoVariable({ owner, repo, name: variable });
    const updatedValue: Record<string, { c: string, t: string }> = JSON.parse(updatedVarResponse.data.value);
    return isDeepStrictEqual(value, updatedValue);
}