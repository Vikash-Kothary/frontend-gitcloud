# Gitcloud (Frontend)
> Manage all your Git repositories, organisations, providers from one place

## Folder Structure

The main parts of the projects are:

```
- config:
	- secrets
- docs: Markdown documentation
	- componentss
	- reports
- packages:
	- gitcloud-types: TypeScript types.
	- gitcloud-internals: JS Configs + Build Scripts
		- storybook
		- webpack
		- gulp
	- gitcloud-assets: Default assets.
		- fonts
		- images
	- gitcloud-components: Reuseable UI Components.
		- atoms
		- modules
		- organisms
	- gitcloud-views: Reuseable UI Screens.
		- templates
		- screens
	- gitcloud-routes: Customisable navigation structure.
	- gitcloud-styles: Customisable themes engine.
		- dark
		- light
	- gitcloud-locales: Customisable locales engine.
		- en_UK
		- en_US
	- gitcloud-services: Reuseable Data Layer.
	- gitcloud-client: Frontend client.
		- public
		- src
	- gitcloud-utils: Reuseable utilities.
- scripts: (submodule)
- tests: (optional)
```

## Known Limitations

As per the documentation, `expo-yarn-workspaces` work only on macOS and UNIX based systems, Windows is not supported.