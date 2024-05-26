# Notify Discord Action

An action to notify a Discord channel of a deployment for GeyserMC projects.

## Usage

This action requires a Discord webhook URL to post the release to. This can be obtained by creating a webhook in the Discord channel settings. The webhook URL should be stored as a secret in the repository or organization.

### Minimal Configuration

```yaml
- uses: GeyserMC/actions/notify-discord@master
  if: always() # If you wish to run even when previous steps have failed
  with:
    body: "This is a test message." # The body of the message to send in markdown, such as a changelog or release notes
    discordWebhook: ${{ secrets.DISCORD_WEBHOOK }} # The Discord webhook URL to post the message to
    status: ${{ job.status }} # The status of the job, such as "success" or "failure"
```

### Inputs

| Input              | Description                                              | Default                                      | Required |
| ------------------ | ---------------------------------------------------------| -------------------------------------------- | -------- |
| `body`             | The body of the message to send to Discord.              |                                              | `true`   |
| `discordWebhook`   | Discord webhook to post the release to.                  |                                              | `true`   |
| `downloadsApiUrl`  | The URL to the downloads API.                            | `https://download.geysermc.org/v2/projects/` | `false`  |
| `includeDownloads` | Whether or not to include download links in the message. | `true`                                       | `false`  |
| `metadata`         | Metadata file containing release data.                   | `metadata.json`                              | `false`  |
| `status`           | The status of the deployment.                            |                                              | `true`   |