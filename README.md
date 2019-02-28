# Maraca Loader

Loads and parses Maraca files.

## Install

```
yarn add maraca-loader --dev
```

or

```
npm install maraca-loader --save-dev
```

## Usage

**index.js**

```ts
import maraca from 'maraca';

const source = require('start.ma');

maraca(source, data => console.log(data));
```

**webpack.config.js**

```ts
{
  "module": {
    "rules": [
      {
        "test": /\.ma$/,
        "use": ["maraca-loader"]
      }
    ]
  }
}
```
