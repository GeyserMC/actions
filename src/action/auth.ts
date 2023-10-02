import * as core from '@actions/core'
import crypto from 'crypto';
import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/core';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';
import { OctokitApi } from 'src/types/auth';

export async function authGithubApp(): Promise<OctokitApi> {
    const appId = core.getInput('appID', { required: true });
    const appPrivateKey = core.getInput('appPrivateKey', { required: true });
    const privateKey = crypto.createPrivateKey(appPrivateKey).export().toString();

    const app = createAppAuth({
        appId: parseInt(appId),
        privateKey
    });

    const auth = await app({ type: 'app' });
    const RestOctokit = Octokit.plugin(restEndpointMethods);
    const octokit = new RestOctokit({ auth: auth.token });

    console.log(`Successfully authenticated as GitHub app`);
    return octokit;
}