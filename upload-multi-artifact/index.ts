import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import { DefaultArtifactClient } from '@actions/artifact';

async function run(): Promise<void> {
    try {
        const client = new DefaultArtifactClient()

        const inputs = core.getInput('artifacts');
        let lines: string[] = inputs.includes('\n') ? inputs.split('\n') : inputs.split(',');
        const artifacts: { name: string; path: string; }[] = lines
            .map(s => s.trim()).filter(s => s !== '')
            .map(line => {
                if (!line.includes(':')) {
                    return { name: path.parse(line).name, path: line };
                }

                const [name, ...paths] = line.split(':');

                return { name, path: paths.join(':') };
            });

        for (const artifact of artifacts) {
            if (!fs.existsSync(artifact.path)) {
                console.log(`Artifact ${artifact.name} not found at ${artifact.path}`);
                core.setFailed(`Artifact ${artifact.name} not found at ${artifact.path}`);
                return;
            }

            console.log(`Uploading artifact ${artifact.name} from ${artifact.path}`);
            await client.uploadArtifact(artifact.name, [artifact.path], path.dirname(artifact.path));
        }

        console.log('Artifact uploads completed');
    } catch (error: any) {
        console.log(error.message);
        core.setFailed(error.message);
    }
}

run();