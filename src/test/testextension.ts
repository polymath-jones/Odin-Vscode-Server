import * as vscode from 'vscode';
import * as child_process from 'child_process';
import treeKill = require('tree-kill');
import { JSDOM } from "jsdom";

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

let shell!: child_process.ChildProcessWithoutNullStreams;


export function activate(context: vscode.ExtensionContext) {

	//	console.log(vscode..);

	console.log('Congratulations, your extension "ODIN" is now active!');
	let disposable = vscode.commands.registerCommand('ODIN.helloWorld', async () => {

		
				const express = require('express');
				const app = express();
				const http = require('http');
				const server = http.createServer(app);
				const { Server } = require("socket.io");
				const io = new Server(server);
		
				app.get('/', (req: any, res: any) => {
					res.sendFile(__dirname + '/doc.html');
				});	

				app.get('/socket', (req: any, res: any) => {
					res.sendFile(__dirname + '/socket.io.js');
				});		
				

				io.on('connection', (socket:any) => {
					socket.on('chat message', (msg:any) => {
					  console.log('message: ' + msg);
					});
				  });
		
				server.listen(3000, () => {
					console.log('listening on *:3000');
				});
		
		vscode.window.showInformationMessage('ODIN extension successully service started');
		// var spawn = startShell(vscode.workspace.workspaceFolders![0].uri.fsPath);
		// shell = spawn;

		vscode.workspace.onDidOpenTextDocument(e => {
			//addComponent();
			console.log(e);

		});


		vscode.workspace.onDidCloseTextDocument(e => {
			console.log(e);
			//treeKill(spawn.pid);
		});

		// testjsdom()
		// addComponent()



		/* await docs.then(data=>{
			for(let fl of data){
				console.log(fl);
				
			}
			
		}); */
	});

	context.subscriptions.push(disposable);
}
function startShell(dir: string): child_process.ChildProcessWithoutNullStreams {

	const shell = child_process.spawn(`cd ${dir} &&  npm run serve`, { shell: true });
	shell.stderr.on('data', (data: { toString: () => any; }) => {
		console.error("STDOUT:", data.toString());
	});
	shell.stdout.on('e', (data: { toString: () => any; }) => {
		console.error("STDOUT:", data.toString());
	});
	shell.on('exit', (exitCode: string) => {
		console.log("Child exited with code: " + exitCode);
	});
	return shell;
}

function testjsdom() {
	let doc = JSDOM.fragment(`<img
 v-bind:alt="cafe.name"
 class="ourcoffee-tile-image"
 v-bind:src="cafe.imageLink"
 v-bind:title="cafe.name"
/>`);
	//console.log(doc.firstElementChild?.attributes);

}

async function addComponent() {

	//let components = vscode.workspace.findFiles("**/*.{vue}");

		await vscode.workspace.findFiles("**/*.{vue}").then(files => {
			files.forEach(async file =>{
				console.log(file.toString().split('/').pop());

			await vscode.workspace.fs.readFile(file).then(file => {
					
				const templateBlockRegex = /(<template(\s|\S)*<\/template>)/gm;

				let doc = JSDOM.fragment(file.toString().match(templateBlockRegex)![0]);
				console.log(doc.firstElementChild);
			
				});

				
			});
		});
	


	/* let root = vscode.workspace.workspaceFolders![0].uri;
	let appUri = vscode.Uri.joinPath(root, "/src/components/test.vue");

	let te = new TextEncoder();
	let src = `<template>
    <div>Im here niggasd</div>
</template>

<script lang ="ts">
</script>

<style scoped>

</style>

`;
	vscode.workspace.fs.writeFile(appUri, te.encode(src)); */
	/* 
		vscode.workspace.fs.readFile(appUri).then(file => {
			console.log(file.toString());
	
		});
	 */

	/* 
	
		let path =  vscode.workspace.findFiles("src/App.vue");
		path.then(file=>{
			console.log(file);
			
		}) */

	/* components.then(data => {
		for (let uri of data) {
			 vscode.workspace.fs.readFile(uri).then(file=>{
				let source = file.toString();
				console.log(source);
				
			 });
			

		}
	}); */
}

export function deactivate() {
	console.log('killing process');
	treeKill(shell.pid);
}