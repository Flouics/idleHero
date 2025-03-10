import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace proto. */
export namespace proto {

    /** Properties of a SC. */
    interface ISC {

        /** SC loginMod */
        loginMod?: (proto.ISC_loginMod|null);

        /** SC hero */
        hero?: (proto.ISC_Hero|null);

        /** SC user */
        user?: (proto.ISC_User|null);

        /** SC item */
        item?: (proto.ISC_Item|null);
    }

    /** Represents a SC. */
    class SC implements ISC {

        /**
         * Constructs a new SC.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ISC);

        /** SC loginMod. */
        public loginMod?: (proto.ISC_loginMod|null);

        /** SC hero. */
        public hero?: (proto.ISC_Hero|null);

        /** SC user. */
        public user?: (proto.ISC_User|null);

        /** SC item. */
        public item?: (proto.ISC_Item|null);

        /**
         * Creates a new SC instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SC instance
         */
        public static create(properties?: proto.ISC): proto.SC;

        /**
         * Encodes the specified SC message. Does not implicitly {@link proto.SC.verify|verify} messages.
         * @param message SC message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ISC, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SC message, length delimited. Does not implicitly {@link proto.SC.verify|verify} messages.
         * @param message SC message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.ISC, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SC message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SC
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.SC;

        /**
         * Decodes a SC message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SC
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.SC;

        /**
         * Verifies a SC message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SC message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SC
         */
        public static fromObject(object: { [k: string]: any }): proto.SC;

        /**
         * Creates a plain object from a SC message. Also converts values to other types if specified.
         * @param message SC
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.SC, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SC to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SC
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CS. */
    interface ICS {

        /** CS login */
        login?: (proto.ICS_Login|null);

        /** CS guide */
        guide?: (proto.ICS_Guide|null);
    }

    /** Represents a CS. */
    class CS implements ICS {

        /**
         * Constructs a new CS.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ICS);

        /** CS login. */
        public login?: (proto.ICS_Login|null);

        /** CS guide. */
        public guide?: (proto.ICS_Guide|null);

        /**
         * Creates a new CS instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CS instance
         */
        public static create(properties?: proto.ICS): proto.CS;

        /**
         * Encodes the specified CS message. Does not implicitly {@link proto.CS.verify|verify} messages.
         * @param message CS message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ICS, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CS message, length delimited. Does not implicitly {@link proto.CS.verify|verify} messages.
         * @param message CS message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.ICS, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CS message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CS
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.CS;

        /**
         * Decodes a CS message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CS
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.CS;

        /**
         * Verifies a CS message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CS message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CS
         */
        public static fromObject(object: { [k: string]: any }): proto.CS;

        /**
         * Creates a plain object from a CS message. Also converts values to other types if specified.
         * @param message CS
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.CS, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CS to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CS
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CS_Login. */
    interface ICS_Login {

        /** CS_Login loginAccount */
        loginAccount?: (proto.ILoginAccount|null);
    }

    /** Represents a CS_Login. */
    class CS_Login implements ICS_Login {

        /**
         * Constructs a new CS_Login.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ICS_Login);

        /** CS_Login loginAccount. */
        public loginAccount?: (proto.ILoginAccount|null);

        /**
         * Creates a new CS_Login instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CS_Login instance
         */
        public static create(properties?: proto.ICS_Login): proto.CS_Login;

        /**
         * Encodes the specified CS_Login message. Does not implicitly {@link proto.CS_Login.verify|verify} messages.
         * @param message CS_Login message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ICS_Login, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CS_Login message, length delimited. Does not implicitly {@link proto.CS_Login.verify|verify} messages.
         * @param message CS_Login message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.ICS_Login, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CS_Login message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CS_Login
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.CS_Login;

        /**
         * Decodes a CS_Login message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CS_Login
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.CS_Login;

        /**
         * Verifies a CS_Login message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CS_Login message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CS_Login
         */
        public static fromObject(object: { [k: string]: any }): proto.CS_Login;

        /**
         * Creates a plain object from a CS_Login message. Also converts values to other types if specified.
         * @param message CS_Login
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.CS_Login, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CS_Login to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CS_Login
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LoginAccount. */
    interface ILoginAccount {

        /** LoginAccount platform */
        platform?: (string|null);

        /** LoginAccount openid */
        openid?: (string|null);

        /** LoginAccount openkey */
        openkey?: (string|null);

        /** LoginAccount parm1 */
        parm1?: (string|null);

        /** LoginAccount parm2 */
        parm2?: (string|null);

        /** LoginAccount parm3 */
        parm3?: (string|null);

        /** LoginAccount parm4 */
        parm4?: (string|null);

        /** LoginAccount parm5 */
        parm5?: (string|null);

        /** LoginAccount parm6 */
        parm6?: (string|null);
    }

    /** Represents a LoginAccount. */
    class LoginAccount implements ILoginAccount {

        /**
         * Constructs a new LoginAccount.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ILoginAccount);

        /** LoginAccount platform. */
        public platform: string;

        /** LoginAccount openid. */
        public openid: string;

        /** LoginAccount openkey. */
        public openkey: string;

        /** LoginAccount parm1. */
        public parm1: string;

        /** LoginAccount parm2. */
        public parm2: string;

        /** LoginAccount parm3. */
        public parm3: string;

        /** LoginAccount parm4. */
        public parm4: string;

        /** LoginAccount parm5. */
        public parm5: string;

        /** LoginAccount parm6. */
        public parm6: string;

        /**
         * Creates a new LoginAccount instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginAccount instance
         */
        public static create(properties?: proto.ILoginAccount): proto.LoginAccount;

        /**
         * Encodes the specified LoginAccount message. Does not implicitly {@link proto.LoginAccount.verify|verify} messages.
         * @param message LoginAccount message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ILoginAccount, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoginAccount message, length delimited. Does not implicitly {@link proto.LoginAccount.verify|verify} messages.
         * @param message LoginAccount message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.ILoginAccount, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoginAccount message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginAccount
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.LoginAccount;

        /**
         * Decodes a LoginAccount message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoginAccount
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.LoginAccount;

        /**
         * Verifies a LoginAccount message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoginAccount message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoginAccount
         */
        public static fromObject(object: { [k: string]: any }): proto.LoginAccount;

        /**
         * Creates a plain object from a LoginAccount message. Also converts values to other types if specified.
         * @param message LoginAccount
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.LoginAccount, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoginAccount to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for LoginAccount
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CS_Guide. */
    interface ICS_Guide {

        /** CS_Guide login */
        login?: (proto.IClogin|null);
    }

    /** Represents a CS_Guide. */
    class CS_Guide implements ICS_Guide {

        /**
         * Constructs a new CS_Guide.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ICS_Guide);

        /** CS_Guide login. */
        public login?: (proto.IClogin|null);

        /**
         * Creates a new CS_Guide instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CS_Guide instance
         */
        public static create(properties?: proto.ICS_Guide): proto.CS_Guide;

        /**
         * Encodes the specified CS_Guide message. Does not implicitly {@link proto.CS_Guide.verify|verify} messages.
         * @param message CS_Guide message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ICS_Guide, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CS_Guide message, length delimited. Does not implicitly {@link proto.CS_Guide.verify|verify} messages.
         * @param message CS_Guide message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.ICS_Guide, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CS_Guide message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CS_Guide
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.CS_Guide;

        /**
         * Decodes a CS_Guide message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CS_Guide
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.CS_Guide;

        /**
         * Verifies a CS_Guide message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CS_Guide message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CS_Guide
         */
        public static fromObject(object: { [k: string]: any }): proto.CS_Guide;

        /**
         * Creates a plain object from a CS_Guide message. Also converts values to other types if specified.
         * @param message CS_Guide
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.CS_Guide, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CS_Guide to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CS_Guide
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Clogin. */
    interface IClogin {

        /** Clogin platform */
        platform?: (string|null);

        /** Clogin ug */
        ug?: (string|null);

        /** Clogin pfgiftid */
        pfgiftid?: (number|null);

        /** Clogin pfvipgiftid */
        pfvipgiftid?: (number|null);
    }

    /** Represents a Clogin. */
    class Clogin implements IClogin {

        /**
         * Constructs a new Clogin.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IClogin);

        /** Clogin platform. */
        public platform: string;

        /** Clogin ug. */
        public ug: string;

        /** Clogin pfgiftid. */
        public pfgiftid: number;

        /** Clogin pfvipgiftid. */
        public pfvipgiftid: number;

        /**
         * Creates a new Clogin instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Clogin instance
         */
        public static create(properties?: proto.IClogin): proto.Clogin;

        /**
         * Encodes the specified Clogin message. Does not implicitly {@link proto.Clogin.verify|verify} messages.
         * @param message Clogin message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IClogin, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Clogin message, length delimited. Does not implicitly {@link proto.Clogin.verify|verify} messages.
         * @param message Clogin message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IClogin, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Clogin message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Clogin
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.Clogin;

        /**
         * Decodes a Clogin message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Clogin
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.Clogin;

        /**
         * Verifies a Clogin message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Clogin message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Clogin
         */
        public static fromObject(object: { [k: string]: any }): proto.Clogin;

        /**
         * Creates a plain object from a Clogin message. Also converts values to other types if specified.
         * @param message Clogin
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.Clogin, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Clogin to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Clogin
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SC_loginMod. */
    interface ISC_loginMod {

        /** SC_loginMod loginAccount */
        loginAccount?: (proto.ISC_LoginAccount|null);
    }

    /** Represents a SC_loginMod. */
    class SC_loginMod implements ISC_loginMod {

        /**
         * Constructs a new SC_loginMod.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ISC_loginMod);

        /** SC_loginMod loginAccount. */
        public loginAccount?: (proto.ISC_LoginAccount|null);

        /**
         * Creates a new SC_loginMod instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SC_loginMod instance
         */
        public static create(properties?: proto.ISC_loginMod): proto.SC_loginMod;

        /**
         * Encodes the specified SC_loginMod message. Does not implicitly {@link proto.SC_loginMod.verify|verify} messages.
         * @param message SC_loginMod message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ISC_loginMod, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SC_loginMod message, length delimited. Does not implicitly {@link proto.SC_loginMod.verify|verify} messages.
         * @param message SC_loginMod message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.ISC_loginMod, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SC_loginMod message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SC_loginMod
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.SC_loginMod;

        /**
         * Decodes a SC_loginMod message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SC_loginMod
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.SC_loginMod;

        /**
         * Verifies a SC_loginMod message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SC_loginMod message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SC_loginMod
         */
        public static fromObject(object: { [k: string]: any }): proto.SC_loginMod;

        /**
         * Creates a plain object from a SC_loginMod message. Also converts values to other types if specified.
         * @param message SC_loginMod
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.SC_loginMod, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SC_loginMod to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SC_loginMod
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SC_LoginAccount. */
    interface ISC_LoginAccount {

        /** SC_LoginAccount uid */
        uid?: (number|Long|null);

        /** SC_LoginAccount token */
        token?: (string|null);

        /** SC_LoginAccount backurl */
        backurl?: (string|null);

        /** SC_LoginAccount num1 */
        num1?: (string|null);

        /** SC_LoginAccount gamename */
        gamename?: (string|null);

        /** SC_LoginAccount ip */
        ip?: (string|null);

        /** SC_LoginAccount useraccount */
        useraccount?: (string|null);

        /** SC_LoginAccount thirdpurl */
        thirdpurl?: (string|null);
    }

    /** Represents a SC_LoginAccount. */
    class SC_LoginAccount implements ISC_LoginAccount {

        /**
         * Constructs a new SC_LoginAccount.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ISC_LoginAccount);

        /** SC_LoginAccount uid. */
        public uid: (number|Long);

        /** SC_LoginAccount token. */
        public token: string;

        /** SC_LoginAccount backurl. */
        public backurl: string;

        /** SC_LoginAccount num1. */
        public num1: string;

        /** SC_LoginAccount gamename. */
        public gamename: string;

        /** SC_LoginAccount ip. */
        public ip: string;

        /** SC_LoginAccount useraccount. */
        public useraccount: string;

        /** SC_LoginAccount thirdpurl. */
        public thirdpurl: string;

        /**
         * Creates a new SC_LoginAccount instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SC_LoginAccount instance
         */
        public static create(properties?: proto.ISC_LoginAccount): proto.SC_LoginAccount;

        /**
         * Encodes the specified SC_LoginAccount message. Does not implicitly {@link proto.SC_LoginAccount.verify|verify} messages.
         * @param message SC_LoginAccount message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ISC_LoginAccount, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SC_LoginAccount message, length delimited. Does not implicitly {@link proto.SC_LoginAccount.verify|verify} messages.
         * @param message SC_LoginAccount message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.ISC_LoginAccount, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SC_LoginAccount message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SC_LoginAccount
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.SC_LoginAccount;

        /**
         * Decodes a SC_LoginAccount message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SC_LoginAccount
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.SC_LoginAccount;

        /**
         * Verifies a SC_LoginAccount message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SC_LoginAccount message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SC_LoginAccount
         */
        public static fromObject(object: { [k: string]: any }): proto.SC_LoginAccount;

        /**
         * Creates a plain object from a SC_LoginAccount message. Also converts values to other types if specified.
         * @param message SC_LoginAccount
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.SC_LoginAccount, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SC_LoginAccount to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SC_LoginAccount
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SC_Hero. */
    interface ISC_Hero {

        /** SC_Hero heroList */
        heroList?: (proto.IHeroInfo[]|null);
    }

    /** Represents a SC_Hero. */
    class SC_Hero implements ISC_Hero {

        /**
         * Constructs a new SC_Hero.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ISC_Hero);

        /** SC_Hero heroList. */
        public heroList: proto.IHeroInfo[];

        /**
         * Creates a new SC_Hero instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SC_Hero instance
         */
        public static create(properties?: proto.ISC_Hero): proto.SC_Hero;

        /**
         * Encodes the specified SC_Hero message. Does not implicitly {@link proto.SC_Hero.verify|verify} messages.
         * @param message SC_Hero message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ISC_Hero, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SC_Hero message, length delimited. Does not implicitly {@link proto.SC_Hero.verify|verify} messages.
         * @param message SC_Hero message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.ISC_Hero, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SC_Hero message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SC_Hero
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.SC_Hero;

        /**
         * Decodes a SC_Hero message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SC_Hero
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.SC_Hero;

        /**
         * Verifies a SC_Hero message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SC_Hero message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SC_Hero
         */
        public static fromObject(object: { [k: string]: any }): proto.SC_Hero;

        /**
         * Creates a plain object from a SC_Hero message. Also converts values to other types if specified.
         * @param message SC_Hero
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.SC_Hero, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SC_Hero to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SC_Hero
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a HeroInfo. */
    interface IHeroInfo {

        /** HeroInfo id */
        id?: (number|null);
    }

    /** Represents a HeroInfo. */
    class HeroInfo implements IHeroInfo {

        /**
         * Constructs a new HeroInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IHeroInfo);

        /** HeroInfo id. */
        public id: number;

        /**
         * Creates a new HeroInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HeroInfo instance
         */
        public static create(properties?: proto.IHeroInfo): proto.HeroInfo;

        /**
         * Encodes the specified HeroInfo message. Does not implicitly {@link proto.HeroInfo.verify|verify} messages.
         * @param message HeroInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IHeroInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HeroInfo message, length delimited. Does not implicitly {@link proto.HeroInfo.verify|verify} messages.
         * @param message HeroInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IHeroInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HeroInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HeroInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.HeroInfo;

        /**
         * Decodes a HeroInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HeroInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.HeroInfo;

        /**
         * Verifies a HeroInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HeroInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HeroInfo
         */
        public static fromObject(object: { [k: string]: any }): proto.HeroInfo;

        /**
         * Creates a plain object from a HeroInfo message. Also converts values to other types if specified.
         * @param message HeroInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.HeroInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HeroInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for HeroInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SC_User. */
    interface ISC_User {

        /** SC_User user */
        user?: (proto.IUserInfo|null);
    }

    /** Represents a SC_User. */
    class SC_User implements ISC_User {

        /**
         * Constructs a new SC_User.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ISC_User);

        /** SC_User user. */
        public user?: (proto.IUserInfo|null);

        /**
         * Creates a new SC_User instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SC_User instance
         */
        public static create(properties?: proto.ISC_User): proto.SC_User;

        /**
         * Encodes the specified SC_User message. Does not implicitly {@link proto.SC_User.verify|verify} messages.
         * @param message SC_User message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ISC_User, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SC_User message, length delimited. Does not implicitly {@link proto.SC_User.verify|verify} messages.
         * @param message SC_User message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.ISC_User, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SC_User message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SC_User
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.SC_User;

        /**
         * Decodes a SC_User message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SC_User
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.SC_User;

        /**
         * Verifies a SC_User message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SC_User message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SC_User
         */
        public static fromObject(object: { [k: string]: any }): proto.SC_User;

        /**
         * Creates a plain object from a SC_User message. Also converts values to other types if specified.
         * @param message SC_User
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.SC_User, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SC_User to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SC_User
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a UserInfo. */
    interface IUserInfo {

        /** UserInfo uid */
        uid?: (number|Long|null);
    }

    /** Represents a UserInfo. */
    class UserInfo implements IUserInfo {

        /**
         * Constructs a new UserInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IUserInfo);

        /** UserInfo uid. */
        public uid: (number|Long);

        /**
         * Creates a new UserInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UserInfo instance
         */
        public static create(properties?: proto.IUserInfo): proto.UserInfo;

        /**
         * Encodes the specified UserInfo message. Does not implicitly {@link proto.UserInfo.verify|verify} messages.
         * @param message UserInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IUserInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UserInfo message, length delimited. Does not implicitly {@link proto.UserInfo.verify|verify} messages.
         * @param message UserInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IUserInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a UserInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.UserInfo;

        /**
         * Decodes a UserInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.UserInfo;

        /**
         * Verifies a UserInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a UserInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UserInfo
         */
        public static fromObject(object: { [k: string]: any }): proto.UserInfo;

        /**
         * Creates a plain object from a UserInfo message. Also converts values to other types if specified.
         * @param message UserInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.UserInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UserInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for UserInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SC_Item. */
    interface ISC_Item {

        /** SC_Item itemList */
        itemList?: (proto.IItemInfo[]|null);
    }

    /** Represents a SC_Item. */
    class SC_Item implements ISC_Item {

        /**
         * Constructs a new SC_Item.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ISC_Item);

        /** SC_Item itemList. */
        public itemList: proto.IItemInfo[];

        /**
         * Creates a new SC_Item instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SC_Item instance
         */
        public static create(properties?: proto.ISC_Item): proto.SC_Item;

        /**
         * Encodes the specified SC_Item message. Does not implicitly {@link proto.SC_Item.verify|verify} messages.
         * @param message SC_Item message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ISC_Item, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SC_Item message, length delimited. Does not implicitly {@link proto.SC_Item.verify|verify} messages.
         * @param message SC_Item message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.ISC_Item, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SC_Item message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SC_Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.SC_Item;

        /**
         * Decodes a SC_Item message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SC_Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.SC_Item;

        /**
         * Verifies a SC_Item message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SC_Item message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SC_Item
         */
        public static fromObject(object: { [k: string]: any }): proto.SC_Item;

        /**
         * Creates a plain object from a SC_Item message. Also converts values to other types if specified.
         * @param message SC_Item
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.SC_Item, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SC_Item to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SC_Item
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ItemInfo. */
    interface IItemInfo {

        /** ItemInfo id */
        id?: (number|null);

        /** ItemInfo kind */
        kind?: (number|null);

        /** ItemInfo count */
        count?: (number|null);

        /** ItemInfo label */
        label?: (number|null);

        /** ItemInfo isBs */
        isBs?: (number|null);

        /** ItemInfo num1 */
        num1?: (number|null);

        /** ItemInfo num2 */
        num2?: (number|null);

        /** ItemInfo num3 */
        num3?: (number|null);
    }

    /** Represents an ItemInfo. */
    class ItemInfo implements IItemInfo {

        /**
         * Constructs a new ItemInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IItemInfo);

        /** ItemInfo id. */
        public id: number;

        /** ItemInfo kind. */
        public kind: number;

        /** ItemInfo count. */
        public count: number;

        /** ItemInfo label. */
        public label: number;

        /** ItemInfo isBs. */
        public isBs: number;

        /** ItemInfo num1. */
        public num1: number;

        /** ItemInfo num2. */
        public num2: number;

        /** ItemInfo num3. */
        public num3: number;

        /**
         * Creates a new ItemInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ItemInfo instance
         */
        public static create(properties?: proto.IItemInfo): proto.ItemInfo;

        /**
         * Encodes the specified ItemInfo message. Does not implicitly {@link proto.ItemInfo.verify|verify} messages.
         * @param message ItemInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IItemInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ItemInfo message, length delimited. Does not implicitly {@link proto.ItemInfo.verify|verify} messages.
         * @param message ItemInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IItemInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ItemInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ItemInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.ItemInfo;

        /**
         * Decodes an ItemInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ItemInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.ItemInfo;

        /**
         * Verifies an ItemInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ItemInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ItemInfo
         */
        public static fromObject(object: { [k: string]: any }): proto.ItemInfo;

        /**
         * Creates a plain object from an ItemInfo message. Also converts values to other types if specified.
         * @param message ItemInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.ItemInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ItemInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ItemInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
