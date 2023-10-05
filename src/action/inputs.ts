import * as core from '@actions/core'
import fs from 'fs';
import * as exec from '@actions/exec';
import { Inputs, PreviousRelease } from '../types/inputs';
import * as parse from '../util/parse';
import { Repo } from '../types/repo';
import os from 'os';
import path from 'path';
import { OctokitApi } from '../types/auth';

export async function getInputs(api: OctokitApi, repoData: Repo): Promise<Inputs> {
    const prevRelease: PreviousRelease = await getPrevRelease(api, repoData);

    const files = getFiles();
    const changes = await getChanges(api, prevRelease, repoData);
    const tag = await getTag(repoData, prevRelease);
    const release = await getRelease(api, changes, tag, repoData);

    console.log(`Using ${files.length} files, ${changes.length} changes, tag ${tag.base}, release ${release.name}`);
    return { files, changes, tag, release };
}

async function getPrevRelease(api: OctokitApi, repoData: Repo): Promise<PreviousRelease> {
    const { owner, repo, branch } = repoData;
    const variable = 'releaseAction_prevRelease';

    try {
        const varResponse = await api.rest.actions.getRepoVariable({ owner, repo, name: variable });
        const reponse: Record<string, { c: string, t: string } | undefined> = JSON.parse(varResponse.data.value);
        const prevRelease = reponse[branch];
        
        if (prevRelease == null) {
            return { commit: undefined, baseTag: undefined };
        }

        return { commit: prevRelease.c, baseTag: prevRelease.t };
    } catch (error) {
        await api.rest.actions.createRepoVariable({ owner, repo, name: variable, value: '{}' });
        return { commit: undefined, baseTag: undefined };
    }

}

function getFiles(): Inputs.File[] {
    const files = core.getInput('files', { required: true });

    return parse.parseMultiInput(files).map(file => {
        if (!file.includes(':')) {
            return { label: path.parse(file).name.toLowerCase(), path: file };
        }

        const [label, ...paths] = file.split(':');

        console.log(`Using label ${label} for file path ${paths.join(':')}`);
        return { label, path: paths.join(':') };
    });
}

async function getRelease(api: OctokitApi, changes: Inputs.Change[], tag: Inputs.Tag, repoData: Repo): Promise<Inputs.Release> {
    const { owner, repo, branch } = repoData;

    const body = await getReleaseBody(changes);
    const prerelease = await getPreRelease(repoData);
    const name = getName(tag, branch);
    const draft = core.getBooleanInput('draftRelease');
    const generate_release_notes = core.getBooleanInput('ghReleaseNotes');
    const discussion_category_name = await getDiscussionCategory(api, owner, repo);
    const make_latest = getMakeLatest(prerelease);
    const info = core.getBooleanInput('includeReleaseInfo');

    console.log(`Using release name ${name} with prerelease: ${prerelease}, draft: ${draft}, generate release notes: ${generate_release_notes}, discussion category: ${discussion_category_name}, make latest: ${make_latest}, include release info: ${info}`);
    return { name, body, prerelease, draft, generate_release_notes, discussion_category_name, make_latest, info };
}

async function getTag(repoData: Repo, prevRelease: PreviousRelease): Promise<Inputs.Tag> {
    const { branch } = repoData;

    const base = core.getInput('tagBase');
    const separator = core.getInput('tagSeparator');
    const prefix = core.getInput('tagPrefix') == 'auto' ? branch : core.getInput('tagPrefix');
    const increment = core.getBooleanInput('tagIncrement');

    if (base === 'auto') {
        if (prevRelease.baseTag != null && parse.isPosInteger(prevRelease.baseTag)) {
            const buildNumber = parseInt(prevRelease.baseTag) + (increment ? 1 : 0);
            return { base: buildNumber.toString(), prefix, separator, increment };
        }

        if (prevRelease.baseTag == null) {
            return { base: '1', prefix, separator, increment };
        }
    }

    if (parse.isPosInteger(base) && increment) {
        const buildNumber = parseInt(base) + 1;
        return { base: buildNumber.toString(), prefix, separator, increment };
    }

    console.log(`Using release tag ${prefix}${separator}${base} with increment: ${increment}`);
    return { base, prefix, separator, increment };
}

async function getChanges(api: OctokitApi, prevRelease: PreviousRelease, repoData: Repo): Promise<Inputs.Change[]> {
    const { branch, defaultBranch } = repoData;
    let commitRange = '';

    if (prevRelease.commit == null) {
        if (branch === defaultBranch) {
            commitRange = `${process.env.GITHUB_SHA!}^..HEAD`;
        } else {
            const compareReponse = await api.rest.repos.compareCommits({ owner: repoData.owner, repo: repoData.repo, base: defaultBranch, head: branch });
            const firstCommit = compareReponse.data.commits[0].sha;
            commitRange = `${firstCommit}^..HEAD`;
        }
    } else {
        commitRange = `${prevRelease.commit}..HEAD`;
    }

    const { stdout, stderr } = await exec.getExecOutput('git', [
        'log',
        '--pretty=format:"%H%x00%s%x00%b%x00%ct%x00"',
        commitRange
    ]);

    if (stderr !== '') {
        throw new Error('Could not get changes due to:' + stderr);
    }

    const changes: Inputs.Change[] = [];

    for (const line of stdout.split('\0' + '"' + os.EOL)) {
        const [commit, summary, message, timestamp] = line.substring(1).split('\0');

        changes.push({ commit, summary, message, timestamp });
    }

    console.log('');
    console.log(`Found ${changes.length} changes in commit range ${commitRange}`);
    return changes;
}

async function getReleaseBody(changes: Inputs.Change[]): Promise<string> {
    const bodyPath = core.getInput('releaseBodyPath');

    if (!fs.existsSync(bodyPath)) {
        // Generate release body ourselves
        let changelog = `## Changes${os.EOL}`;

        const changeLimit = core.getInput('releaseChangeLimit');
        if (parse.isPosInteger(changeLimit)) {
            changes.length = Math.min(changes.length, parseInt(changeLimit));
        }

        for (const change of changes) {
            changelog += `- ${change.summary} (${change.commit.slice(0, 7)})${os.EOL}`;
        }

        return changelog;
    }

    return fs.readFileSync(bodyPath, { encoding: 'utf-8' });
}

async function getPreRelease(repoData: Repo): Promise<boolean> {
    const { branch, defaultBranch } = repoData;

    const preRelease = core.getInput('preRelease');

    if (preRelease === 'auto') {
        return defaultBranch !== branch;
    }

    return preRelease === 'true';
}

function getName(tag: Inputs.Tag, branch: string): string {
    const name = core.getInput('releaseName')
        .replace('${tagBase}', tag.base)
        .replace('${tagPrefix}', tag.prefix)
        .replace('${tagSeparator}', tag.separator)
        .replace('${branch}', branch);

    if (name === 'auto') {
        return `Build ${tag.base} (${branch})`;
    }

    return name;
}

async function getDiscussionCategory(_api: OctokitApi, _owner: string, _repo: string): Promise<string | undefined> {
    const category = core.getInput('discussionCategory');

    // Currently the api to create one if it doesn't exist is not available
    // Add here when it is

    if (category === 'none') {
        return undefined;
    }

    return category;
}

function getMakeLatest(prerelease: boolean): "true" | "false" | "legacy" | undefined {
    const make_latest = core.getInput('latestRelease');

    switch (make_latest) {
        case "true":
        case "false":
        case "legacy":
            break;
        case "auto":
            return prerelease ? "false" : "true";
        default:
            return undefined;
    }

    return make_latest;
}