"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const xmldom = require("xmldom");
const fs = require("fs");
let path = "test.vue";
let source = fs.readFileSync(path, "utf-8");
let parser = xmldom.DOMParser;
let serializer = xmldom.XMLSerializer;
const tempRegex = /(<template(\s|\S)*<\/template>)/gm;
const importRegex = /(?<=<script)(>)(\s*)(?=(\s|\S))/gm;
const addRegex = /(?<=<script>(\s|\S)*components:(\s)*)({)(\s*)/gm;
const remXmlns = /[\w]*xmlns(\s|\S)*?"(\s|\S)*?"/gm;
let document = new parser().parseFromString(source.match(tempRegex)[0], 'text/html');
let now = Date.now();
let child = new parser().parseFromString(`<divo> asfasfk </divo>`);
let root = document.getElementsByClassName("test").item(0);
console.log((_b = (_a = document.getElementById("omo")) === null || _a === void 0 ? void 0 : _a.attributes.item(1)) === null || _b === void 0 ? void 0 : _b.name);
let sibling = root === null || root === void 0 ? void 0 : root.childNodes.item(1);
root === null || root === void 0 ? void 0 : root.insertBefore(child, sibling);
let output = new serializer().serializeToString(document);
source = source.replace(tempRegex, output);
source = source.replace(importRegex, ">\nimport MessageBox from './MessageBox';\n");
source = source.replace(addRegex, "{" + "MessageBox" + ",");
source = source.replace(remXmlns, "");
fs.writeFileSync(path, source, "utf-8");
console.log(Date.now() - now + "ms");
// var spawn = require('child_process').spawn;
// var process = spawn('echo "boy" && vue ui', {shell: true});
// process.stderr.on('data', function (data: { toString: () => any; }) {
//   console.error("STDERR:", data.toString());
// });
// process.stdout.on('data', function (data: { toString: () => any; }) {
//   console.log("STDOUT:", data.toString());
// });
// process.on('exit', function (exitCode: string) {
//   console.log("Child exited with code: " + exitCode);
// });
//# sourceMappingURL=xml.js.map