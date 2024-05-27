import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
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
            directory = `uploads/${process.env.GITHUB_REPOSITORY}/${process.env.GITHUB_RUN_ID}/`
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

        console.log(`Creating release directory ${directory}`);
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
            await client.uploadFile(file, path.join(directory, path.basename(file)));
            console.log(`Uploaded ${file}`);
        }

        console.log(`Uploading metadata`);
        await client.uploadFile(metadata, path.join(directory, path.basename(metadata)));
        console.log(`Uploaded metadata`);
        client.close();

        console.log(`Release uploaded`);
    } catch (error: any) {
        if (client) client.close();
        console.log(error.message);
        core.setFailed(error.message);
    }
}

run();