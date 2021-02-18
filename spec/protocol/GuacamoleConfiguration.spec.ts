import { GuacamoleConfiguration } from "../../src/protocol/GuacamoleConfiguration"

describe("GuacamoleConfiguration", () => {
    it('instance', () => {
        expect(new GuacamoleConfiguration()).toBeInstanceOf(GuacamoleConfiguration);
    })
    it('init value', () => {
        let cfg = new GuacamoleConfiguration();
        expect(cfg.connectionId).toEqual('');
        expect(cfg.protocol).toEqual('');
    })
    it('get/set params', () => {
        let cfg = new GuacamoleConfiguration();
        cfg.setParameters(new Map([["1", "1-1"], ["2", "2-1"]]));
        expect(cfg.getParameters()).toHaveSize(2);
        expect(cfg.getParameterNames()).toHaveSize(2);
        expect(cfg.getParameter('1')).toEqual('1-1');
        expect(cfg.getParameters()).toHaveSize(2)
    })
})