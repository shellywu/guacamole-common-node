import type { GuacamoleReader } from "../io/GuacamoleReader";
import type { GuacamoleWriter } from "../io/GuacamoleWriter";

export interface GuacamoleSocket{
    protocol:string;
    reader:GuacamoleReader;
    writer:GuacamoleWriter;
    close():void;
    isOpen():boolean;
}