# Upload Multi Artifact Action

An action to upload multiple action artifacts for GeyserMC projects.

## Usage

This action works similarly to [actions/upload-artifact](https://github.com/actions/upload-artifact), but allows multiple artifacts to be uploaded at once. This allows for the action to be more easily reused across multiple projects. The action will always fail if any specified artifact does not exist.

### Minimal Configuration

```yaml
- uses: GeyserMC/actions/upload-multi-artifact@master
  with:
    artifacts: | # Newline-separated list of files to upload with optional artifact name separated by a colon
      File A:file_a.json
      File B:file_b.json
```

### Inputs

| Input        | Description              | Default | Required |
| ------------ | -------------------------| ------- | -------- |
| `artifacts`  | The artifacts to upload. |         | `true`   |