import { from, interval, Observable, of, Subscription } from "rxjs";
import { filter, flatMap, map, switchMap } from "rxjs/operators";
import { GuacamoleTunnel } from "../net/GuacamoleTunnel";
import { GuacamoleHTTPTunnel } from "./GuacamoleHTTPTunnel"

export class GuacamoleHTTPTunnelMap {
    readonly TUNNEL_TIMEOUT = 15;
    executor: Subscription;
    tunnels: Map<string, GuacamoleHTTPTunnel>;
    constructor() {
        this.tunnels = new Map();
        this.executor = interval(this.TUNNEL_TIMEOUT * 1000)
            .pipe(
                switchMap(t => from(this.tunnels)),
                filter(([k, t]) => Date.now() - t.lastAccessedTime > this.TUNNEL_TIMEOUT)
            )
            .subscribe(t => {
                this.clearTunnel(t);
            });
    }
    clearTunnel([k, v]: [string, GuacamoleHTTPTunnel]) {
        this.tunnels.delete(k);
        v.close();
    }

    get(uuid: string) {
        let v = this.tunnels.get(uuid);
        if (v)
            v.access();
        return v;
    }

    put(uuid: string, tunnel: GuacamoleTunnel) {
        this.tunnels.set(uuid, new GuacamoleHTTPTunnel(tunnel));
    }

    remove(uuid: string) {
        this.tunnels.delete(uuid);
    }
    shutdown() {
        this.executor.unsubscribe();
    }
}