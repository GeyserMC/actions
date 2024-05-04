export interface BaseRepo {
    readonly owner: string;
    readonly repo: string;
    readonly branch: string;
    readonly url: string;
}

export interface Repo extends BaseRepo {
    readonly defaultBranch: string;
    readonly lastCommit: string;
}