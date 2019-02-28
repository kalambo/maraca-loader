import { parse } from 'maraca';

const requireId = () => `xxxREQUIRExxx${Math.random()}${Math.random()}xxx`;

export default function(file) {
  const dependencies = {};
  const result = file.replace(/image:\s*"([^"]+)"/g, (_, image) => {
    if (image.startsWith('http')) return `image: "${image}"`;
    const id = requireId();
    dependencies[id] = image;
    return `image: "${id}"`;
  });
  return `export default ${JSON.stringify(parse(result))}`.replace(
    /xxxREQUIRExxx[0-9\.]+xxx/g,
    id => {
      const path = dependencies[id];
      return '" + require(' + JSON.stringify(path) + ') + "';
    },
  );
}
