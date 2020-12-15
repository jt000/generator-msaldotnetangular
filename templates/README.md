# README

## Introduction

This is the UX and Web API for hosting catalog onboarding for diagnostics. It is arranged into 2 different projects. The Angular web client is developed in the `<%= webapifoldername %>` folder and the WebAPI is developed in the `<%= webclientfoldername %>` folder.

## Getting Started

### Software dependencies

#### [Azure Artifacts Credential Provider](https://github.com/microsoft/artifacts-credprovider#azure-artifacts-credential-provider)

Credential provider for installing nuget packages from Azure DevOps.

To install, run: `powershell -ExecutionPolicy Bypass "IEX((New-Object  System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/microsoft/artifacts-credprovider/master/helpers/installcredprovider.ps1'))"`

#### [@angular/cli](https://cli.angular.io/)

Angular CLI nuget package for building, serving, and generating angular code. 

To install, run: `npm install -g @angular/cli`

## Running Locally

To get the entire project running locally run `run.cmd`.

### Debugging Client Code

1. Open the browser's dev tools by pressing F12
2. In the "sources" tab on the "Filesystem" panel, click the "+" button and select your `<%= webclientfoldername %>` folder.
3. Set a breakpoint & you should be set. You can even do full development in this tool (however, it is easier in VSCode).

### Debugging Web API Code

1. Close the command window hosting the CatalogWebApi (recognizable by the "Microsoft.Hosting.Lifetime" text in the window)
2. Open `<%= webapifoldername %>\<%= webapiname %>.csproj` in visual studio
3. Make sure the "webapi" launch profile is selected in the debug dropdown (just to the right of the "Any CPU" dropdown).
4. Press "F5" to start the application in debug mode.

### Other helpful client commands using Angular CLI

`ng generate`: Creates new code for angular. Can be used to create a component, directive, pipe, service, class, guard, interface, enum, or module.

`ng serve --ssl --open`: Builds & serves the files with the angular web server with SSL and opens the browser once ready.

`ng lint`: Runs the "linter" to validate syntax. Adding the `--fix` arguement will auto-fix any issues that are easily fixable (ex, trailing whitespace).

`ng test`: Runs all the unit tests with *.spec.ts using karma.

`ng e2e`: Runs all end to end tests using protractor.

`ng build`: Builds the angular application & places it in the /dist folder.

More commands or parameters can be found by running `ng help` or `ng <command> --help`.

### Links for components used in the client code

- [Angular.io](https://angular.io/docs) - SPA client framework
- [rxjs](https://rxjs-dev.firebaseapp.com/api/) - Library for managing Observable components
- [Bootstrap v4](https://getbootstrap.com/docs/4.5/getting-started/introduction/) - UX library for styling, layout, and UI Components
- [Ng-Bootstrap](https://ng-bootstrap.github.io/#/getting-started) - Angular wrapper for some bootstrap components
- [Font Awesome](https://fontawesome.com/icons?d=gallery&m=free) - Free icon library
- [Fort Awesome](https://fortawesome.com/sets/starter) - Anguar wrapper around Font Awesome

## Environments

Environmental options relate to our stages to include the following options:

- Development: Local development on our dev machines
- Production: Prod stage on azure

### CatalogClient

In the CatalogClient the above environments show up as different `environment.*.ts` files to define different settings for each. These settings are defined at compile time which is why the official build in `ApplicationBuild.yaml` builds each environment separately and stores them in the `<%= webapifoldername %>\wwwroot\<env>` folder.

Note that the `environment.ts` file defines properties for the local development environment. See table below.

### CatalogWebApi

The CatalogWebApi the environments show up in the `appsettings.*.json` files. The environment is defined at runtime by using the ASPNETCORE_ENVIRONMENT environment variable.

Note that the `appsettings.json` defines production settings in contrast with the CatalogClients's `environment.ts` which is for the local development environment. See table below.

```text
Environment | CatalogClient       | CatalogWebApi
------------|---------------------|-------------------------------
Local Dev   | environment.ts      | appsettings.Development.json
Prod        | environment.prod.ts | appsettings.json
```