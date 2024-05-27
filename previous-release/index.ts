import * as core from '@actions/core'

async function run(): Promise<void> {
    try {
        const branch = core.getInput('branch') || process.env.GITHUB_REF_NAME!;
        const data: {
            [branch: string]: {
                c: string;
                t: string;
            }
        } = JSON.parse(core.getInput('data'));

        if (!data[branch]) {
            console.log(`No data found for branch ${branch}`);
            core.setFailed(`No data found for branch ${branch}`);
        }

        const { c: commit, t: tag } = data[branch];

        core.setOutput('previousCommit', commit);
        core.setOutput('previousRelease', tag);

        const tagNum = parseInt(tag);
        if (!isNaN(tagNum)) {
            core.setOutput('curentRelease', tagNum + 1);
        }
    } catch (error: any) {
        console.log(error.message);
        core.setFailed(error.message);
    }
}

run();