# Tractor 2.0 + Rspack + MF + Zephyr Sample


A micro frontends sample implementation of [The Tractor Store](https://micro-frontends.org/tractor-store/) built with Module Federation and React. It's based on the [Piral version](https://github.com/piral-samples/tractor-v2).

**Live Demo:** TODO

## About This Implementation

### Technologies

List of techniques used in this implementation.

| Aspect                     | Solution                                  |
| -------------------------- | ----------------------------------------- |
| 🛠️ Frameworks, Libraries   | [React], [Module Federation], [Rspack]    |
| 📝 Rendering               | SPA                                       |
| 🐚 Application Shell       | react-router                              |
| 🧩 Client-Side Integration | Module Federation                         |
| 🧩 Server-Side Integration | *none*                                    |
| 📣 Communication           | Custom Events, Slots                      |
| 🗺️ Navigation              | SPA, One MF per Team, react-router        |
| 🎨 Styling                 | Self-Contained CSS (No Global Styles)     |
| 🍱 Design System           | None                                      |
| 🔮 Discovery               | [Zephyr Cloud]                            |
| 🚚 Deployment              | Static Page                               |
| 👩‍💻 Local Development       | Rspack's devServer                        |

[React]: https://react.dev/
[Module Federation]: https://module-federation.io/
[Rspack]: https://rspack.dev/
[Zephyr Cloud]: https://zephyr-cloud.io/

### Limitations

This implementation is deliberately kept simple to focus on the micro frontends aspects. URLs are hardcoded, components could be more DRY and no linting, testing or type-safety is implemented. In a real-world scenario, these aspects should be addressed properly.

### Performance

Several performance optimizations could still be applied, however, in the out-of-the-box state with three micro frontends and multiple components / pages included we'll end up with a lighthouse score of 100/100, which is great.

## How to run locally

### Installation

Clone this repository. Then use `pnpm` to bootstrap the mono repo. Make sure to have `pnpm` (v9) installed for this.

Run the following command inside the repository:

```sh
pnpm install
```

### Running the Code

Now you can run all micro frontends locally:

```sh
pnpm serve
```

### Deploy to Zephyr Cloud

You can deploy to Zephyr Cloud building the packages:

```sh
WITH_ZE=true pnpm build
```

## More Information

The [Piral documentation page](https://docs.piral.io/guidelines/tutorials/23-monorepo) has a tutorial on the sample that this example was based on. Make sure to follow and understand the tutorial before going deep into this sample.
