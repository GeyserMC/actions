import { OctokitApi } from 'src/types/auth';
import * as parse from '../util/parse';
import { Inputs } from "src/types/inputs";
import { Repo } from "src/types/repo";

export async function storeReleaseData(inputs: Inputs, api: OctokitApi, repoData: Repo) {
    const { owner, repo, branch } = repoData;
    const commitVar = `releaseAction_${parse.sanitizeVariableName(branch)}_prevCommit`;
    
    const curCommitVarResponse = await api.rest.actions.updateRepoVariable({ 
        owner, 
        repo, 
        name: commitVar,
        value: process.env.GITHUB_SHA!
    });

    if (curCommitVarResponse.status !== 204) {
        throw new Error(`Failed to update variable ${commitVar} to ${process.env.GITHUB_SHA!}`);
    }

    console.log(`Updated variable ${commitVar} to ${process.env.GITHUB_SHA!}`);

    if (!inputs.tag.increment) {
        return;
    }

    const buildNumberVar = `releaseAction_${parse.sanitizeVariableName(branch)}_buildNumber`;
    const buildNumber = inputs.tag.base;

    const buildNumberVarResponse = await api.rest.actions.updateRepoVariable({ 
        owner, 
        repo, 
        name: buildNumberVar,
        value: buildNumber
    });

    if (buildNumberVarResponse.status !== 204) {
        throw new Error(`Failed to update variable ${buildNumberVar} to ${buildNumber}`);
    }

    console.log(`Updated variable ${buildNumberVar} to ${buildNumber}`);
}