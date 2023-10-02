import { RestEndpointMethodTypes } from "@octokit/action";

export type UploadResponse = RestEndpointMethodTypes["repos"]["uploadReleaseAsset"]["response"];

export interface UploadInfo {
    name: string;
    id: string;
    url: string;
    sha256: string;
}

export interface Upload {
    reponse: UploadResponse;
    info: UploadInfo;
}