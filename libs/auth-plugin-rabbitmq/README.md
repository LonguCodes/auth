# auth-plugin-rabbitmq

### Purpose

This plugin allows for event publishing to a rabbitmq exchange by the Auth Core

### Usage

To use this plugin, add it to the `plugins.json` configuration file to be automatically picked up by the plugin loader.

#### Config

The plugin requires 2 values to be provided through the `config` property
- `url` - url pointing to the rabbitmq server
- `exchange` - exchange to be used for publishing

It can also be supplied by additional configuration:
 - `exchangeType` - type of exchange to be used, default `topic`
 - `prefix` - prefix for the routing key when publishing, default `''`
 - `assert` - should the exchange be created during boot, default `false`
