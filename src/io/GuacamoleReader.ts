import { Observable } from "rxjs";
import { GuacamoleInstruction } from "../protocol/GuacamoleInstruction";

export interface GuacamoleReader{
    available():boolean;
    read():Observable<Buffer|string>;
    readInstruction(): Observable<GuacamoleInstruction>;
}