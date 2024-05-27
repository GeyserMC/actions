import * as core from '@actions/core'
import * as fs from 'fs';
import { Client, ScpClient } from 'node-scp';

async function run(): Promise<void> {
    let client: ScpClient | null = null;
    try {
        const metadata = core.getInput('metadata');
        if (!fs.existsSync(metadata)) {
            console.log(`Metadata file ${metadata} does not exist`);
            core.setFailed(`Metadata file ${metadata} does not exist`);
        }

        let directory = core.getInput('directory');

        if (directory === 'auto') {
            directory = `uploads/${process.env.GITHUB_REPOSITORY}/${process.env.GITHUB_RUN_NUMBER}/`
        }

        const files = core.getInput('files');
        let uploads: string[] = files.includes('\n') ? files.split('\n') : files.split(',');
        uploads = uploads.map(s => s.trim()).filter(s => s !== '');

        client = await Client({
            host: core.getInput('host'),
            port: core.getInput('port'),
            username: core.getInput('username'),
            privateKey: Buffer.from(core.getInput('privateKey'), 'utf-8')
        });

        console.log(`Uploading release to ${directory}`);

        const parts = directory.split('/');
        let current = '';
        for (const part of parts) {
            current += part + '/';
            if (!(await client.exists(current))) {
                await client.mkdir(current);
            }
        }

        console.log(`Created directory ${directory}`);
        for (const file of uploads) {
            console.log(`Uploading ${file}`);
            await client.uploadFile(file, directory);
            console.log(`Uploaded ${file}`);
        }

        await client.uploadFile(metadata, directory);
        client.close();

        console.log(`Release uploaded`);
    } catch (error: any) {
        if (client) client.close();
        console.log(error.message);
        core.setFailed(error.message);
    }
}

run();