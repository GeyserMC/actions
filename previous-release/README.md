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

### Inputs

| Input    | Description                                 | Default            | Required |
| -------- | --------------------------------------------| ------------------ | -------- |
| `branch` | The branch to use for the previous release. | The current branch | `false`  |
| `data`   | The JSON data of the previous release.      |                    | `true`   |

## Outputs

| Output            | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `curentRelease`   | If numeric, the incremented tag of the previous release. |
| `previousRelease` | The tag of the previous release.                         |
| `previousCommit`  | The commit of the previous release.                      |