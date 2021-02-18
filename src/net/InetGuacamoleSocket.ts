import { Socket } from 'net';
import { AsyncSubject, fromEvent, fromEventPattern, Observable, Subject, Subscriber } from 'rxjs';
import { tap,multicast, refCount } from 'rxjs/operators'
import { ReaderGuacamoleReader } from '../io/ReaderGuacamoleReader';
import { WriterGuacamoleWriter } from '../io/WriterGuacamoleWriter';
import type { GuacamoleReader } from '../io/GuacamoleReader';
import type { GuacamoleSocket } from './GuacamoleSocket';
import type { GuacamoleWriter } from '../io/GuacamoleWriter';

export class InetGuacamoleSocket implements GuacamoleSocket {
    private _socket: Socket;
    private _reader: GuacamoleReader;
    private _writer: GuacamoleWriter;
    readonly SOCKET_TIMEOUT = 15000;
    // private _down: Subject<Uint8Array>;
    constructor(public hostname: string, public port: number) {
        this._socket = new Socket();
        // this._down = new Subject<Uint8Array>();

        this._socket.setTimeout(this.SOCKET_TIMEOUT);
        this._socket.setDefaultEncoding('utf-8');
        
        // fromEvent<any>(this._socket,'error').subscribe(d=>this._down.error(d));

        this._socket.connect(port, hostname);
        this._reader = new ReaderGuacamoleReader(fromEvent<Buffer>(this._socket,'data'));
        this._writer = new WriterGuacamoleWriter((d) => {
            //console.debug(d);
            if (d) {
                this._socket.write(d);
            }
        });
    }
    get protocol() {
        return 'guacamole'
    };
    get reader() {
        return this._reader;
    }
    get writer() {
        return this._writer;
    }

    close(): void {
        this._socket.destroy();
    }
    isOpen(): boolean {
        return !this._socket.connecting && !this._socket.destroyed;
    }
}