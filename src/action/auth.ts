import * as core from '@actions/core'
import crypto from 'crypto';
import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/core';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';
import { OctokitApi } from '../types/auth';
import { BaseRepo, Repo } from '../types/repo';
import { request } from "@octokit/request"

export async function authGithubApp(baseRepoData: BaseRepo): Promise<{octokit: OctokitApi, repoData: Repo}> {
    const { owner, repo, branch, url } = baseRepoData;

    const appId = core.getInput('appID', { required: true });
    const appPrivateKey = core.getInput('appPrivateKey', { required: true });
    const privateKey = crypto.createPrivateKey(appPrivateKey).export({type: 'pkcs8', format: 'pem'}).toString();

    const app = createAppAuth({
        appId: parseInt(appId),
        privateKey,
        request: request.defaults({
            baseUrl: url,
        }),
    });

    const auth = await app({ type: 'app' });
    const RestOctokit = Octokit.plugin(restEndpointMethods);
    const appOctokit = new RestOctokit({ auth: auth.token, baseUrl: url });

    const installationID = await appOctokit.rest.apps.getRepoInstallation({ owner, repo }).then(response => response.data.id);
    const token = await appOctokit.rest.apps.createInstallationAccessToken({ installation_id: installationID }).then(response => response.data.token);

    const octokit = new RestOctokit({ auth: token, baseUrl: url });

    const defaultBranch = await octokit.rest.repos.get({ owner, repo }).then(response => response.data.default_branch);

    console.log(`Successfully authenticated as GitHub app`);
    return { octokit, repoData: { owner, repo, branch, defaultBranch, url } };
}