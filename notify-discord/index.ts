import * as core from '@actions/core';
import * as fs from 'fs';
import { Embed, Webhook } from '@vermaysha/discord-webhook';

async function run(): Promise<void> {
    try {
        const status = core.getInput('status');
        const failed = status === 'failure';
        const metadataFile = core.getInput('metadata');
        const includeDownloads = core.getBooleanInput('includeDownloads') && fs.existsSync(metadataFile);
        const downloadsApiUrl = core.getInput('downloadsApiUrl');
        const color = failed ? '#e00016' : '#03fc5a'
        const body = core.getInput('body');
        const time = Math.floor(new Date().getTime() / 1000);
        const repoUrl = `${process.env.GITHUB_SERVER_URL!}/${process.env.GITHUB_REPOSITORY!}`;
        const branch = process.env.GITHUB_REF_NAME!;
        const runId = process.env.GITHUB_RUN_ID!;

        const embed = new Embed()
            .setTitle(process.env.GITHUB_REPOSITORY!)
            .setUrl(repoUrl)
            .setColor(color)
            .setDescription(body);
        
        if (!failed && includeDownloads) {
            const metadata: {
                project: string;
                version: string;
                number: number;
                downloads: {
                    [label: string]: {
                        name: string;
                    }
                }
            } = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
            
            let downloads = '';

            for (const label in metadata.downloads) {
                const url = new URL(`${metadata.project}/versions/${metadata.version}/builds/${metadata.number}/downloads/${label}`, downloadsApiUrl).href;
                downloads += `- [${metadata.downloads[label].name}](${url})\n`;
            }

            embed.addField({ name: `Downloads (Build #${metadata.number})`, value: downloads, inline: false });
        }

        embed
            .addField({ name: '', value: `**Released**: <t:${time}:R>`, inline: true })
            .addField({ name: '', value: `**Status**: ${core.getInput('status')}`, inline: true })
            .addField({ name: '', value: `**Branch**: [${branch}](${repoUrl}/tree/${branch})`, inline: true })
            .addField({ name: '', value: `**Run ID**: [${runId}](${repoUrl}/actions/runs/${runId})`, inline: true });

        new Webhook(core.getInput('discordWebhook'))
            .setUsername('GitHub Actions')
            .setAvatarUrl('https://media.discordapp.net/attachments/472838100951760928/1244710120424738976/github-actions-logo.png')
            .addEmbed(embed)
            .send();
    } catch (error: any) {
        console.log(error.message);
        core.setFailed(error.message);
    }
}

run();