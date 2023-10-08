import path from "path";
import fs from "fs";
import crypto from 'crypto';
import * as parse from "../util/parse";
import { Inputs } from "../types/inputs";
import { ReleaseResponse } from "src/types/release";
import { Repo } from "src/types/repo";
import { UploadInfo } from "../types/files";
import { Readable } from "stream";
import { OctokitApi } from "../types/auth";

export async function uploadFiles(api: OctokitApi, inputs: Inputs, release: ReleaseResponse, repoData: Repo) {
    const uploads = await uploadProvidedFiles(api, inputs, release, repoData);

    if (!inputs.release.info) {
        return;
    }

    await uploadReleaseData(api, inputs, release, repoData, uploads);

    return;
}

async function uploadProvidedFiles(api: OctokitApi, inputs: Inputs, release: ReleaseResponse, repoData: Repo): Promise<Record<string, UploadInfo>> {
    const { owner, repo } = repoData;
    const { files } = inputs;
    const uploads: Record<string, UploadInfo> = {};
    const duplicateLabels = files.map(f => f.label).some((label, index, self) => self.indexOf(label) !== index);

    next: for (const file of files) {
        if (!fs.existsSync(file.path)) {
            console.log(`File ${file.path} does not exist, skipping`);
            continue next;
        }

        const name = path.basename(file.path);
        const data = fs.createReadStream(file.path);
        const size = fs.statSync(file.path).size;

        const fileResponse = await api.rest.repos.uploadReleaseAsset({
            headers: {
                'content-length': size,
                'content-type': 'application/octet-stream',
            },
            owner,
            repo,
            release_id: release.data.id,
            url: release.data.upload_url,
            name,
            data: data as any,
        });

        if (!inputs.release.info) {
            continue next;
        }

        const hashSha256 = (filePath: string) => new Promise<string>((resolve, reject) => {
            const hash = crypto.createHash('sha256')
            const rs = fs.createReadStream(filePath);
            rs.on('error', reject)
            rs.on('data', chunk => hash.update(chunk))
            rs.on('end', () => resolve(hash.digest('hex')))
        })

        const sha256 = await hashSha256(file.path);

        const info: UploadInfo = {
            name,
            id: fileResponse.data.id.toString(),
            url: fileResponse.data.browser_download_url,
            sha256
        }

        if (duplicateLabels) {
            uploads[`${file.label}-${parse.stringHash(file.path)}`] = info;
        }

        uploads[file.label] = info;
    }

    console.log(`Uploaded ${files.length} files to ${release.data.html_url}`);
    return uploads;
}

async function uploadReleaseData(api: OctokitApi, inputs: Inputs, release: ReleaseResponse, repoData: Repo, uploads: Record<string, UploadInfo>) {
    const { owner, repo, branch } = repoData;

    const releaseData = {
        owner,
        repo,
        branch,
        id: release.data.id.toString(),
        url: release.data.html_url,
        build: parse.isPosInteger(inputs.tag.base) ? parseInt(inputs.tag.base) : inputs.tag.base,
        tag: inputs.tag.prefix + inputs.tag.separator + inputs.tag.base,
        timestamp: Date.now().toString(),
        prerelease: inputs.release.prerelease,
        changes: inputs.changes,
        downloads: uploads
    };

    // Now upload the release data as release.json
    const data = Buffer.from(JSON.stringify(releaseData, null, 4), 'utf8');
    const name = 'release.json';
    const size = data.byteLength;

    await api.rest.repos.uploadReleaseAsset({
        headers: {
            'content-length': size,
            'content-type': 'application/octet-stream',
        },
        owner,
        repo,
        release_id: release.data.id,
        url: release.data.upload_url,
        name,
        data: Readable.from(data) as any,
    });

    console.log(`Uploaded release data to ${release.data.html_url}`);
}