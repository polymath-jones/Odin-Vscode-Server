import * as xmldom from "../lib/xmldom";
import * as vscode from 'vscode';
var instance!: ComponentService;


export class ComponentService {

    parser = new xmldom.DOMParser();
    serializer = new xmldom.XMLSerializer();
    tags = ["<a ", "<a>", "</a>", "<abbr>", "<abbr ", "</abbr>", "<acronym>", "<acronym ", "</acronym>", "<address>", "<address ", "</address>", "<applet>", "<applet ", "</applet>", "<area>", "<area ", "</area>", "<article>", "</article>", "<article ", "<aside>", "<aside ", "</aside>", "<audio>", "<audio ", "</audio>", "<b>", "</b>", "<base>", "<base ", "</base>", "<basefont>", "<basefont ", "</basefont>", "<bdi>", "</bdi>", "<bdi ", "<bdo>", "</bdo>", "<bdo ", "<big>", "<big ", "</big>", "<blockquote>", "<blockquote ", "</blockquote>", "<body>", "<body ", "</body>", "<br ", "<br />", "<br>", "<br/>", "</br>", "<button>", "<button ", "</button>", "<canvas>", "</canvas>", "<canvas ", "<caption>", "<caption ", "</caption>", "<center>", "<center ", "</center>", "<cite>", "<cite ", "</cite>", "<code>", "<code ", "</code>", "<col>", "<col ", "</col>", "<colgroup>", "<colgroup ", "</colgroup>", "<datalist>", "<datalist ", "</datalist>", "<dd>", "</dd>", "<dd ", "<del>", "<del ", "</del>", "<details>", "<details ", "</details>", "<dfn>", "</dfn>", "<dfn ", "<dialog>", "<dialog ", "</dialog>", "<dir>", "</dir>", "<dir ", "<div>", "<div ", "</div>", "<dl>", "</dl>", "<dl ", "<dt>", "</dt>", "<dt ", "<em>", "<em ", "</em>", "<embed>", "</embed>", "<embed ", "<fieldset>", "<fieldset ", "</fieldset>", "<figcaption>", "</figcaption>", "<figcaption ", "<figure>", "<figure ", "</figure>", "<font ", "</font>", "<font>", "<footer>", "</footer>", "<footer ", "<form>", "</form>", "<form ", "<frame>", "</frame>", "<frame ", "<frameset>", "<frameset ", "</frameset>", "<h1>", "</h1>", "<h1 ", "<h2>", "</h2>", "<h2 ", "<h3>", "</h3>", "<h3 ", "<h4>", "</h4>", "<h4 ", "<h5>", "</h5>", "<h5 ", "<h6>", "</h6>", "<h6 ", "<head>", "</head>", "<head ", "<header>", "<header ", "</header>", "<hr>", "<hr ", "</hr>", "<html>", "</html>", "<html ", "<i>", "</i>", "<iframe>", "<iframe ", "</iframe>", "<img>", "</img>", "<img ", "<input>", "</input>", "<input ", "<ins>", "<ins ", "</ins>", "</kbd>", "<kbd>", "<kbd ", "<label>", "<label ", "</label>", "<legend>", "<legend ", "</legend>", "<li ", "<li>", "</li>", "<link>", "<link ", "</link>", "<main>", "<main ", "</main>", "<map>", "</map>", "<map ", "<mark>", "</mark>", "<mark ", "<meta>", "</meta>", "<meta ", "<meter>", "</meter>", "<meter ", "<nav>", "</nav>", "<nav ", "<noframes>", "</noframes>", "<noframes ", "<noscript>", "<noscript ", "</noscript>", "<object>", "<object ", "</object>", "<ol>", "</ol>", "<ol ", "<optgroup>", "</optgroup>", "<optgroup ", "<option>", "</option>", "<option ", "<output>", "<output ", "</output>", "<p>", "</p>", "<p ", "<param>", "<param ", "</param>", "<pre>", "</pre>", "<pre ", "<progress>", "<progress ", "</progress>", "<q>", "</q>", "<q ", "<rp>", "</rp>", "<rp ", "<rt>", "<rt ", "</rt>", "<ruby>", "</ruby>", "<ruby ", "<s>", "</s>", "<s ", "<samp>", "</samp>", "<samp ", "<section>", "</section>", "<section ", "<select>", "</select>", "<select ", "<small>", "<small ", "</small>", "<source>", "</source>", "<source ", "<span>", "<span ", "</span>", "<strike>", "</strike>", "<strike ", "<strong>", "<strong ", "</strong>", "<style>", "</style>", "<style ", "<sub>", "<sub ", "</sub>", "<summary>", "</summary>", "<summary ", "<sup>", "<sup ", "</sup>", "<table ", "<table>", "</table>", "<tbody>", "</tbody>", "<tbody ", "<td>", "<td ", "</td>", "<textarea>", "<textarea ", "</textarea>", "<tfoot>", "</tfoot>", "<tfoot ", "<th>", "</th>", "<th ", "<thead>", "</thead>", "<thead ", "<time>", "<time ", "</time>", "<title>", "</title>", "<title ", "<tr>", "<tr ", "</tr>", "<track>", "</track>", "<track ", "<tt>", "</tt>", "<tt ", "<u>", "</u>", "<ul ", "<ul>", "</ul>", "<var>", "<var ", "</var>", "<video>", "</video>", "<video ", "<wbr>", "<wbr ", "</wbr>"];


    private constructor() {
        this.registerAll();
    }
    async save(id: string, source: string) {

        if (id !== "app") {
            let root = vscode.workspace.workspaceFolders![0].uri;
            let mapUri = vscode.Uri.joinPath(root, "/component.map.json");
            await vscode.workspace.fs.readFile(mapUri).then(async file => {
                const config = new Map<string, { uri: vscode.Uri; name: string; }>(JSON.parse(file.toString()));
                const componenturi = config.get(id)?.uri;
                const te = new TextEncoder();
                await vscode.workspace.fs.writeFile(componenturi!, te.encode(source));

            });
        } else {
            const te = new TextEncoder();
            let path = await vscode.workspace.findFiles("src/App.vue");
            await vscode.workspace.fs.writeFile(path[0]!, te.encode(source));

        }

    }
    async registerAll() {
        vscode.window.showInformationMessage('Registering components...');

        await vscode.workspace.findFiles("**/src/**/*.{vue}").then(files => {

            let componentMap = new Map<string, { uri: vscode.Uri, name: string }>();


            files.forEach(async file => {


                /**
                 *  wrapping algorithms:: wrap components with components as root with div, 
                 * wrap if-else and loop elements with div
                 */


                await vscode.workspace.fs.readFile(file).then(array => {

                    const templateBlockRegex = /(<template(\s|\S)*<\/template>)/gm;
                    const remXmlns = /[\w]*xmlns(\s|\S)*?"(\s|\S)*?"/gm;

                    let source = array.toString();
                    let name = file.toString().split('/').pop()!;
                    let te = new TextEncoder();

                    let document = this.parser.parseFromString(source.match(templateBlockRegex)![0], 'text/html');
                    let children = document.getElementsByTagNameNS('*', '*');

                    let rootid = "";

                    for (let i = 0; i < children.length; i++) {

                        const elt = children.item(i);
                        const tag = elt?.tagName.toLocaleLowerCase()!;
                        const valid = this.tags.includes(`<${tag}>`);
                        const id = this.generateID();
                        const componentId = this.generateID();


                        if (i === 1) {

                            if ((!valid && elt?.tagName !== "template")) {

                                const wrapper = document.createElement('div');
                                elt?.parentNode?.appendChild(wrapper);
                                wrapper.appendChild(elt!);
                                wrapper?.setAttribute("component-id", componentId);
                                wrapper?.setAttribute("odin-component", "true");
                            } else {
                                elt?.setAttribute("component-id", componentId);
                                elt?.setAttribute("odin-component", "true");
                            }
                        }
                        else if (!valid && elt?.tagName !== "template") {
                            elt?.setAttribute("odin-id", id);


                        } else if (valid && elt?.tagName !== "template") {
                            elt?.setAttribute("odin-id", id);

                        }
                    }


                    rootid = children.item(1)?.getAttribute("component-id")!;
                    componentMap.set(rootid, { uri: file, name: name });



                    source = source.replace(templateBlockRegex, this.serializer.serializeToString(document));
                    source = source.replace(remXmlns, "");
                    vscode.workspace.fs.writeFile(file, te.encode(source));



                });
                this.createConfigFile();
                this.createComponentMap(componentMap);

            });
        });

        vscode.window.showInformationMessage('Component registeration successfully completed');
    }
    createComponentMap(componentMap: Map<string, { uri: vscode.Uri; name: string; }>) {


        const json = JSON.stringify(Array.from(componentMap.entries()));
        const te = new TextEncoder();

        let root = vscode.workspace.workspaceFolders![0].uri;
        let configUri = vscode.Uri.joinPath(root, "/component.map.json");

        vscode.workspace.fs.writeFile(configUri, te.encode(json));
    }
    createConfigFile() {
        const config = {
            version: "0.0.0",
            framework: "vue",
            lastRun: this.getDate()
        };

        const json = JSON.stringify(config);
        const te = new TextEncoder();

        let root = vscode.workspace.workspaceFolders![0].uri;
        let configUri = vscode.Uri.joinPath(root, "/odin.config.json");

        vscode.workspace.fs.writeFile(configUri, te.encode(json));
    }
    generateID(): string {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        var gid = s4() + s4() + "_" + s4();
        return gid;
    }
    getDate(): string {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();

        return (mm + '/' + dd + '/' + yyyy);
    }
    static init() {
        instance = new ComponentService();
    }

    static getInstance(): ComponentService {
        if (instance) {
            return instance;
        }
        else {
            throw new Error("component not instantiated");
        }

    }
}