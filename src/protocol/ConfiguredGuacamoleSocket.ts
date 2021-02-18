import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from "constants";
import { timingSafeEqual } from "crypto";
import { from, Observable, of } from "rxjs";
import { concatMap, filter, map, switchMap, tap, toArray } from "rxjs/operators";
import { GuacamoleReader } from "../io/GuacamoleReader";
import { DelegatingGuacamoleSocket } from "../net/DelegatingGuacamoleSocket";
import { GuacamoleSocket } from "../net/GuacamoleSocket";
import { GuacamoleClientInformation } from "./GuacamoleClientInformation";
import { GuacamoleConfiguration } from "./GuacamoleConfiguration";
import { GuacamoleInstruction } from "./GuacamoleInstruction";
import { GuacamoleProtocolCapability } from "./GuacamoleProtocolCapability";
import { GuacamoleProtocolVersion } from "./GuacamoleProtocolVersion";

export class ConfiguredGuacamoleSocket extends DelegatingGuacamoleSocket {
    id$: Observable<string>;
    get connectionId$() {
        return this.id$;
    }
    /**
     *
     */
    constructor(public socket: GuacamoleSocket,
        private readonly config: GuacamoleConfiguration = new GuacamoleConfiguration(),
        private readonly protocolVersion: GuacamoleProtocolVersion = GuacamoleProtocolVersion.VERSION_1_0_0,
        private readonly info: GuacamoleClientInformation = new GuacamoleClientInformation()
    ) {
        super(socket);
        let reader = socket.reader;
        let writer = socket.writer;
        let selectArg = config.connectionId;
        if (!selectArg) {
            selectArg = config.protocol;
        }
        let obi = reader.readInstruction();
        this.id$ = obi.pipe(filter(r => r.opcode == 'ready'), map(r => r.args[0]));

        obi.pipe(
            filter(r => r.opcode == 'args'),
            tap(ist => console.debug({readArgs:ist})),
            map(r => {
                let arg_values: Array<string> = [];
                r.args.forEach((v, i) => {
                    if (i == 0) {
                        let version = GuacamoleProtocolVersion.parseVersion(v);
                        if (version) {
                            if (version.atLeast(GuacamoleProtocolVersion.LATEST)) {
                                version = GuacamoleProtocolVersion.LATEST;
                                protocolVersion = version;
                                arg_values.push(version.toString());
                                return;
                            }
                        }
                    }
                    let pv = config.getParameter(v);
                    if (pv) {
                        arg_values.push(pv);
                        return;
                    }
                    arg_values.push("");
                });
                return arg_values;
            }),
            // switchMap(args => {
            //     writer.writeInstruction(new GuacamoleInstruction('connect', args));
            //     return this.expect(reader, 'ready');
            // }),
            // filter(r => !r),
            // map(r => r.args[0])
            //tap(args=>console.debug(args))
        ).subscribe(args => {
            writer.writeInstruction(new GuacamoleInstruction('size', [info.optimalScreenWidth.toString(), info.optimalScreenHeight.toString(), info.optimalResolution.toString()]));
            writer.writeInstruction(new GuacamoleInstruction('audio', [...info.audioMimetypes]));
            writer.writeInstruction(new GuacamoleInstruction('video', [...info.videoMimetypes]));
            writer.writeInstruction(new GuacamoleInstruction('image', [...info.imageMimetypes]));
            if (GuacamoleProtocolCapability.TIMEZONE_HANDSHAKE.isSupported(protocolVersion)) {
                if (!!info.timezone) {
                    writer.writeInstruction(new GuacamoleInstruction('timezone', [info.timezone]));
                }
            }
            writer.writeInstruction(new GuacamoleInstruction('connect', args));

        });
        writer.writeInstruction(new GuacamoleInstruction('select', [selectArg]));
    }

}