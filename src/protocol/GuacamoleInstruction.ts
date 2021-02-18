export type OPCODE="select"|"args"|"ready"|"image"|"size"|"audio"|"video"|"connect"|"timezone";
export class GuacamoleInstruction {
    private _opcode: OPCODE;
    private _args: Array<string>;
    private _protocolForm: string | undefined;
    constructor(opcode:OPCODE, args: Array<string>) {
        this._opcode = opcode;
        this._args = args;
    }
    get opcode() { return this._opcode }
    get args() { return this._args }
    toString() {

        if (!this._protocolForm) {
            let f = [];
            f.push(`${this.opcode.length}.${this.opcode}`);
            this.args.forEach(a => {
                f.push(`${a.length}.${a}`)
            });
            
            this._protocolForm = f.join(",")+";";
        }
        return this._protocolForm;
    }
}