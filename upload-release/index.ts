import * as core from '@actions/core'
import * as fs from 'fs';
import { Client } from 'node-scp';

async function run(): Promise<void> {
    try {
        const metadata = core.getInput('metadata');
        if (!fs.existsSync(metadata)) {
            console.log(`Metadata file ${metadata} does not exist`);
            core.setFailed(`Metadata file ${metadata} does not exist`);
        }

        let directory = core.getInput('directory');

        if (directory === 'auto') {
            directory = `~/uploads/${process.env.GITHUB_REPOSITORY}/${process.env.GITHUB_RUN_NUMBER}/`
        }

        const files = core.getInput('files');
        let uploads: string[] = files.includes('\n') ? files.split('\n') : files.split(',');
        uploads = uploads.map(s => s.trim()).filter(s => s !== '');

        const client = await Client({
            host: core.getInput('host'),
            port: core.getInput('port'),
            username: core.getInput('username'),
            privateKey: Buffer.from(core.getInput('privateKey'), 'utf-8')
        });

        await client.mkdir(directory);
        for (const file of uploads) {
            await client.uploadFile(file, directory);
            console.log(`Uploaded ${file}`);
        }

        await client.uploadFile(metadata, directory);
        client.close();

        console.log(`Release uploaded`);
    } catch (error: any) {
        console.log(error.message);
        core.setFailed(error.message);
    }
}

run();