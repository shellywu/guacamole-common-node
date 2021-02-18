import { DelegatingGuacamoleTunnel } from "../net/DelegatingGuacamoleTunnel";

export class GuacamoleHTTPTunnel extends DelegatingGuacamoleTunnel {
    _lassAccessedTime: number = 0;
    access() {
        this._lassAccessedTime = Date.now();
    }
    get lastAccessedTime() {
        return this._lassAccessedTime;
    }
}