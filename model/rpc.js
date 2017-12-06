import JsonRPC from 'simple-jsonrpc-js'

export default class AriaJsonRPC {
    static connectToServer(url, token) {
        const jrpc = new JsonRPC()
        const socket = new WebSocket(url)
        
        jrpc.toStream = (_msg) => { socket.send(_msg) }
        socket.onmessage = (event) => { jrpc.messageHandler(event.data) }
        socket.onclose = (event) => { console.log("connection closed") }
        return new Promise(res => {
            socket.onopen = () => {
                res(new AriaJsonRPC(url, token, jrpc, socket))
            }
        })
    }
    
    constructor(url, token, jrpc, socket) {
        this.url = url
        this.token = token
        this.jrpc = jrpc
        this.socket = socket
        this.responseCallbacks = new Set()
        this.errorCallbacks = new Set()
    }

    addResponseCallback(func) {
        this.responseCallbacks.add(func)
    }

    removeResponseCallback(func) {
        this.responseCallbacks.delete(func)
    }

    addErrorCallback(func) {
        this.errorCallbacks.add(func)
    }

    removeErrorCallback(func) {
        this.errorCallbacks.delete(func)
    }
    
    call(method, args, silent=false) {
        // console.log(method)
        // console.log([`token:${this.token}`].concat(args))
        const callback = (funcs, args) => {
            if (!silent) {
                console.log(funcs)
                for (let f of funcs) {
                    f(...args)
                }
            }
        }

        return new Promise((res, rej) => {
            this.jrpc.call(method, [`token:${this.token}`].concat(args))
                .then(result => {
                    callback(this.responseCallbacks, [method, args, result])
                    res(result)
                }).catch(error => {
                    callback(this.errorCallbacks, [method, args, error])
                    rej(error)
                })
        })
    }
    
    getAllTasks() {
        return Promise.all([
            this.call("aria2.tellActive", [], true),
            this.call("aria2.tellWaiting", [0, 100], true),
            this.call("aria2.tellStopped", [0, 100], true)
        ]).then( values => {
            const tasks = values.reduce((a, b) => a.concat(b))
            console.log(tasks)
            return tasks
        })
    }
}