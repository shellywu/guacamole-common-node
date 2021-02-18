import { GuacamoleReader } from "../io/GuacamoleReader";
import { GuacamoleWriter } from "../io/GuacamoleWriter";
import { GuacamoleSocket } from "./GuacamoleSocket";


export interface GuacamoleTunnel {
    acquireReader():GuacamoleReader;
    releaseReader():void;
    hasQueuedReaderThreads():boolean;

    acquireWriter():GuacamoleWriter;
    releaseWriter():void;
    hasQueuedWriterThreads():boolean;
    
    uuid:string;
    socket: GuacamoleSocket;
    isOpen(): boolean;
    close(): void;
}