# Previous Release Action

An action to get outputs for the previous release for GeyserMC projects.

## Usage

### Minimal Configuration

```yaml
- uses: GeyserMC/actions/previous-release@master
  with:
    branch: "master" # The branch to get the previous release for (defaults to the current branch)
    data: ${{ vars.RELEASEACTION_PREVRELEASE }} # The variable that contains the previous release data
```
or
```yaml
- uses: GeyserMC/actions/previous-release@master
  with:
    branch: "master" # The branch to get the previous release for (defaults to the current branch)
    appID: ${{ secrets.RELEASE_APP_ID }} # The ID of the GitHub App to manage the release system
    appPrivateKey: ${{ secrets.RELEASE_APP_PK }} # The private key of the GitHub App in PEM format
```

### Inputs

| Input           | Description                                                 | Default            | Required |
| --------------- | ------------------------------------------------------------| ------------------ | -------- |
| `branch`        | The branch to use for the previous release.                 | The current branch | `false`  |
| `data`          | The JSON data of the previous release.                      |                    | `false`  |
| `appID`         | ID of the GitHub App to manage the release system.          |                    | `false`   |
| `appPrivateKey` | Private key of the GitHub App to manage the release system. |                    | `false`  |

## Outputs

| Output            | Description                                                   |
|-------------------|---------------------------------------------------------------|
| `curentRelease`   | If numeric, the incremented base tag of the previous release. |
| `previousRelease` | The base tag of the previous release.                         |
| `previousTag`     | The tag of the previous release.                              |
| `previousCommit`  | The commit of the previous release.                           |