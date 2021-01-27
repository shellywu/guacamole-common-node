import { Observable } from "rxjs";
import { GuacamoleInstruction } from "../protocol/GuacamoleInstruction";

export interface GuacamoleWriter{
   write(chunk:Uint8Array):void;
   writeInstruction(instruction:GuacamoleInstruction):void;
}