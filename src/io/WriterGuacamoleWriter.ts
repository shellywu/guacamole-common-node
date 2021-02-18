import { Observable, Observer, of, Subject, Subscriber } from "rxjs";
import { GuacamoleInstruction } from "../protocol/GuacamoleInstruction";
import type { GuacamoleWriter } from "./GuacamoleWriter";

export class WriterGuacamoleWriter implements GuacamoleWriter {
    private downCnl: Subject<Uint8Array> = new Subject<Uint8Array>();
    constructor(public readonly writer: (d: Uint8Array) => void) {
        this.downCnl.subscribe(writer);
    }
    write(chunk: Uint8Array): void {
        this.downCnl.next(chunk);
    }
    writeInstruction(instruction: GuacamoleInstruction): void {
        console.debug({writeIst:instruction});
        this.downCnl.next(Buffer.from(instruction.toString()));
    }

}