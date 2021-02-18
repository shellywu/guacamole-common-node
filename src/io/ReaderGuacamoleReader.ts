import { encode } from "querystring";
import { Observable, of, Subject, Subscription } from "rxjs";
import { buffer, bufferWhen, filter, map, multicast, refCount, switchMap, tap, window } from "rxjs/operators";
import { GuacamoleInstruction, OPCODE } from "../protocol/GuacamoleInstruction";
import type { GuacamoleReader } from "./GuacamoleReader";


export class ReaderGuacamoleReader implements GuacamoleReader {
    private _elementEnd = -1;
    private _parseStart = 0;
    private _buffer: string;
    private _bufferLength: number;
    private _mulitcast: Subject<Uint8Array>;
    private _autoReaderCount: Observable<Uint8Array>;
    constructor(public readonly input: Observable<Uint8Array>, bufferLength: number = 4096) {
        this._buffer = "";
        this._bufferLength = bufferLength;
        this._mulitcast = new Subject();
        this._autoReaderCount = input.pipe(multicast(this._mulitcast), refCount());
    }
    available() {
        ///error
        return !this._autoReaderCount;
    }
    read() {
        return this._autoReaderCount
            .pipe(
                map(d => this._parseInstructionSegment(d)),
                filter(d => !!d),
                map(d => d!),
                tap(d=>console.debug({readData:d})),
            );
    }
    private _parseInstructionSegment(d: Uint8Array): string | undefined {
        if (this._parseStart > this._bufferLength && this._elementEnd >= this._parseStart) {
            console.debug("clean buffer");
            this._buffer = this._buffer.substring(this._parseStart);

            // Reset parse relative to truncation
            this._elementEnd -= this._parseStart;
            this._parseStart = 0;
        }
        // Append data to buffer
        this._buffer += Buffer.from(d);
        // While search is within currently received data
        // Parse instruction in buffer
        while (this._elementEnd < this._buffer.length) {
            // If we are waiting for element data
            if (this._elementEnd >= this._parseStart) {

                // We now have enough data for the element. Parse.
                var terminator = this._buffer.substring(this._elementEnd, this._elementEnd + 1);
                let instrucation = "";
                // If last element, handle instruction
                if (terminator == ";") {
                    instrucation = this._buffer.substring(this._parseStart, this._elementEnd + 1);
                }
                else if (terminator != ',')
                    throw new Error("Illegal terminator.");

                // Start searching for length at character after
                // element terminator
                if (!!instrucation) {
                    this._parseStart = this._elementEnd + 1;
                    return instrucation;
                }
            }

            // Search for end of length
            var length_end = this._buffer.indexOf(".", this._elementEnd+1);
            if (length_end != -1) {

                // Parse length
                var length = parseInt(this._buffer.substring(this._elementEnd + 1, length_end));
                if (isNaN(length))
                    throw new Error("Non-numeric character in element length.");

                // Calculate start of element
                //this._parseStart = length_end + 1;

                // Calculate location of element terminator
                this._elementEnd = length_end+1 + length;

            }

            // If no period yet, continue search when more data
            // is received
            else {
                this._elementEnd = this._buffer.length;
                break;
            }

        }
    }

    private _parseInstruction(instructionBuffer: string): GuacamoleInstruction {
        // Start of element
        let elementStart = 0;

        // Build list of elements
        let elements: Array<string> = [];
        while (elementStart < instructionBuffer.length) {

            // Find end of length
            let lengthEnd = instructionBuffer.indexOf('.', elementStart);
            // read() is required to return a complete instruction. If it does
            // not, this is a severe internal error.
            if (lengthEnd == -1)
                throw new Error("Read returned incomplete instruction.");
            let length = parseInt(instructionBuffer.substring(elementStart, lengthEnd));
            if (isNaN(length))
                throw new Error("length error");
            elementStart = lengthEnd + 1;
            elements.push(instructionBuffer.substr(elementStart, length));
            // Parse element from just after period
            elementStart = lengthEnd + length + 1;

            let terminator = instructionBuffer[elementStart];

            // Continue reading instructions after terminator
            elementStart++;

            // If we've reached the end of the instruction
            if (terminator == ';')
                break;

        }

        // Pull opcode off elements list
        let opcode = elements.shift();

        // Create instruction
        let instruction = new GuacamoleInstruction(
            <OPCODE>(opcode!),
            elements
        );

        // Return parsed instruction
        return instruction;
    }
    readInstruction() {
        return this.read().pipe(map(r => this._parseInstruction(r)))
    }
}