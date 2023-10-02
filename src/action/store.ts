import { OctokitApi } from '../types/auth';
import * as parse from '../util/parse';
import { Inputs } from "../types/inputs";
import { Repo } from "../types/repo";

export async function storeReleaseData(inputs: Inputs, api: OctokitApi, repoData: Repo) {
    const { owner, repo, branch } = repoData;
    const commitVar = `releaseAction_${parse.sanitizeVariableName(branch)}_prevCommit`;
    
    await api.rest.actions.updateRepoVariable({ 
        owner, 
        repo, 
        name: commitVar,
        value: process.env.GITHUB_SHA!
    });

    console.log(`Updated variable ${commitVar} to ${process.env.GITHUB_SHA!}`);

    if (!inputs.tag.increment) {
        return;
    }

    const buildNumberVar = `releaseAction_${parse.sanitizeVariableName(branch)}_buildNumber`;
    const buildNumber = inputs.tag.base;

    await api.rest.actions.updateRepoVariable({ 
        owner, 
        repo, 
        name: buildNumberVar,
        value: buildNumber
    });

    console.log(`Updated variable ${buildNumberVar} to ${buildNumber}`);
}