export interface Inputs {
    readonly files: Inputs.File[];
    readonly changes: Inputs.Change[];
    readonly tag: Inputs.Tag;
    readonly release: Inputs.Release;
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
    }

    export interface Release {
        readonly name: string;
        readonly body: string;
        readonly prerelease: boolean;
        readonly draft: boolean;
        readonly generate_release_notes: boolean;
        readonly discussion_category_name: string | undefined;
        readonly make_latest: "true" | "false" | "legacy" | undefined;
        readonly info: boolean;
    }
}

export interface PreviousRelease { 
    commit?: string;
    baseTag?: string;
}