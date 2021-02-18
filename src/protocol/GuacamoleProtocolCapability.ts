import { GuacamoleProtocolVersion } from "./GuacamoleProtocolVersion";

export class GuacamoleProtocolCapability {
    /**
         * The protocol does not require handshake instructions to be sent in a
         * specific order, nor that all handshake instructions be sent. Arbitrary
         * handshake order was introduced in
         * {@link GuacamoleProtocolVersion#VERSION_1_1_0}.
         */
    static ARBITRARY_HANDSHAKE_ORDER = new GuacamoleProtocolCapability(GuacamoleProtocolVersion.VERSION_1_1_0);

    /**
     * Negotiation of Guacamole protocol version between client and server
     * during the protocol handshake. The ability to negotiate protocol
     * versions was introduced in
     * {@link GuacamoleProtocolVersion#VERSION_1_1_0}.
     */
    static PROTOCOL_VERSION_DETECTION = new GuacamoleProtocolCapability(GuacamoleProtocolVersion.VERSION_1_1_0);

    /**
     * Support for the "required" instruction. The "required" instruction
     * allows the server to explicitly request connection parameters from the
     * client without which the connection cannot continue, such as user
     * credentials. Support for this instruction was introduced in
     * {@link GuacamoleProtocolVersion#VERSION_1_3_0}.
     */
    static REQUIRED_INSTRUCTION = new GuacamoleProtocolCapability(GuacamoleProtocolVersion.VERSION_1_3_0);

    /**
     * Support for the "timezone" handshake instruction. The "timezone"
     * instruction allows the client to request that the server forward their
     * local timezone for use within the remote desktop session. Support for
     * forwarding the client timezone was introduced in
     * {@link GuacamoleProtocolVersion#VERSION_1_1_0}.
     */
    static TIMEZONE_HANDSHAKE = new GuacamoleProtocolCapability(GuacamoleProtocolVersion.VERSION_1_1_0);

    /**
     * Create a new enum value with the given protocol version as the minimum
     * required to support the capability.
     * 
     * @param version
     *     The minimum required protocol version for supporting the
     *     capability.
     */
    constructor(public readonly version: GuacamoleProtocolVersion) {
    }

    /**
     * Returns whether this capability is supported in the given Guacamole
     * protocol version.
     *
     * @param version
     *     The Guacamole protocol version to check.
     *
     * @return
     *     true if this capability is supported by the given protocol version,
     *     false otherwise.
     */
    isSupported(otherVersion: GuacamoleProtocolVersion) {
        return otherVersion.atLeast(this.version);
    }
}