import * as vscode from 'vscode';
import * as express from 'express';
import * as http from "http";
import { Server, Socket } from 'socket.io';
import { ComponentService } from './componentService';
var instance!: ControllerService;


export class ControllerService {


    private constructor() {


        /**
         * handle getroot component:: none
         * handle getcomponent:: odin-id
         * handle writecomponent:: text, odin-id
         *  */


        var cors = require('cors');

        const app = express();
        const server = http.createServer(app);
        const io = new Server(server);
        app.use(express.json());
        app.use(cors());

        app.get('/component/:id', (req, res) => {

            const id = req.params.id;
            this.sendComponent(res, id);
        });

        app.get('/root', (req, res) => {
            this.sendRoot(res);
        });

        app.post('/save', function (request, response) {

            const data = request.body;
            try {
                ComponentService.getInstance().save(data.id, data.source);
                response.send({ "message": "Save successfull" });
            } catch (error) {
                response.send({ "message": "An error occured. Save failed" });
            }

        });

        app.get('/socket', (req, res) => {
            res.sendFile(__dirname + '/socket.io.js');
        });


        ////////////////////////////////////////////////////

        ////////////////////////////////////////////////////



        io.on('connection', (socket: Socket) => {
            socket.on('chat message', (msg: any) => {
                console.log('message: ' + msg);
            });
        });

        server.listen(3333, () => {
            console.log('listening on *:3333');
        });
    }
    async sendComponent(res: any, id: string) {
        try {
            if (id !== "app") {
                let root = vscode.workspace.workspaceFolders![0].uri;
                let mapUri = vscode.Uri.joinPath(root, "/component.map.json");
                await vscode.workspace.fs.readFile(mapUri).then(async file => {
                    const config = new Map<string, { uri: vscode.Uri; name: string; }>(JSON.parse(file.toString()));
                    const componenturi = config.get(id)?.uri;
                    await vscode.workspace.fs.readFile(componenturi!).then(array => {
                        const source = array.toString();
                        res.json({ source: source });
                    });


                });
            }else{
                await this.sendRoot(res);
            }

        } catch (e) {
            res.json({ error: "Something went wrong. Check id parameter" });
        }

    }
    async sendRoot(res: any) {
        let path = vscode.workspace.findFiles("src/App.vue");
        await path.then(async file => {
            await vscode.workspace.fs.readFile(file[0]).then(array => {
                const source = array.toString();
                res.json({ source: source });
            });

        });

    }
    static init() {
        instance = new ControllerService();
    }

    static getInstance(): ControllerService {
        if (instance) {
            return instance;
        }
        else {
            throw new Error("ControllerService not instantiated");
        }

    }
}