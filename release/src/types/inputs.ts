export interface Inputs {
    readonly files: Inputs.File[];
    readonly changes: Inputs.Change[];
    readonly tag: Inputs.Tag;
    readonly release: Inputs.Release;
    readonly success: boolean;
}

export namespace Inputs {
    export interface Tag {
        readonly base: string;
        readonly prefix: string;
        readonly increment: boolean;
        readonly separator: string;
    }

    export interface File {
        readonly label: string;
        readonly path: string;
    }

    export interface Change {
        readonly commit: string;
        readonly summary: string;
        readonly message: string;
        readonly timestamp: string;
        readonly author: string;
        readonly coauthors: string[];
    }

    export interface Release {
        readonly enabled: boolean;
        readonly name: string;
        readonly body: string;
        readonly prerelease: boolean;
        readonly draft: boolean;
        readonly generate_release_notes: boolean;
        readonly discussion_category_name: string | undefined;
        readonly make_latest: "true" | "false" | "legacy" | undefined;
        readonly info: boolean;
        readonly hook: string | undefined;
        readonly metadata: boolean;
        readonly update_release_data: boolean;
        readonly project: string;
        readonly version: string;
    }
}

export interface PreviousRelease { 
    commit?: string;
    baseTag?: string;
}