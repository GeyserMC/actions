import { Octokit } from "@octokit/core";
import { Api } from "@octokit/plugin-rest-endpoint-methods";

export type OctokitApi = Octokit & Api;