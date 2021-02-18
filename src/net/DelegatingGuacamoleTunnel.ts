import { GuacamoleReader } from "../io/GuacamoleReader";
import { GuacamoleWriter } from "../io/GuacamoleWriter";
import { GuacamoleSocket } from "./GuacamoleSocket";
import { GuacamoleTunnel } from "./GuacamoleTunnel";

export class DelegatingGuacamoleTunnel implements GuacamoleTunnel {
    /**
     *
     */
    constructor(public tunnel: GuacamoleTunnel) {

    }
    get uuid(): string {
        return this.tunnel.uuid;
    }
    get socket(): GuacamoleSocket {
        return this.tunnel.socket;
    }
    acquireReader(): GuacamoleReader {
        return this.tunnel.acquireReader();
    }
    releaseReader(): void {
        return this.tunnel.releaseReader();
    }
    hasQueuedReaderThreads(): boolean {
        return this.tunnel.hasQueuedReaderThreads();
    }
    acquireWriter(): GuacamoleWriter {
        return this.tunnel.acquireWriter();
    }
    releaseWriter(): void {
        return this.tunnel.releaseWriter();
    }
    hasQueuedWriterThreads(): boolean {
        return this.tunnel.hasQueuedReaderThreads();
    }

    isOpen(): boolean {
        return this.tunnel.isOpen();
    }
    close(): void {
        this.tunnel.close();
    }

}