import * as vscode from 'vscode';
import { ComponentService } from './componentService';
import { ControllerService } from './controllerService';
import {myStatusBarItem} from '../extension';
var instance!: WorkspaceService;


export class WorkspaceService {

    currentTerminal!: vscode.Terminal;
    private constructor() {
        this.getConfig();
    }
  
    async getConfig() {
        let root = vscode.workspace.workspaceFolders![0].uri;
        let configUri = vscode.Uri.joinPath(root, "/odin.config.json");

        try {
            await vscode.workspace.fs.readFile(configUri).then(file => {
                const config = JSON.parse(file.toString());
                ComponentService.init();
                this.startService();
            });
        }
        catch (e) {
            vscode.window.showInformationMessage('Workspace does not contain odin project!!!');
            vscode.window
                .showInformationMessage(
                    "Do you want to create new project?",
                    ...["Yes", "No"]
                )
                .then((answer) => {
                    if (answer === "Yes") {
                        this.createNew(root);
                    }
                });
        }
    }
    startService() {
        vscode.window.showInformationMessage("Starting Odin Service...");
        let terminal = vscode.window.createTerminal({ name: "server" });
                terminal.show();
                let cmds = `$error.clear(); try{  npm run dev } catch{ "Error occured" }; if($error){ exit 1 } else{ exit 0 }`;
                terminal.sendText(cmds);
                this.currentTerminal = terminal;

                vscode.window.onDidCloseTerminal(e => {

                    if (e.name === "server") {
                        if (e.exitStatus?.code === 1) {
                            vscode.window.showInformationMessage('An error occured');
                            myStatusBarItem.text = '⚡ • Run Odin builder • ⚡';

                        } else if(e.exitStatus?.code === 0) {}
                        
                        vscode.window.showInformationMessage("Odin Service has terminated");
                        myStatusBarItem.text = '⚡ • Run Odin builder • ⚡';

                    }

                });
                ControllerService.init();
    }
    async createNew(path: vscode.Uri) {

        await vscode.workspace.fs.readDirectory(path).then(async dir => {
            if (dir.length > 0) {
                vscode.window.showInformationMessage('Workspace is not empty!!! Please run Odin in empty workspace');
                myStatusBarItem.text = '⚡ • Run Odin builder • ⚡';
            }
            else {
                vscode.window.showInformationMessage('Creating new project...');

                const boilerPlate = __dirname + "/boilerplate";
                const workspace = path.fsPath;
                const fse = require('fs-extra');
                fse.copySync(boilerPlate, workspace);

                let terminal = vscode.window.createTerminal({ name: "installer" });
                terminal.show();
                let cmds = `$error.clear(); try{  npm i  } catch{ "Error occured" }; if($error){ exit 1 } else{ exit 0 }`;
                terminal.sendText(cmds);
                this.currentTerminal = terminal;

                vscode.window.onDidCloseTerminal(e => {

                    if (e.name === "installer") {
                        if (e.exitStatus?.code === 1) {
                            vscode.window.showInformationMessage('An error occured');
                            myStatusBarItem.text = '⚡ • Run Odin builder • ⚡';
                        } else if(e.exitStatus?.code === 0) {
                            vscode.window.showInformationMessage('Successfully created project');
                            ComponentService.init();
                            this.startService();
                        }
                    }

                });
            }
        });

    }
    destroy(){
        myStatusBarItem.text = '⚡ • Run Odin builder • ⚡';
        this.currentTerminal.dispose();
    }

    static init() {
        instance = new WorkspaceService();
    }

    static getInstance(): WorkspaceService {
        if (instance) {
            return instance;
        }
        else {
            throw new Error("workspace not instantiated");
        }

    }
}