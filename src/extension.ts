import * as vscode from 'vscode';
import { WorkspaceService } from './services/workspaceService';

/**
 * *service starts
 * if workspace !exists:: prompt user if no workspace (workspaceService), 
 * if !empty:: check odin.config.json file (workspaceService), 
 * if odin.config.json !exists:: prompt user [workspace does not contain odin project] -> [Do you want to create a new project]
 * if multiple:: select first and check (workspaceService)
 * if empty:: start odin webview project wizard. create boilerplate (workspaceService)
 * start component registeration and misc (ComponentService)
 * run shell process(ShellService)
 * start websocket server and wait for page load event(ControllerService)
 * send response(EmitterService)
 * */

export const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "ODIN" is now active!');
	const cmdId = 'ODIN.helloWorld';

	context.subscriptions.push(vscode.commands.registerCommand(cmdId, async () => {

		vscode.window.showInformationMessage('ODIN extension successully service started');
		WorkspaceService.init();
		myStatusBarItem.text = '⚡ • Odin service running • ⚡';

	}));

	context.subscriptions.push(myStatusBarItem);
	myStatusBarItem.text = '⚡ • Run Odin builder • ⚡';
	myStatusBarItem.command = cmdId;
	myStatusBarItem.show();

}

export function deactivate() {
	WorkspaceService.getInstance().destroy();
	console.log('killing process');
}