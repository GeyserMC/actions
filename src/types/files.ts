import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export type UploadResponse = RestEndpointMethodTypes["repos"]["uploadReleaseAsset"]["response"];

export interface UploadInfo extends FileInfo {
    id: string;
    url: string;
}

export interface FileInfo {
    name: string;
    sha256: string;
}

export interface Upload {
    reponse: UploadResponse;
    info: UploadInfo;
}