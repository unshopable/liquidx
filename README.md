# LiquidX

LiquidX is a XML-like syntax extension to Shopify's Liquid template language. It's not intended to run on Shopify's servers, thus needs to be used by preprocessors (transpilers) to transform it into standard Liquid.

```html
<Grid columns="{{ 2 }}">
  <GridItem>
    <Media placeholder="product-1" />
  </GridItem>

  <GridItem>
    <VerticalStack class="h-full" gap="{{ 8 }}" align="center">
      <VerticalStack gap="{{ 2 }}">
        <Text as="h2" variation="heading3">Product 1</Text>

        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut <strong>labore et dolore</strong> magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Text>
      </VerticalStack>

      <button plain icon_right="arrow-right">Learn more</button>
    </VerticalStack>
  </GridItem>
</Grid>
```

![liquidx-preview](https://github.com/unshopable/liquidx/assets/64148345/62a10849-7335-4f97-8968-f1cb013ce58c)

## Table of Contents

- [Motivation](#motivation)
- [Getting started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Motivation

The purpose of LiquidX is to improve the developer experience and speed up the development process tremendously – we're talking 10x here. It achieves this goal by making it almost trivial to implement design systems and component libraries.

Out of the box, Liquid does not support nested structures for components (aka snippets) which makes it hard – or even impossible in some cases – to create really reusable components. LiquidX introduces a concise and familiar syntax for defining tree structures with attributes while adding almost no syntactic footprint.

## Getting started

> **Note**
> The fastest way to implement LiquidX is [Melter](https://github.com/unshopable/melter) in comination with the [LiquidX Melter Plugin](https://github.com/unshopable/melter-plugin-liquidx).

This package exports a `render` function which expects a string. If this string contains LiquidX syntax than it's rendered to Shopify-compatible code.

To illustrate how easy it is to implement LiquidX yourself in your Shopify theme projects, we'll do a quick implementation with [Melter](https://github.com/unshopable/melter).

Assuming that you already installed Melter, create a new file:

```diff
  melter-liquidx
  ├── node_modules
  ├── src
  │   ├── components
  │       └── button.liquid
  │   └── sections
  │       └── section.liquid
  ├── melter.config.js
+ ├── liquidx-plugin.js
  ├── package-lock.json
  └── package.json
```

**liquidx-plugin.js**

```js
const { render } = require('@unshopable/liquidx');
const { Plugin } = require('@unshopable/melter');

class LiquidXPlugin extends Plugin {
  apply(compiler): void {
    compiler.hooks.emitter.tap('LiquidXPlugin', (emitter) => {
      emitter.hooks.beforeAssetAction.tap('LiquidXPlugin', (asset) => {
        if (asset.action !== 'remove') {
          asset.content = Buffer.from(render(asset.content.toString()));
        }
      });
    });
  }
}

module.exports = LiquidXPlugin;
```

Now add this to your melter config:

```diff
+ const LiquidXPlugin = require('./liquidx-plugin.js');

  /** @type {import("@unshopable/melter").MelterConfig} */
  const melterConfig = {
+   plugins: [
+     new LiquidXPlugin(),
+   ],
  };

  module.exports = melterConfig;
```

## Contributing

TODO

## License

[MIT](LICENSE)
