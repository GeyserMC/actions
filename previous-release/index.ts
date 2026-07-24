import * as core from '@actions/core';
import { authGithubApp } from './src/action/auth';
import { getRepoData } from './src/action/repo';

type PrevReleaseData = {
	[branch: string]: {
		c: string;
		t: string;
        // Backwards compat
        full_tag?: string;
	}
}

async function getLivePrevReleaseData() {
	const baseRepoData = getRepoData(core.getInput('branch'));

	const { octokit, repoData } = await authGithubApp({baseRepoData});
	const { owner, repo, branch } = repoData;

	// Get the previous release data from the repository variable
	const variable = 'releaseAction_prevRelease';
	const varResponse = await octokit.rest.actions.getRepoVariable({ owner, repo, name: variable });
	const data: PrevReleaseData = JSON.parse(varResponse.data.value);

	return data
}

async function run(): Promise<void> {
    try {
        const branch = core.getInput('branch') || process.env.GITHUB_REF_NAME!;

		// Allow legacy users to provide the data directly, but prefer live data if app credentials are provided
		let data: PrevReleaseData = {};
		if (core.getInput("appID") && core.getInput("appPrivateKey")) {
            try {
                data = await getLivePrevReleaseData();
            } catch (ignored) {} // RequestError - data doesn't exist
		} else {
			data = JSON.parse(core.getInput('data') || '{}');
		}

        if (!data[branch]) {
            core.setOutput('previousRelease', '0');
            core.setOutput('previousTag', '');
            core.setOutput('previousCommit', '');
            core.setOutput('curentRelease', '1');
            return;
        }

        const { c: commit, t: tag, full_tag } = data[branch];

        core.setOutput('previousCommit', commit);
        core.setOutput('previousRelease', tag);
        core.setOutput('previousTag', full_tag ? full_tag : '');

        const tagNum = parseInt(tag);
        if (!isNaN(tagNum)) {
            core.setOutput('curentRelease', tagNum + 1);
        } else {
            core.setOutput('curentRelease', process.env.GITHUB_RUN_NUMBER!);
        }
    } catch (error: any) {
        console.log(error.message);
        core.setFailed(error.message);
    }
}

run();