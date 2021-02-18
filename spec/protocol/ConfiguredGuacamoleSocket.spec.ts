import { InetGuacamoleSocket } from "../../src/net/InetGuacamoleSocket"
import { ConfiguredGuacamoleSocket } from "../../src/protocol/ConfiguredGuacamoleSocket"
import { GuacamoleConfiguration } from "../../src/protocol/GuacamoleConfiguration"

describe("ConfigGuacamoleSocket", () => {
    let cfg: GuacamoleConfiguration;
    let gwHost: string;
    let gwPort: number;
    beforeEach(() => {
        gwHost = "192.168.124.10";
        gwPort = 4822;
        cfg = new GuacamoleConfiguration();
        cfg.protocol = 'rdp';
        cfg.setParameter('hostname', '192.168.124.9');
        cfg.setParameter('port', '3389')
        cfg.setParameter('username', 'caojiaying');
        cfg.setParameter('password', 'caojiaying')
    })
    it("connect ok", (done) => {
        let cfgSocket = new ConfiguredGuacamoleSocket(
            new InetGuacamoleSocket(gwHost, gwPort),
            cfg
        )
        cfgSocket.connectionId$.subscribe(id=>{
            expect(id[0]).toMatch('$');
            expect(id).toHaveSize(37);
            done();
        });
    })
})