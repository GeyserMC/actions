# Setup Gradle Composite Action

An action to set up a Gradle environment with the checked-out repository, Java, and Gradle wrapper validation for GeyserMC projects.

## Usage

This action makes use of the following actions:
- [actions/checkout](https://github.com/actions/checkout)
- [gradle/actions/wrapper-validation](https://github.com/gradle/wrapper-validation-action)
- [actions/setup-java](https://github.com/actions/setup-java)
- [gradle/actions/setup-gradle](https://github.com/gradle/actions/setup-gradle)

### Minimal Configuration

```yaml
- uses: GeyserMC/actions/setup-gradle-composite@master
  with:
    setup-java.java-version: '17' # The Java version to use
```

### Inputs

| Input                                    | Description                                 | Default                    | Required |
| ---------------------------------------- | --------------------------------------------| -------------------------- | -------- |
| `checkout.repository`                    | The repository to checkout.                 |                            | `false`  |
| `checkout.ref`                           | The ref to checkout.                        |                            | `false`  |
| `checkout.submodules`                    | Whether to checkout submodules.             | `recurse`                  | `false`  |
| `checkout.fetch-depth`                   | The depth to fetch the repository.          |                            | `false`  |
| `setup-java.java-version`                | The Java version to use.                    |                            | `true`   |
| `setup-java.distribution`                | The Java distribution to use.               | `temurin`                  | `false`  |
| `setup-gradle.cache-read-only`           | Whether to make the Gradle cache read-only. | `false`                    | `false`  |
| `setup-gradle.gradle-home-cache-cleanup` | Whether to clean up the Gradle home cache.  | `true`                     | `false`  |