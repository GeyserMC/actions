# release-action
An action to create incremented releases in a similar style to Jenkins

## Usage

This action requires a GitHub App with permissions for the repository in which the action will be run. The permissions required are:
- Contents: `Read and Write`
- Metadata: `Read-only`
- Variables: `Read and Write`

The key is provided in the PEM format and can be directly downloaded from the GitHub App settings page. The contents of this file should be stored in full as a secret in the repository or organization.

### Minimal Configuration

```yaml
- uses: Kas-tle/release-action@1.0.0
  with:
    files: |
      testa:file_a.json
      testb:file_b.json
    appID: ${{ secrets.RELEASE_APP_ID }}
    appPrivateKey: ${{ secrets.RELEASE_APP_PK }}
```

### Inputs

| Input                | Description                                                                                                                                            | Default | Required |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | -------- |
| `appID`              | ID of the GitHub App to manage the release system.                                                                                                     |         | `true`   |
| `appPrivateKey`      | Private key of the GitHub App to manage the release system.                                                                                            |         | `true`   |
| `files`              | Comma-separated or newline-separated list of release files with optional "label:" prefix.                                                              |         | `true`   |
| `discussionCategory` | The category to use for the discussion. Defaults to "none" if not specified.                                                                           | `none`  | `false`  |
| `draftRelease`       | Whether or not the release should be a draft. Defaults to false if not specified.                                                                      | `false` | `false`  |
| `ghReleaseNotes`     | Whether or not to let GitHub auto-generate its release notes. Defaults to false if not specified.                                                      | `false` | `false`  |
| `includeReleaseInfo` | Whether or not to include the asset hashes in a release.json file. Defaults to true if not specified.                                                  | `true`  | `false`  |
| `latestRelease`      | Whether or not the release should be marked as the latest release. Defaults to auto if not specified, which will be true unless this is a pre-release. | `auto`  | `false`  |
| `preRelease`         | Whether or not the release is a pre-release. Inferred by the branch if not specified.                                                                  | `auto`  | `false`  |
| `releaseBody`        | A file containing the body of the release. Defaults to the commit changelog if not specified.                                                          | `auto`  | `false`  |
| `releaseChangeLimit` | The maximum number of changes to include in the release body. Defaults to 15 if not specified. Set to -1 to include all changes.                       | `15`    | `false`  |
| `releaseName`        | The title of the release. Defaults to "Build ${tagBase} (${branch})" if not specified.                                                                 | `auto`  | `false`  |
| `tagBase`            | The tag base to use for the release. Auto increment from the last tag will be used if not specified.                                                   | `auto`  | `false`  |
| `tagIncrement`       | If the build tag should be incremented. Defaults to true if not specified and tag is a number.                                                         | `true`  | `false`  |
| `tagPrefix`          | The prefix to use for the tag. Defaults to the branch if not specified.                                                                                | `auto`  | `false`  |
| `tagSeparator`       | The separator to use between the tag prefix and the tag base. Defaults to "-" if not specified.                                                        | `-`     | `false`  |

### Outputs

| Output              | Description                           |
| ------------------- | ------------------------------------- |
| `releaseID`         | The ID of the release.                |
| `releaseAPIURL`     | The API URL of the release.           |
| `releaseAssetsURL`  | The asset URL for the release.        |
| `releaseBrowserURL` | The browser URL of the release.       |
| `uploadAssetsURL`   | The asset upload URL for the release. |