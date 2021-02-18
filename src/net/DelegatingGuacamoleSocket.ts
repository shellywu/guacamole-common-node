import { GuacamoleReader } from "../io/GuacamoleReader";
import { GuacamoleWriter } from "../io/GuacamoleWriter";
import { GuacamoleSocket } from "./GuacamoleSocket";

export class DelegatingGuacamoleSocket implements GuacamoleSocket{
    /**
     *
     */
    constructor(public socket:GuacamoleSocket) {
        
    }
    get protocol(){
        return this.socket.protocol;
    };
    get reader(){
        return this.socket.reader;
    };
    get writer(){
        return this.socket.writer;
    };
    close(): void {
        throw new Error("Method not implemented.");
    }
    isOpen(): boolean {
        throw new Error("Method not implemented.");
    }
    
}