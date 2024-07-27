import * as core from '@actions/core';
import * as path from 'path';
import { globSync } from 'glob';
import { DefaultArtifactClient } from '@actions/artifact';

async function run(): Promise<void> {
    try {
        const client = new DefaultArtifactClient()

        const inputs = core.getInput('artifacts');
        let lines: string[] = inputs.includes('\n') ? inputs.split('\n') : inputs.split(',');
        const artifacts: { name: string; path: string; }[] = [];
        
        for (let line of lines) {
            line = line.trim();
            if (line === '') {
                continue;
            }

            let name: string;
            let filePath: string;

            if (!line.includes(':')) {
                name = path.parse(line).name;
                filePath = line;
            } else {
                name = line.split(':')[0];
                filePath = line.split(':').slice(1).join(':');
            }

            const files = globSync(filePath);
            if (files.length > 1) {
                for (const file of files) {
                    const fileName = path.parse(file).name;
                    artifacts.push({ name: `${name}-${fileName}`, path: file });
                }
            } else if (files.length === 1) {
                artifacts.push({ name, path: files[0] });
            } else {
                console.log(`Artifact ${name} not found at ${filePath}`);
                core.setFailed(`Artifact ${name} not found at ${filePath}`);
                return;
            }
        }

        for (const artifact of artifacts) {
            // Replace invalid characters in artifact name
            const name = artifact.name.replace(/["<>|*?\r\n\\\/]/g, '_');

            console.log(`Uploading artifact ${name} from ${artifact.path}`);
            await client.uploadArtifact(name, [artifact.path], path.dirname(artifact.path));
        }

        console.log('Artifact uploads completed');
    } catch (error: any) {
        console.log(error.message);
        core.setFailed(error.message);
    }
}

run();