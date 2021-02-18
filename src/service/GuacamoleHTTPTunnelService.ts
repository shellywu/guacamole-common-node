import { GuacamoleTunnel } from "../net/GuacamoleTunnel";
import { IncomingMessage, ServerResponse } from 'http';
import {URL} from 'url';
import { GuacamoleHTTPTunnelMap } from "./GuacamoleHTTPTunnelMap";
import { filter, map } from "rxjs/operators";
import { from, of } from "rxjs";

export abstract class GuacamoleHTTPTunnelService {
    readonly READ_PREFIX = "read:";

    /**
     * The prefix of the query string which denotes a tunnel write operation.
     */
    readonly WRITE_PREFIX = "write:";

    /**
     * The length of the read prefix, in characters.
     */
    readonly READ_PREFIX_LENGTH = this.READ_PREFIX.length;

    /**
     * The length of the write prefix, in characters.
     */
    readonly WRITE_PREFIX_LENGTH = this.WRITE_PREFIX.length;

    /**
     * The length of every tunnel UUID, in characters.
     */
    readonly UUID_LENGTH = 36;
    _tunnelMap: GuacamoleHTTPTunnelMap = new GuacamoleHTTPTunnelMap();
    abstract doConnect(request: IncomingMessage): GuacamoleTunnel;
    handleTunnelRequest=(request: IncomingMessage, response: ServerResponse)=> {
        let url =new URL(request.url!,`http://${request.headers.host!}`);
        console.debug(url);
        if (url.search == null)
            throw "No query string provided.";
        let query=url.search.substring(1);
        // If connect operation, call doConnect() and return tunnel UUID
        // in response.
        if (query.startsWith("connect")) {

            let tunnel = this.doConnect(request);
            if (tunnel != null) {

                // Register newly-created tunnel
                this.registerTunnel(tunnel);

                try {
                    // Ensure buggy browsers do not cache response
                    response.setHeader("Cache-Control", "no-cache");
                    // Send UUID to client
                    response.write(tunnel.uuid);
                    response.end();
                }
                catch (e) {
                    throw "IOException";
                }

            }

            // Failed to connect
            else
                throw "No tunnel created.";

        }

        // If read operation, call doRead() with tunnel UUID, ignoring any
        // characters following the tunnel UUID.
        else if (query.startsWith(this.READ_PREFIX))
            this.doRead(request, response, query.substr(
                this.READ_PREFIX_LENGTH,
                this.UUID_LENGTH));

        // If write operation, call doWrite() with tunnel UUID, ignoring any
        // characters following the tunnel UUID.
        else if (query.startsWith(this.WRITE_PREFIX))
            this.doWrite(request, response, query.substr(
                this.WRITE_PREFIX_LENGTH,
                this.UUID_LENGTH));

        // Otherwise, invalid operation
        else
            throw "Invalid tunnel operation: " + url;
    }
    _getTunnel(uuid: string) {
        let t = this._tunnelMap.get(uuid);
        if (!t) {
            throw `tunnel not exsit uuid:${uuid}`
        }
        return t;
    }
    doWrite=(request: IncomingMessage, response: ServerResponse, uuid: string)=> {
        of(this._getTunnel(uuid)).pipe(
            filter(t => !!t),
            map(t => t.acquireWriter()),
        ).subscribe(w => {
            request.on('data', d => {
                w.write(d);
            });
        })
    }
    doRead=(request: IncomingMessage, response: ServerResponse, uuid: string)=> {
        console.debug('read tunnel:'+uuid);
        let tunnel = this._getTunnel(uuid);
        if (!tunnel.isOpen()) {
            throw new Error("Tunnel is closed");
        }
        tunnel.acquireReader().read().pipe(filter(m => !!m)).subscribe(m => {
            response.setHeader("Content-type", "application/octet-stream");
            response.setHeader("Cache-Control", "no-cache");
            response.setDefaultEncoding('utf-8');
            response.write(m);
            response.end();
        });
    }
    registerTunnel(tunnel: GuacamoleTunnel) {
        this._tunnelMap.put(tunnel.uuid, tunnel);
    }
}