import * as core from '@actions/core'
import crypto from 'crypto';
import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/core';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';
import { OctokitApi } from 'src/types/auth';
import { Repo } from 'src/types/repo';

export async function authGithubApp(repoData: Repo): Promise<OctokitApi> {
    const { owner, repo } = repoData;

    const appId = core.getInput('appID', { required: true });
    const appPrivateKey = core.getInput('appPrivateKey', { required: true });
    const privateKey = crypto.createPrivateKey(appPrivateKey).export({type: 'pkcs8', format: 'pem'}).toString();

    const app = createAppAuth({
        appId: parseInt(appId),
        privateKey
    });

    const auth = await app({ type: 'app' });
    const RestOctokit = Octokit.plugin(restEndpointMethods);
    const appOctokit = new RestOctokit({ auth: auth.token });

    const installationID = await appOctokit.rest.apps.getRepoInstallation({ owner, repo }).then(response => response.data.id);
    const token = await appOctokit.rest.apps.createInstallationAccessToken({ installation_id: installationID }).then(response => response.data.token);

    const octokit = new RestOctokit({ auth: token });

    console.log(`Successfully authenticated as GitHub app`);
    return octokit;
}