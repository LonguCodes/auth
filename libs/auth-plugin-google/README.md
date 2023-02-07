# auth-plugin-google

### Purpose

This plugin allows for easy google social login integration into your application through the Auth Core

### Usage

To use this plugin, add it to the `plugins.json` configuration file to be automatically picked up by the plugin loader.

#### Config

The plugin requires 3 vales to be provided through the `config` property
 - `redirectUri` - redirection url matching one used for google login
 - `clientId` - client id from google cloud console
 - `clientSecret` - client secret from google could console

