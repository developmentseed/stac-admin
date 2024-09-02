# STAC admin plugin system

    Status: IN REVIEW
    Deciders: @danielfdsilva @emmanuelmathot @j08lue @oliverroick
    Date: 2024-08-26


## Context and Problem Statement

The form to edit the STAC metadata may differ from instance to instance and from collection to collection. Ideally the form should be easily customizable and extensible to suit the different needs.

## Decision Drivers

The chosen option should allow:
- Each instance controls what fields are available in the editor.
- Through instance-specific plugins, instances can define additional custom fields if required.

## Decision

The structure of the form is defined by a plugin system. Each plugin is responsible for a section of the editor and defines the fields that should be shown.
This allows for a more modular approach to the editor. Each instance can use a different set of plugins to define the editor's structure. These can be custom plugins that the implementers of a given instance develop or pre-made plugins from the community.

Drawing inspiration from the JSON schema spec, each plugin defines a schema to create the editor. For each field type there is a corresponding default widget to render it, but plugins can define their own widgets (in the form of a React component) to be used by the fields.

We will provide and maintain plugins to that support editing meta data specified by a variety of commonly used STAC extensions.

### Consequences

#### Pros
With a plugin system the editor can be easily customized to suit the needs of each instance. Implementors have the option to use a pre-made solution and have something up and running quickly or to develop their own plugins with editing widgets that suit their needs.

#### Cons
Having plugins define a schema, inevitably results in some duplication, given that the schema for the different extensions already exists defined in the STAC spec. However this schema may not be a one-to-one match to the desired form structure. Additionally, implementing a full JSON schema renderer would be a significant amount of work and would likely be overkill for the needs of the editor.

Nevertheless, this can be mitigated, by having the plugin query the STAC spec on initialization to get a base schema from which to derive the editor schema.

## More Information

The initial proposal pro the plugin system was outlined in the [Flexible plugin system for the STAC metadata editor](https://github.com/EOEPCA/data-access/issues/73) issue.
