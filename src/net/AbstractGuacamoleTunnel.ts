import { GuacamoleSocket } from "./GuacamoleSocket";
import { GuacamoleTunnel } from "./GuacamoleTunnel";

export abstract class AbstractGuacamoleTunnel implements GuacamoleTunnel {
    abstract socket: GuacamoleSocket;
    abstract uuid: string;

    acquireReader() {
        return this.socket.reader;
    }

    releaseReader() {

    }

    hasQueuedReaderThreads() {
        return false;
    }

    acquireWriter() {
        return this.socket.writer;
    }

    releaseWriter() {

    }

    hasQueuedWriterThreads() {
        return false;
    }
    close() {
        this.socket.close();
    }
    isOpen() {
        return this.socket.isOpen();
    }
}