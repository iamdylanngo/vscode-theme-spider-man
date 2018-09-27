const fs = require('fs');
const path = require('path');
const tinycolor = require('tinycolor2');
const yaml = require('js-yaml');

const THEME_DIR = path.join(__dirname, 'theme');
const THEME_YAML_FILE = path.join(__dirname, 'src', 'spiderman.yml');

if (!fs.existsSync(THEME_DIR)) {
    fs.mkdirSync(THEME_DIR);
}

const withAlphaType = new yaml.Type('!alpha', {
    kind: 'sequence',
    construct: data => {
        return data[0] + data[1];
    },
    represent: data => {
        return [data[0], data[1]];
    },
});
const schema = yaml.Schema.create([withAlphaType]);
const standard = fs.readFileSync(THEME_YAML_FILE, 'utf8');

yamlObj = yaml.load(standard, { schema });

yamlObj.colors = Object.keys(yamlObj.colors).reduce((obj, key) => {
    if (yamlObj.colors[key] === null) {
        return obj;
    }
    return Object.assign({}, obj, { [key]: yamlObj.colors[key] });
}, {});

const blue  = standard.replace('#ED1B24','#9EBCE6');

const orange = standard.replace('#ED1B24','#EF6C00');

const pink = standard.replace('#ED1B24','#FE4CF9');

fs.writeFileSync(
    path.join(THEME_DIR, 'spider-man-red.json'),
    JSON.stringify(yaml.load(standard, { schema }), null, 4)
);
fs.writeFileSync(
    path.join(THEME_DIR, 'spider-man-pink.json'),
    JSON.stringify(yaml.load(pink, { schema }), null, 4)
);
fs.writeFileSync(
    path.join(THEME_DIR, 'spider-man-orange.json'),
    JSON.stringify(yaml.load(orange, { schema }), null, 4)
);
fs.writeFileSync(
    path.join(THEME_DIR, 'spider-man-blue.json'),
    JSON.stringify(yaml.load(blue, { schema }), null, 4)
);
