import { AbstractGuacamoleTunnel } from "./AbstractGuacamoleTunnel";
import { v4 as uuidV4 } from 'uuid';
import { GuacamoleSocket } from "./GuacamoleSocket";
export class SimpleGuacamoleTunnel extends AbstractGuacamoleTunnel {
    constructor(public guacdSocket: GuacamoleSocket) {
        super();
    }
    get socket() {
        return this.guacdSocket;
    }
    get uuid() {
        return uuidV4();
    }
}