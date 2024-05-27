import * as core from '@actions/core';

async function run(): Promise<void> {
    try {
        const branch = core.getInput('branch') || process.env.GITHUB_REF_NAME!;
        const data: {
            [branch: string]: {
                c: string;
                t: string;
            }
        } | '' = JSON.parse(core.getInput('data') || '{}');

        if (data === '' || !data[branch]) {
            core.setOutput('previousRelease', '0');
            core.setOutput('previousCommit', '');
            core.setOutput('curentRelease', '1');
            return;
        }

        const { c: commit, t: tag } = data[branch];

        core.setOutput('previousCommit', commit);
        core.setOutput('previousRelease', tag);

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