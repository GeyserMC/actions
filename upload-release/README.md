# Upload Release Action

An action to upload releases via SCP for GeyserMC projects.

## Usage

This action requires an instance of the [GeyserMC Downloads API](https://github.com/GeyserMC/bibliothek) (forked from the Paper Downloads API) with an instance of [bibliothek-build-monitor](https://github.com/GeyserMC/bibliothek-build-monitor) watching for uploads. An SSH host, username, and private key are required and should be stored as secrets in the repository or organization. It is also assumed that a metadata.json file is present generated by the release action.

### Minimal Configuration

```yaml
- uses: GeyserMC/actions/upload-release@master
  with:
    files: | # Newline-separated list of files to upload with optional "label:" prefix
      testa:file_a.json
      testb:file_b.json
    host: ${{ secrets.DOWNLOADS_SERVER_IP }} # The IP address of the server to upload to
    privateKey: ${{ secrets.DOWNLOADS_PRIVATE_KEY }} # The private key to use for authentication
    username: ${{ secrets.DOWNLOADS_USERNAME }} # The username to use for authentication
```

### Inputs

| Input        | Description                                    | Default         | Required |
| ------------ | -----------------------------------------------| --------------- | -------- |
| `directory`  | The directory to upload the files to.          | `auto`          | `false`  |
| `files`      | The files to upload.                           |                 | `true`   |
| `host`       | The hostname to connect to over SCP.           |                 | `true`   |
| `metadata`   | The metadata file to attach to the release.    | `metadata.json` | `false`  |
| `port`       | The port to connect to over SCP.               | `22`            | `false`  |
| `privateKey` | The private key to use for the SCP connection. |                 | `true`   |
| `username`   | The username to use for the SCP connection.    |                 | `true`   |