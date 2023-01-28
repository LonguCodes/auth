# Plugins system

~~This is a short version of readme, for more information see the readme of the plugin system [here](https://github.com/LonguCodes/packages/tree/master/packages/plugin-system-loader)~~

### Idea

Locking down the microservice slows down development and usages, because adding new features to the main repository may take a lot of time.
Instead, plugin system for loading modules dynamically using a single config file.

### Usage

To add a plugin, add `plugins.json` file in the directory, where microservice is running and add plugin definitions.
The file should consist of an array, with each entry representing one plugin.

##### Simple definition

Simples plugin definition is just the name of the NPM package
```json
[
  "@longucodes/auth-plugin-rabbitmq"
]
```

The plugin will be automatically installed by the cli and  loaded into the application.

##### Advanced definition

To add more capabilities, like config or specific version, advanced definition should be used.
```json
[
  {
    "name": "@longucodes/auth-plugin-rabbitmq"
  }
]
```

In addition to name, following properties can be provided.

 - `version` - install specific version of the package
 - `mode` - can be `static` (default) and `dynamic`. Dynamic plugins will not be installed by cli
 - `config` - object with configuration values

##### Config

The config object can contain direct values or read them from environment. 
To use environment variable , the config value should be the name of the environment variable with `$` at the beginning.
All variables consisting only of uppercase letters and `_`, and a `$` will be treated as a environment variable read. 
```json
[
  {
    "name": "@longucodes/auth-plugin-rabbitmq",
    "config": {
      "url": "staticUrl",
      "exchange": "$ENV_VARIABLE"
    }
  }
]
```
Not all plugins are configurable, check documentation of used plugin.

### Ready to go plugins

- [Rabbitmq](../libs/auth-plugin-rabbitmq/README.md) - Publishing events to rabbitmq

### Development

To create your own plugin, create NPM package, that default exports a Nestjs module. If you want your package to be configurable, add static method `forRoot` returning a dynamic module.


