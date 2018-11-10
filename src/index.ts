import * as fs from 'fs-extra';
import * as path from 'path';

const requireId = () => `xxxREQUIRExxx${Math.random()}${Math.random()}xxx`;

export default async function() {
  const cb = this.async();
  try {
    const index = this.resourcePath
      .split('\\')
      .pop()
      .split('/')
      .pop();
    const folder = this.resourcePath.slice(0, -index.length);
    const fileNames = (await fs.readdir(folder)).filter(f => f.endsWith('.ma'));
    fileNames.forEach(f => this.addDependency(path.join(folder, f)));
    const dependencies = {};
    const modules = (await Promise.all<string>(
      fileNames.map(f => fs.readFile(path.join(folder, f), 'utf-8')),
    )).reduce(
      (res, file, i) => ({
        ...res,
        [fileNames[i].slice(0, -3)]: file.replace(
          /"([^"]*\.(png|svg|jpg|gif))"/g,
          (_, image) => {
            const id = requireId();
            dependencies[id] = image;
            return `"${id}"`;
          },
        ),
      }),
      {},
    );
    const result = { modules, index: index.slice(0, -3) };
    cb(
      null,
      `export default ${JSON.stringify(result)}`.replace(
        /xxxREQUIRExxx[0-9\.]+xxx/g,
        id => {
          const path = dependencies[id];
          return '" + require(' + JSON.stringify(path) + ') + "';
        },
      ),
    );
  } catch (error) {
    cb(error);
  }
}
