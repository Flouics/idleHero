/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.proto = (function() {

    /**
     * Namespace proto.
     * @exports proto
     * @namespace
     */
    var proto = {};

    proto.SC = (function() {

        /**
         * Properties of a SC.
         * @memberof proto
         * @interface ISC
         * @property {proto.ISC_loginMod|null} [loginMod] SC loginMod
         * @property {proto.ISC_Hero|null} [hero] SC hero
         * @property {proto.ISC_User|null} [user] SC user
         * @property {proto.ISC_Item|null} [item] SC item
         */

        /**
         * Constructs a new SC.
         * @memberof proto
         * @classdesc Represents a SC.
         * @implements ISC
         * @constructor
         * @param {proto.ISC=} [properties] Properties to set
         */
        function SC(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SC loginMod.
         * @member {proto.ISC_loginMod|null|undefined} loginMod
         * @memberof proto.SC
         * @instance
         */
        SC.prototype.loginMod = null;

        /**
         * SC hero.
         * @member {proto.ISC_Hero|null|undefined} hero
         * @memberof proto.SC
         * @instance
         */
        SC.prototype.hero = null;

        /**
         * SC user.
         * @member {proto.ISC_User|null|undefined} user
         * @memberof proto.SC
         * @instance
         */
        SC.prototype.user = null;

        /**
         * SC item.
         * @member {proto.ISC_Item|null|undefined} item
         * @memberof proto.SC
         * @instance
         */
        SC.prototype.item = null;

        /**
         * Creates a new SC instance using the specified properties.
         * @function create
         * @memberof proto.SC
         * @static
         * @param {proto.ISC=} [properties] Properties to set
         * @returns {proto.SC} SC instance
         */
        SC.create = function create(properties) {
            return new SC(properties);
        };

        /**
         * Encodes the specified SC message. Does not implicitly {@link proto.SC.verify|verify} messages.
         * @function encode
         * @memberof proto.SC
         * @static
         * @param {proto.ISC} message SC message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SC.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.loginMod != null && Object.hasOwnProperty.call(message, "loginMod"))
                $root.proto.SC_loginMod.encode(message.loginMod, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.hero != null && Object.hasOwnProperty.call(message, "hero"))
                $root.proto.SC_Hero.encode(message.hero, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.user != null && Object.hasOwnProperty.call(message, "user"))
                $root.proto.SC_User.encode(message.user, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.item != null && Object.hasOwnProperty.call(message, "item"))
                $root.proto.SC_Item.encode(message.item, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SC message, length delimited. Does not implicitly {@link proto.SC.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.SC
         * @static
         * @param {proto.ISC} message SC message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SC.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SC message from the specified reader or buffer.
         * @function decode
         * @memberof proto.SC
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.SC} SC
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SC.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.SC();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.loginMod = $root.proto.SC_loginMod.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.hero = $root.proto.SC_Hero.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.user = $root.proto.SC_User.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.item = $root.proto.SC_Item.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SC message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.SC
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.SC} SC
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SC.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SC message.
         * @function verify
         * @memberof proto.SC
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SC.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.loginMod != null && message.hasOwnProperty("loginMod")) {
                var error = $root.proto.SC_loginMod.verify(message.loginMod);
                if (error)
                    return "loginMod." + error;
            }
            if (message.hero != null && message.hasOwnProperty("hero")) {
                var error = $root.proto.SC_Hero.verify(message.hero);
                if (error)
                    return "hero." + error;
            }
            if (message.user != null && message.hasOwnProperty("user")) {
                var error = $root.proto.SC_User.verify(message.user);
                if (error)
                    return "user." + error;
            }
            if (message.item != null && message.hasOwnProperty("item")) {
                var error = $root.proto.SC_Item.verify(message.item);
                if (error)
                    return "item." + error;
            }
            return null;
        };

        /**
         * Creates a SC message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.SC
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.SC} SC
         */
        SC.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.SC)
                return object;
            var message = new $root.proto.SC();
            if (object.loginMod != null) {
                if (typeof object.loginMod !== "object")
                    throw TypeError(".proto.SC.loginMod: object expected");
                message.loginMod = $root.proto.SC_loginMod.fromObject(object.loginMod);
            }
            if (object.hero != null) {
                if (typeof object.hero !== "object")
                    throw TypeError(".proto.SC.hero: object expected");
                message.hero = $root.proto.SC_Hero.fromObject(object.hero);
            }
            if (object.user != null) {
                if (typeof object.user !== "object")
                    throw TypeError(".proto.SC.user: object expected");
                message.user = $root.proto.SC_User.fromObject(object.user);
            }
            if (object.item != null) {
                if (typeof object.item !== "object")
                    throw TypeError(".proto.SC.item: object expected");
                message.item = $root.proto.SC_Item.fromObject(object.item);
            }
            return message;
        };

        /**
         * Creates a plain object from a SC message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.SC
         * @static
         * @param {proto.SC} message SC
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SC.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.loginMod = null;
                object.hero = null;
                object.user = null;
                object.item = null;
            }
            if (message.loginMod != null && message.hasOwnProperty("loginMod"))
                object.loginMod = $root.proto.SC_loginMod.toObject(message.loginMod, options);
            if (message.hero != null && message.hasOwnProperty("hero"))
                object.hero = $root.proto.SC_Hero.toObject(message.hero, options);
            if (message.user != null && message.hasOwnProperty("user"))
                object.user = $root.proto.SC_User.toObject(message.user, options);
            if (message.item != null && message.hasOwnProperty("item"))
                object.item = $root.proto.SC_Item.toObject(message.item, options);
            return object;
        };

        /**
         * Converts this SC to JSON.
         * @function toJSON
         * @memberof proto.SC
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SC.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SC
         * @function getTypeUrl
         * @memberof proto.SC
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SC.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.SC";
        };

        return SC;
    })();

    proto.CS = (function() {

        /**
         * Properties of a CS.
         * @memberof proto
         * @interface ICS
         * @property {proto.ICS_Login|null} [login] CS login
         * @property {proto.ICS_Guide|null} [guide] CS guide
         */

        /**
         * Constructs a new CS.
         * @memberof proto
         * @classdesc Represents a CS.
         * @implements ICS
         * @constructor
         * @param {proto.ICS=} [properties] Properties to set
         */
        function CS(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CS login.
         * @member {proto.ICS_Login|null|undefined} login
         * @memberof proto.CS
         * @instance
         */
        CS.prototype.login = null;

        /**
         * CS guide.
         * @member {proto.ICS_Guide|null|undefined} guide
         * @memberof proto.CS
         * @instance
         */
        CS.prototype.guide = null;

        /**
         * Creates a new CS instance using the specified properties.
         * @function create
         * @memberof proto.CS
         * @static
         * @param {proto.ICS=} [properties] Properties to set
         * @returns {proto.CS} CS instance
         */
        CS.create = function create(properties) {
            return new CS(properties);
        };

        /**
         * Encodes the specified CS message. Does not implicitly {@link proto.CS.verify|verify} messages.
         * @function encode
         * @memberof proto.CS
         * @static
         * @param {proto.ICS} message CS message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CS.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.login != null && Object.hasOwnProperty.call(message, "login"))
                $root.proto.CS_Login.encode(message.login, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.guide != null && Object.hasOwnProperty.call(message, "guide"))
                $root.proto.CS_Guide.encode(message.guide, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified CS message, length delimited. Does not implicitly {@link proto.CS.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.CS
         * @static
         * @param {proto.ICS} message CS message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CS.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CS message from the specified reader or buffer.
         * @function decode
         * @memberof proto.CS
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.CS} CS
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CS.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.CS();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.login = $root.proto.CS_Login.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.guide = $root.proto.CS_Guide.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CS message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.CS
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.CS} CS
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CS.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CS message.
         * @function verify
         * @memberof proto.CS
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CS.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.login != null && message.hasOwnProperty("login")) {
                var error = $root.proto.CS_Login.verify(message.login);
                if (error)
                    return "login." + error;
            }
            if (message.guide != null && message.hasOwnProperty("guide")) {
                var error = $root.proto.CS_Guide.verify(message.guide);
                if (error)
                    return "guide." + error;
            }
            return null;
        };

        /**
         * Creates a CS message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.CS
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.CS} CS
         */
        CS.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.CS)
                return object;
            var message = new $root.proto.CS();
            if (object.login != null) {
                if (typeof object.login !== "object")
                    throw TypeError(".proto.CS.login: object expected");
                message.login = $root.proto.CS_Login.fromObject(object.login);
            }
            if (object.guide != null) {
                if (typeof object.guide !== "object")
                    throw TypeError(".proto.CS.guide: object expected");
                message.guide = $root.proto.CS_Guide.fromObject(object.guide);
            }
            return message;
        };

        /**
         * Creates a plain object from a CS message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.CS
         * @static
         * @param {proto.CS} message CS
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CS.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.login = null;
                object.guide = null;
            }
            if (message.login != null && message.hasOwnProperty("login"))
                object.login = $root.proto.CS_Login.toObject(message.login, options);
            if (message.guide != null && message.hasOwnProperty("guide"))
                object.guide = $root.proto.CS_Guide.toObject(message.guide, options);
            return object;
        };

        /**
         * Converts this CS to JSON.
         * @function toJSON
         * @memberof proto.CS
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CS.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CS
         * @function getTypeUrl
         * @memberof proto.CS
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CS.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.CS";
        };

        return CS;
    })();

    proto.CS_Login = (function() {

        /**
         * Properties of a CS_Login.
         * @memberof proto
         * @interface ICS_Login
         * @property {proto.ILoginAccount|null} [loginAccount] CS_Login loginAccount
         */

        /**
         * Constructs a new CS_Login.
         * @memberof proto
         * @classdesc Represents a CS_Login.
         * @implements ICS_Login
         * @constructor
         * @param {proto.ICS_Login=} [properties] Properties to set
         */
        function CS_Login(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CS_Login loginAccount.
         * @member {proto.ILoginAccount|null|undefined} loginAccount
         * @memberof proto.CS_Login
         * @instance
         */
        CS_Login.prototype.loginAccount = null;

        /**
         * Creates a new CS_Login instance using the specified properties.
         * @function create
         * @memberof proto.CS_Login
         * @static
         * @param {proto.ICS_Login=} [properties] Properties to set
         * @returns {proto.CS_Login} CS_Login instance
         */
        CS_Login.create = function create(properties) {
            return new CS_Login(properties);
        };

        /**
         * Encodes the specified CS_Login message. Does not implicitly {@link proto.CS_Login.verify|verify} messages.
         * @function encode
         * @memberof proto.CS_Login
         * @static
         * @param {proto.ICS_Login} message CS_Login message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CS_Login.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.loginAccount != null && Object.hasOwnProperty.call(message, "loginAccount"))
                $root.proto.LoginAccount.encode(message.loginAccount, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified CS_Login message, length delimited. Does not implicitly {@link proto.CS_Login.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.CS_Login
         * @static
         * @param {proto.ICS_Login} message CS_Login message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CS_Login.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CS_Login message from the specified reader or buffer.
         * @function decode
         * @memberof proto.CS_Login
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.CS_Login} CS_Login
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CS_Login.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.CS_Login();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.loginAccount = $root.proto.LoginAccount.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CS_Login message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.CS_Login
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.CS_Login} CS_Login
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CS_Login.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CS_Login message.
         * @function verify
         * @memberof proto.CS_Login
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CS_Login.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.loginAccount != null && message.hasOwnProperty("loginAccount")) {
                var error = $root.proto.LoginAccount.verify(message.loginAccount);
                if (error)
                    return "loginAccount." + error;
            }
            return null;
        };

        /**
         * Creates a CS_Login message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.CS_Login
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.CS_Login} CS_Login
         */
        CS_Login.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.CS_Login)
                return object;
            var message = new $root.proto.CS_Login();
            if (object.loginAccount != null) {
                if (typeof object.loginAccount !== "object")
                    throw TypeError(".proto.CS_Login.loginAccount: object expected");
                message.loginAccount = $root.proto.LoginAccount.fromObject(object.loginAccount);
            }
            return message;
        };

        /**
         * Creates a plain object from a CS_Login message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.CS_Login
         * @static
         * @param {proto.CS_Login} message CS_Login
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CS_Login.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.loginAccount = null;
            if (message.loginAccount != null && message.hasOwnProperty("loginAccount"))
                object.loginAccount = $root.proto.LoginAccount.toObject(message.loginAccount, options);
            return object;
        };

        /**
         * Converts this CS_Login to JSON.
         * @function toJSON
         * @memberof proto.CS_Login
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CS_Login.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CS_Login
         * @function getTypeUrl
         * @memberof proto.CS_Login
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CS_Login.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.CS_Login";
        };

        return CS_Login;
    })();

    proto.LoginAccount = (function() {

        /**
         * Properties of a LoginAccount.
         * @memberof proto
         * @interface ILoginAccount
         * @property {string|null} [platform] LoginAccount platform
         * @property {string|null} [openid] LoginAccount openid
         * @property {string|null} [openkey] LoginAccount openkey
         * @property {string|null} [parm1] LoginAccount parm1
         * @property {string|null} [parm2] LoginAccount parm2
         * @property {string|null} [parm3] LoginAccount parm3
         * @property {string|null} [parm4] LoginAccount parm4
         * @property {string|null} [parm5] LoginAccount parm5
         * @property {string|null} [parm6] LoginAccount parm6
         */

        /**
         * Constructs a new LoginAccount.
         * @memberof proto
         * @classdesc Represents a LoginAccount.
         * @implements ILoginAccount
         * @constructor
         * @param {proto.ILoginAccount=} [properties] Properties to set
         */
        function LoginAccount(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LoginAccount platform.
         * @member {string} platform
         * @memberof proto.LoginAccount
         * @instance
         */
        LoginAccount.prototype.platform = "";

        /**
         * LoginAccount openid.
         * @member {string} openid
         * @memberof proto.LoginAccount
         * @instance
         */
        LoginAccount.prototype.openid = "";

        /**
         * LoginAccount openkey.
         * @member {string} openkey
         * @memberof proto.LoginAccount
         * @instance
         */
        LoginAccount.prototype.openkey = "";

        /**
         * LoginAccount parm1.
         * @member {string} parm1
         * @memberof proto.LoginAccount
         * @instance
         */
        LoginAccount.prototype.parm1 = "";

        /**
         * LoginAccount parm2.
         * @member {string} parm2
         * @memberof proto.LoginAccount
         * @instance
         */
        LoginAccount.prototype.parm2 = "";

        /**
         * LoginAccount parm3.
         * @member {string} parm3
         * @memberof proto.LoginAccount
         * @instance
         */
        LoginAccount.prototype.parm3 = "";

        /**
         * LoginAccount parm4.
         * @member {string} parm4
         * @memberof proto.LoginAccount
         * @instance
         */
        LoginAccount.prototype.parm4 = "";

        /**
         * LoginAccount parm5.
         * @member {string} parm5
         * @memberof proto.LoginAccount
         * @instance
         */
        LoginAccount.prototype.parm5 = "";

        /**
         * LoginAccount parm6.
         * @member {string} parm6
         * @memberof proto.LoginAccount
         * @instance
         */
        LoginAccount.prototype.parm6 = "";

        /**
         * Creates a new LoginAccount instance using the specified properties.
         * @function create
         * @memberof proto.LoginAccount
         * @static
         * @param {proto.ILoginAccount=} [properties] Properties to set
         * @returns {proto.LoginAccount} LoginAccount instance
         */
        LoginAccount.create = function create(properties) {
            return new LoginAccount(properties);
        };

        /**
         * Encodes the specified LoginAccount message. Does not implicitly {@link proto.LoginAccount.verify|verify} messages.
         * @function encode
         * @memberof proto.LoginAccount
         * @static
         * @param {proto.ILoginAccount} message LoginAccount message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginAccount.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.platform != null && Object.hasOwnProperty.call(message, "platform"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.platform);
            if (message.openid != null && Object.hasOwnProperty.call(message, "openid"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.openid);
            if (message.openkey != null && Object.hasOwnProperty.call(message, "openkey"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.openkey);
            if (message.parm1 != null && Object.hasOwnProperty.call(message, "parm1"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.parm1);
            if (message.parm2 != null && Object.hasOwnProperty.call(message, "parm2"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.parm2);
            if (message.parm3 != null && Object.hasOwnProperty.call(message, "parm3"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.parm3);
            if (message.parm4 != null && Object.hasOwnProperty.call(message, "parm4"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.parm4);
            if (message.parm5 != null && Object.hasOwnProperty.call(message, "parm5"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.parm5);
            if (message.parm6 != null && Object.hasOwnProperty.call(message, "parm6"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.parm6);
            return writer;
        };

        /**
         * Encodes the specified LoginAccount message, length delimited. Does not implicitly {@link proto.LoginAccount.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.LoginAccount
         * @static
         * @param {proto.ILoginAccount} message LoginAccount message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginAccount.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LoginAccount message from the specified reader or buffer.
         * @function decode
         * @memberof proto.LoginAccount
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.LoginAccount} LoginAccount
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginAccount.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.LoginAccount();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.platform = reader.string();
                        break;
                    }
                case 2: {
                        message.openid = reader.string();
                        break;
                    }
                case 3: {
                        message.openkey = reader.string();
                        break;
                    }
                case 4: {
                        message.parm1 = reader.string();
                        break;
                    }
                case 5: {
                        message.parm2 = reader.string();
                        break;
                    }
                case 6: {
                        message.parm3 = reader.string();
                        break;
                    }
                case 7: {
                        message.parm4 = reader.string();
                        break;
                    }
                case 8: {
                        message.parm5 = reader.string();
                        break;
                    }
                case 9: {
                        message.parm6 = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LoginAccount message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.LoginAccount
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.LoginAccount} LoginAccount
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginAccount.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LoginAccount message.
         * @function verify
         * @memberof proto.LoginAccount
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LoginAccount.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.platform != null && message.hasOwnProperty("platform"))
                if (!$util.isString(message.platform))
                    return "platform: string expected";
            if (message.openid != null && message.hasOwnProperty("openid"))
                if (!$util.isString(message.openid))
                    return "openid: string expected";
            if (message.openkey != null && message.hasOwnProperty("openkey"))
                if (!$util.isString(message.openkey))
                    return "openkey: string expected";
            if (message.parm1 != null && message.hasOwnProperty("parm1"))
                if (!$util.isString(message.parm1))
                    return "parm1: string expected";
            if (message.parm2 != null && message.hasOwnProperty("parm2"))
                if (!$util.isString(message.parm2))
                    return "parm2: string expected";
            if (message.parm3 != null && message.hasOwnProperty("parm3"))
                if (!$util.isString(message.parm3))
                    return "parm3: string expected";
            if (message.parm4 != null && message.hasOwnProperty("parm4"))
                if (!$util.isString(message.parm4))
                    return "parm4: string expected";
            if (message.parm5 != null && message.hasOwnProperty("parm5"))
                if (!$util.isString(message.parm5))
                    return "parm5: string expected";
            if (message.parm6 != null && message.hasOwnProperty("parm6"))
                if (!$util.isString(message.parm6))
                    return "parm6: string expected";
            return null;
        };

        /**
         * Creates a LoginAccount message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.LoginAccount
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.LoginAccount} LoginAccount
         */
        LoginAccount.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.LoginAccount)
                return object;
            var message = new $root.proto.LoginAccount();
            if (object.platform != null)
                message.platform = String(object.platform);
            if (object.openid != null)
                message.openid = String(object.openid);
            if (object.openkey != null)
                message.openkey = String(object.openkey);
            if (object.parm1 != null)
                message.parm1 = String(object.parm1);
            if (object.parm2 != null)
                message.parm2 = String(object.parm2);
            if (object.parm3 != null)
                message.parm3 = String(object.parm3);
            if (object.parm4 != null)
                message.parm4 = String(object.parm4);
            if (object.parm5 != null)
                message.parm5 = String(object.parm5);
            if (object.parm6 != null)
                message.parm6 = String(object.parm6);
            return message;
        };

        /**
         * Creates a plain object from a LoginAccount message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.LoginAccount
         * @static
         * @param {proto.LoginAccount} message LoginAccount
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LoginAccount.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.platform = "";
                object.openid = "";
                object.openkey = "";
                object.parm1 = "";
                object.parm2 = "";
                object.parm3 = "";
                object.parm4 = "";
                object.parm5 = "";
                object.parm6 = "";
            }
            if (message.platform != null && message.hasOwnProperty("platform"))
                object.platform = message.platform;
            if (message.openid != null && message.hasOwnProperty("openid"))
                object.openid = message.openid;
            if (message.openkey != null && message.hasOwnProperty("openkey"))
                object.openkey = message.openkey;
            if (message.parm1 != null && message.hasOwnProperty("parm1"))
                object.parm1 = message.parm1;
            if (message.parm2 != null && message.hasOwnProperty("parm2"))
                object.parm2 = message.parm2;
            if (message.parm3 != null && message.hasOwnProperty("parm3"))
                object.parm3 = message.parm3;
            if (message.parm4 != null && message.hasOwnProperty("parm4"))
                object.parm4 = message.parm4;
            if (message.parm5 != null && message.hasOwnProperty("parm5"))
                object.parm5 = message.parm5;
            if (message.parm6 != null && message.hasOwnProperty("parm6"))
                object.parm6 = message.parm6;
            return object;
        };

        /**
         * Converts this LoginAccount to JSON.
         * @function toJSON
         * @memberof proto.LoginAccount
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LoginAccount.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for LoginAccount
         * @function getTypeUrl
         * @memberof proto.LoginAccount
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LoginAccount.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.LoginAccount";
        };

        return LoginAccount;
    })();

    proto.CS_Guide = (function() {

        /**
         * Properties of a CS_Guide.
         * @memberof proto
         * @interface ICS_Guide
         * @property {proto.IClogin|null} [login] CS_Guide login
         */

        /**
         * Constructs a new CS_Guide.
         * @memberof proto
         * @classdesc Represents a CS_Guide.
         * @implements ICS_Guide
         * @constructor
         * @param {proto.ICS_Guide=} [properties] Properties to set
         */
        function CS_Guide(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CS_Guide login.
         * @member {proto.IClogin|null|undefined} login
         * @memberof proto.CS_Guide
         * @instance
         */
        CS_Guide.prototype.login = null;

        /**
         * Creates a new CS_Guide instance using the specified properties.
         * @function create
         * @memberof proto.CS_Guide
         * @static
         * @param {proto.ICS_Guide=} [properties] Properties to set
         * @returns {proto.CS_Guide} CS_Guide instance
         */
        CS_Guide.create = function create(properties) {
            return new CS_Guide(properties);
        };

        /**
         * Encodes the specified CS_Guide message. Does not implicitly {@link proto.CS_Guide.verify|verify} messages.
         * @function encode
         * @memberof proto.CS_Guide
         * @static
         * @param {proto.ICS_Guide} message CS_Guide message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CS_Guide.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.login != null && Object.hasOwnProperty.call(message, "login"))
                $root.proto.Clogin.encode(message.login, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified CS_Guide message, length delimited. Does not implicitly {@link proto.CS_Guide.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.CS_Guide
         * @static
         * @param {proto.ICS_Guide} message CS_Guide message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CS_Guide.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CS_Guide message from the specified reader or buffer.
         * @function decode
         * @memberof proto.CS_Guide
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.CS_Guide} CS_Guide
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CS_Guide.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.CS_Guide();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.login = $root.proto.Clogin.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CS_Guide message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.CS_Guide
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.CS_Guide} CS_Guide
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CS_Guide.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CS_Guide message.
         * @function verify
         * @memberof proto.CS_Guide
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CS_Guide.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.login != null && message.hasOwnProperty("login")) {
                var error = $root.proto.Clogin.verify(message.login);
                if (error)
                    return "login." + error;
            }
            return null;
        };

        /**
         * Creates a CS_Guide message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.CS_Guide
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.CS_Guide} CS_Guide
         */
        CS_Guide.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.CS_Guide)
                return object;
            var message = new $root.proto.CS_Guide();
            if (object.login != null) {
                if (typeof object.login !== "object")
                    throw TypeError(".proto.CS_Guide.login: object expected");
                message.login = $root.proto.Clogin.fromObject(object.login);
            }
            return message;
        };

        /**
         * Creates a plain object from a CS_Guide message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.CS_Guide
         * @static
         * @param {proto.CS_Guide} message CS_Guide
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CS_Guide.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.login = null;
            if (message.login != null && message.hasOwnProperty("login"))
                object.login = $root.proto.Clogin.toObject(message.login, options);
            return object;
        };

        /**
         * Converts this CS_Guide to JSON.
         * @function toJSON
         * @memberof proto.CS_Guide
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CS_Guide.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CS_Guide
         * @function getTypeUrl
         * @memberof proto.CS_Guide
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CS_Guide.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.CS_Guide";
        };

        return CS_Guide;
    })();

    proto.Clogin = (function() {

        /**
         * Properties of a Clogin.
         * @memberof proto
         * @interface IClogin
         * @property {string|null} [platform] Clogin platform
         * @property {string|null} [ug] Clogin ug
         * @property {number|null} [pfgiftid] Clogin pfgiftid
         * @property {number|null} [pfvipgiftid] Clogin pfvipgiftid
         */

        /**
         * Constructs a new Clogin.
         * @memberof proto
         * @classdesc Represents a Clogin.
         * @implements IClogin
         * @constructor
         * @param {proto.IClogin=} [properties] Properties to set
         */
        function Clogin(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Clogin platform.
         * @member {string} platform
         * @memberof proto.Clogin
         * @instance
         */
        Clogin.prototype.platform = "";

        /**
         * Clogin ug.
         * @member {string} ug
         * @memberof proto.Clogin
         * @instance
         */
        Clogin.prototype.ug = "";

        /**
         * Clogin pfgiftid.
         * @member {number} pfgiftid
         * @memberof proto.Clogin
         * @instance
         */
        Clogin.prototype.pfgiftid = 0;

        /**
         * Clogin pfvipgiftid.
         * @member {number} pfvipgiftid
         * @memberof proto.Clogin
         * @instance
         */
        Clogin.prototype.pfvipgiftid = 0;

        /**
         * Creates a new Clogin instance using the specified properties.
         * @function create
         * @memberof proto.Clogin
         * @static
         * @param {proto.IClogin=} [properties] Properties to set
         * @returns {proto.Clogin} Clogin instance
         */
        Clogin.create = function create(properties) {
            return new Clogin(properties);
        };

        /**
         * Encodes the specified Clogin message. Does not implicitly {@link proto.Clogin.verify|verify} messages.
         * @function encode
         * @memberof proto.Clogin
         * @static
         * @param {proto.IClogin} message Clogin message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Clogin.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.platform != null && Object.hasOwnProperty.call(message, "platform"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.platform);
            if (message.ug != null && Object.hasOwnProperty.call(message, "ug"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.ug);
            if (message.pfgiftid != null && Object.hasOwnProperty.call(message, "pfgiftid"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.pfgiftid);
            if (message.pfvipgiftid != null && Object.hasOwnProperty.call(message, "pfvipgiftid"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.pfvipgiftid);
            return writer;
        };

        /**
         * Encodes the specified Clogin message, length delimited. Does not implicitly {@link proto.Clogin.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.Clogin
         * @static
         * @param {proto.IClogin} message Clogin message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Clogin.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Clogin message from the specified reader or buffer.
         * @function decode
         * @memberof proto.Clogin
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.Clogin} Clogin
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Clogin.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.Clogin();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.platform = reader.string();
                        break;
                    }
                case 2: {
                        message.ug = reader.string();
                        break;
                    }
                case 3: {
                        message.pfgiftid = reader.int32();
                        break;
                    }
                case 4: {
                        message.pfvipgiftid = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Clogin message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.Clogin
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.Clogin} Clogin
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Clogin.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Clogin message.
         * @function verify
         * @memberof proto.Clogin
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Clogin.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.platform != null && message.hasOwnProperty("platform"))
                if (!$util.isString(message.platform))
                    return "platform: string expected";
            if (message.ug != null && message.hasOwnProperty("ug"))
                if (!$util.isString(message.ug))
                    return "ug: string expected";
            if (message.pfgiftid != null && message.hasOwnProperty("pfgiftid"))
                if (!$util.isInteger(message.pfgiftid))
                    return "pfgiftid: integer expected";
            if (message.pfvipgiftid != null && message.hasOwnProperty("pfvipgiftid"))
                if (!$util.isInteger(message.pfvipgiftid))
                    return "pfvipgiftid: integer expected";
            return null;
        };

        /**
         * Creates a Clogin message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.Clogin
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.Clogin} Clogin
         */
        Clogin.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.Clogin)
                return object;
            var message = new $root.proto.Clogin();
            if (object.platform != null)
                message.platform = String(object.platform);
            if (object.ug != null)
                message.ug = String(object.ug);
            if (object.pfgiftid != null)
                message.pfgiftid = object.pfgiftid | 0;
            if (object.pfvipgiftid != null)
                message.pfvipgiftid = object.pfvipgiftid | 0;
            return message;
        };

        /**
         * Creates a plain object from a Clogin message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.Clogin
         * @static
         * @param {proto.Clogin} message Clogin
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Clogin.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.platform = "";
                object.ug = "";
                object.pfgiftid = 0;
                object.pfvipgiftid = 0;
            }
            if (message.platform != null && message.hasOwnProperty("platform"))
                object.platform = message.platform;
            if (message.ug != null && message.hasOwnProperty("ug"))
                object.ug = message.ug;
            if (message.pfgiftid != null && message.hasOwnProperty("pfgiftid"))
                object.pfgiftid = message.pfgiftid;
            if (message.pfvipgiftid != null && message.hasOwnProperty("pfvipgiftid"))
                object.pfvipgiftid = message.pfvipgiftid;
            return object;
        };

        /**
         * Converts this Clogin to JSON.
         * @function toJSON
         * @memberof proto.Clogin
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Clogin.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Clogin
         * @function getTypeUrl
         * @memberof proto.Clogin
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Clogin.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.Clogin";
        };

        return Clogin;
    })();

    proto.SC_loginMod = (function() {

        /**
         * Properties of a SC_loginMod.
         * @memberof proto
         * @interface ISC_loginMod
         * @property {proto.ISC_LoginAccount|null} [loginAccount] SC_loginMod loginAccount
         */

        /**
         * Constructs a new SC_loginMod.
         * @memberof proto
         * @classdesc Represents a SC_loginMod.
         * @implements ISC_loginMod
         * @constructor
         * @param {proto.ISC_loginMod=} [properties] Properties to set
         */
        function SC_loginMod(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SC_loginMod loginAccount.
         * @member {proto.ISC_LoginAccount|null|undefined} loginAccount
         * @memberof proto.SC_loginMod
         * @instance
         */
        SC_loginMod.prototype.loginAccount = null;

        /**
         * Creates a new SC_loginMod instance using the specified properties.
         * @function create
         * @memberof proto.SC_loginMod
         * @static
         * @param {proto.ISC_loginMod=} [properties] Properties to set
         * @returns {proto.SC_loginMod} SC_loginMod instance
         */
        SC_loginMod.create = function create(properties) {
            return new SC_loginMod(properties);
        };

        /**
         * Encodes the specified SC_loginMod message. Does not implicitly {@link proto.SC_loginMod.verify|verify} messages.
         * @function encode
         * @memberof proto.SC_loginMod
         * @static
         * @param {proto.ISC_loginMod} message SC_loginMod message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SC_loginMod.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.loginAccount != null && Object.hasOwnProperty.call(message, "loginAccount"))
                $root.proto.SC_LoginAccount.encode(message.loginAccount, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SC_loginMod message, length delimited. Does not implicitly {@link proto.SC_loginMod.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.SC_loginMod
         * @static
         * @param {proto.ISC_loginMod} message SC_loginMod message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SC_loginMod.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SC_loginMod message from the specified reader or buffer.
         * @function decode
         * @memberof proto.SC_loginMod
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.SC_loginMod} SC_loginMod
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SC_loginMod.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.SC_loginMod();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.loginAccount = $root.proto.SC_LoginAccount.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SC_loginMod message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.SC_loginMod
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.SC_loginMod} SC_loginMod
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SC_loginMod.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SC_loginMod message.
         * @function verify
         * @memberof proto.SC_loginMod
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SC_loginMod.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.loginAccount != null && message.hasOwnProperty("loginAccount")) {
                var error = $root.proto.SC_LoginAccount.verify(message.loginAccount);
                if (error)
                    return "loginAccount." + error;
            }
            return null;
        };

        /**
         * Creates a SC_loginMod message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.SC_loginMod
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.SC_loginMod} SC_loginMod
         */
        SC_loginMod.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.SC_loginMod)
                return object;
            var message = new $root.proto.SC_loginMod();
            if (object.loginAccount != null) {
                if (typeof object.loginAccount !== "object")
                    throw TypeError(".proto.SC_loginMod.loginAccount: object expected");
                message.loginAccount = $root.proto.SC_LoginAccount.fromObject(object.loginAccount);
            }
            return message;
        };

        /**
         * Creates a plain object from a SC_loginMod message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.SC_loginMod
         * @static
         * @param {proto.SC_loginMod} message SC_loginMod
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SC_loginMod.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.loginAccount = null;
            if (message.loginAccount != null && message.hasOwnProperty("loginAccount"))
                object.loginAccount = $root.proto.SC_LoginAccount.toObject(message.loginAccount, options);
            return object;
        };

        /**
         * Converts this SC_loginMod to JSON.
         * @function toJSON
         * @memberof proto.SC_loginMod
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SC_loginMod.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SC_loginMod
         * @function getTypeUrl
         * @memberof proto.SC_loginMod
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SC_loginMod.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.SC_loginMod";
        };

        return SC_loginMod;
    })();

    proto.SC_LoginAccount = (function() {

        /**
         * Properties of a SC_LoginAccount.
         * @memberof proto
         * @interface ISC_LoginAccount
         * @property {number|Long|null} [uid] SC_LoginAccount uid
         * @property {string|null} [token] SC_LoginAccount token
         * @property {string|null} [backurl] SC_LoginAccount backurl
         * @property {string|null} [num1] SC_LoginAccount num1
         * @property {string|null} [gamename] SC_LoginAccount gamename
         * @property {string|null} [ip] SC_LoginAccount ip
         * @property {string|null} [useraccount] SC_LoginAccount useraccount
         * @property {string|null} [thirdpurl] SC_LoginAccount thirdpurl
         */

        /**
         * Constructs a new SC_LoginAccount.
         * @memberof proto
         * @classdesc Represents a SC_LoginAccount.
         * @implements ISC_LoginAccount
         * @constructor
         * @param {proto.ISC_LoginAccount=} [properties] Properties to set
         */
        function SC_LoginAccount(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SC_LoginAccount uid.
         * @member {number|Long} uid
         * @memberof proto.SC_LoginAccount
         * @instance
         */
        SC_LoginAccount.prototype.uid = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * SC_LoginAccount token.
         * @member {string} token
         * @memberof proto.SC_LoginAccount
         * @instance
         */
        SC_LoginAccount.prototype.token = "";

        /**
         * SC_LoginAccount backurl.
         * @member {string} backurl
         * @memberof proto.SC_LoginAccount
         * @instance
         */
        SC_LoginAccount.prototype.backurl = "";

        /**
         * SC_LoginAccount num1.
         * @member {string} num1
         * @memberof proto.SC_LoginAccount
         * @instance
         */
        SC_LoginAccount.prototype.num1 = "";

        /**
         * SC_LoginAccount gamename.
         * @member {string} gamename
         * @memberof proto.SC_LoginAccount
         * @instance
         */
        SC_LoginAccount.prototype.gamename = "";

        /**
         * SC_LoginAccount ip.
         * @member {string} ip
         * @memberof proto.SC_LoginAccount
         * @instance
         */
        SC_LoginAccount.prototype.ip = "";

        /**
         * SC_LoginAccount useraccount.
         * @member {string} useraccount
         * @memberof proto.SC_LoginAccount
         * @instance
         */
        SC_LoginAccount.prototype.useraccount = "";

        /**
         * SC_LoginAccount thirdpurl.
         * @member {string} thirdpurl
         * @memberof proto.SC_LoginAccount
         * @instance
         */
        SC_LoginAccount.prototype.thirdpurl = "";

        /**
         * Creates a new SC_LoginAccount instance using the specified properties.
         * @function create
         * @memberof proto.SC_LoginAccount
         * @static
         * @param {proto.ISC_LoginAccount=} [properties] Properties to set
         * @returns {proto.SC_LoginAccount} SC_LoginAccount instance
         */
        SC_LoginAccount.create = function create(properties) {
            return new SC_LoginAccount(properties);
        };

        /**
         * Encodes the specified SC_LoginAccount message. Does not implicitly {@link proto.SC_LoginAccount.verify|verify} messages.
         * @function encode
         * @memberof proto.SC_LoginAccount
         * @static
         * @param {proto.ISC_LoginAccount} message SC_LoginAccount message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SC_LoginAccount.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.uid);
            if (message.token != null && Object.hasOwnProperty.call(message, "token"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.token);
            if (message.backurl != null && Object.hasOwnProperty.call(message, "backurl"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.backurl);
            if (message.num1 != null && Object.hasOwnProperty.call(message, "num1"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.num1);
            if (message.gamename != null && Object.hasOwnProperty.call(message, "gamename"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.gamename);
            if (message.ip != null && Object.hasOwnProperty.call(message, "ip"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.ip);
            if (message.useraccount != null && Object.hasOwnProperty.call(message, "useraccount"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.useraccount);
            if (message.thirdpurl != null && Object.hasOwnProperty.call(message, "thirdpurl"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.thirdpurl);
            return writer;
        };

        /**
         * Encodes the specified SC_LoginAccount message, length delimited. Does not implicitly {@link proto.SC_LoginAccount.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.SC_LoginAccount
         * @static
         * @param {proto.ISC_LoginAccount} message SC_LoginAccount message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SC_LoginAccount.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SC_LoginAccount message from the specified reader or buffer.
         * @function decode
         * @memberof proto.SC_LoginAccount
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.SC_LoginAccount} SC_LoginAccount
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SC_LoginAccount.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.SC_LoginAccount();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.uid = reader.int64();
                        break;
                    }
                case 2: {
                        message.token = reader.string();
                        break;
                    }
                case 3: {
                        message.backurl = reader.string();
                        break;
                    }
                case 4: {
                        message.num1 = reader.string();
                        break;
                    }
                case 5: {
                        message.gamename = reader.string();
                        break;
                    }
                case 6: {
                        message.ip = reader.string();
                        break;
                    }
                case 7: {
                        message.useraccount = reader.string();
                        break;
                    }
                case 8: {
                        message.thirdpurl = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SC_LoginAccount message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.SC_LoginAccount
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.SC_LoginAccount} SC_LoginAccount
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SC_LoginAccount.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SC_LoginAccount message.
         * @function verify
         * @memberof proto.SC_LoginAccount
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SC_LoginAccount.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.uid != null && message.hasOwnProperty("uid"))
                if (!$util.isInteger(message.uid) && !(message.uid && $util.isInteger(message.uid.low) && $util.isInteger(message.uid.high)))
                    return "uid: integer|Long expected";
            if (message.token != null && message.hasOwnProperty("token"))
                if (!$util.isString(message.token))
                    return "token: string expected";
            if (message.backurl != null && message.hasOwnProperty("backurl"))
                if (!$util.isString(message.backurl))
                    return "backurl: string expected";
            if (message.num1 != null && message.hasOwnProperty("num1"))
                if (!$util.isString(message.num1))
                    return "num1: string expected";
            if (message.gamename != null && message.hasOwnProperty("gamename"))
                if (!$util.isString(message.gamename))
                    return "gamename: string expected";
            if (message.ip != null && message.hasOwnProperty("ip"))
                if (!$util.isString(message.ip))
                    return "ip: string expected";
            if (message.useraccount != null && message.hasOwnProperty("useraccount"))
                if (!$util.isString(message.useraccount))
                    return "useraccount: string expected";
            if (message.thirdpurl != null && message.hasOwnProperty("thirdpurl"))
                if (!$util.isString(message.thirdpurl))
                    return "thirdpurl: string expected";
            return null;
        };

        /**
         * Creates a SC_LoginAccount message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.SC_LoginAccount
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.SC_LoginAccount} SC_LoginAccount
         */
        SC_LoginAccount.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.SC_LoginAccount)
                return object;
            var message = new $root.proto.SC_LoginAccount();
            if (object.uid != null)
                if ($util.Long)
                    (message.uid = $util.Long.fromValue(object.uid)).unsigned = false;
                else if (typeof object.uid === "string")
                    message.uid = parseInt(object.uid, 10);
                else if (typeof object.uid === "number")
                    message.uid = object.uid;
                else if (typeof object.uid === "object")
                    message.uid = new $util.LongBits(object.uid.low >>> 0, object.uid.high >>> 0).toNumber();
            if (object.token != null)
                message.token = String(object.token);
            if (object.backurl != null)
                message.backurl = String(object.backurl);
            if (object.num1 != null)
                message.num1 = String(object.num1);
            if (object.gamename != null)
                message.gamename = String(object.gamename);
            if (object.ip != null)
                message.ip = String(object.ip);
            if (object.useraccount != null)
                message.useraccount = String(object.useraccount);
            if (object.thirdpurl != null)
                message.thirdpurl = String(object.thirdpurl);
            return message;
        };

        /**
         * Creates a plain object from a SC_LoginAccount message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.SC_LoginAccount
         * @static
         * @param {proto.SC_LoginAccount} message SC_LoginAccount
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SC_LoginAccount.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.uid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.uid = options.longs === String ? "0" : 0;
                object.token = "";
                object.backurl = "";
                object.num1 = "";
                object.gamename = "";
                object.ip = "";
                object.useraccount = "";
                object.thirdpurl = "";
            }
            if (message.uid != null && message.hasOwnProperty("uid"))
                if (typeof message.uid === "number")
                    object.uid = options.longs === String ? String(message.uid) : message.uid;
                else
                    object.uid = options.longs === String ? $util.Long.prototype.toString.call(message.uid) : options.longs === Number ? new $util.LongBits(message.uid.low >>> 0, message.uid.high >>> 0).toNumber() : message.uid;
            if (message.token != null && message.hasOwnProperty("token"))
                object.token = message.token;
            if (message.backurl != null && message.hasOwnProperty("backurl"))
                object.backurl = message.backurl;
            if (message.num1 != null && message.hasOwnProperty("num1"))
                object.num1 = message.num1;
            if (message.gamename != null && message.hasOwnProperty("gamename"))
                object.gamename = message.gamename;
            if (message.ip != null && message.hasOwnProperty("ip"))
                object.ip = message.ip;
            if (message.useraccount != null && message.hasOwnProperty("useraccount"))
                object.useraccount = message.useraccount;
            if (message.thirdpurl != null && message.hasOwnProperty("thirdpurl"))
                object.thirdpurl = message.thirdpurl;
            return object;
        };

        /**
         * Converts this SC_LoginAccount to JSON.
         * @function toJSON
         * @memberof proto.SC_LoginAccount
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SC_LoginAccount.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SC_LoginAccount
         * @function getTypeUrl
         * @memberof proto.SC_LoginAccount
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SC_LoginAccount.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.SC_LoginAccount";
        };

        return SC_LoginAccount;
    })();

    proto.SC_Hero = (function() {

        /**
         * Properties of a SC_Hero.
         * @memberof proto
         * @interface ISC_Hero
         * @property {Array.<proto.IHeroInfo>|null} [heroList] SC_Hero heroList
         */

        /**
         * Constructs a new SC_Hero.
         * @memberof proto
         * @classdesc Represents a SC_Hero.
         * @implements ISC_Hero
         * @constructor
         * @param {proto.ISC_Hero=} [properties] Properties to set
         */
        function SC_Hero(properties) {
            this.heroList = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SC_Hero heroList.
         * @member {Array.<proto.IHeroInfo>} heroList
         * @memberof proto.SC_Hero
         * @instance
         */
        SC_Hero.prototype.heroList = $util.emptyArray;

        /**
         * Creates a new SC_Hero instance using the specified properties.
         * @function create
         * @memberof proto.SC_Hero
         * @static
         * @param {proto.ISC_Hero=} [properties] Properties to set
         * @returns {proto.SC_Hero} SC_Hero instance
         */
        SC_Hero.create = function create(properties) {
            return new SC_Hero(properties);
        };

        /**
         * Encodes the specified SC_Hero message. Does not implicitly {@link proto.SC_Hero.verify|verify} messages.
         * @function encode
         * @memberof proto.SC_Hero
         * @static
         * @param {proto.ISC_Hero} message SC_Hero message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SC_Hero.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.heroList != null && message.heroList.length)
                for (var i = 0; i < message.heroList.length; ++i)
                    $root.proto.HeroInfo.encode(message.heroList[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SC_Hero message, length delimited. Does not implicitly {@link proto.SC_Hero.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.SC_Hero
         * @static
         * @param {proto.ISC_Hero} message SC_Hero message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SC_Hero.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SC_Hero message from the specified reader or buffer.
         * @function decode
         * @memberof proto.SC_Hero
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.SC_Hero} SC_Hero
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SC_Hero.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.SC_Hero();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.heroList && message.heroList.length))
                            message.heroList = [];
                        message.heroList.push($root.proto.HeroInfo.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SC_Hero message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.SC_Hero
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.SC_Hero} SC_Hero
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SC_Hero.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SC_Hero message.
         * @function verify
         * @memberof proto.SC_Hero
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SC_Hero.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.heroList != null && message.hasOwnProperty("heroList")) {
                if (!Array.isArray(message.heroList))
                    return "heroList: array expected";
                for (var i = 0; i < message.heroList.length; ++i) {
                    var error = $root.proto.HeroInfo.verify(message.heroList[i]);
                    if (error)
                        return "heroList." + error;
                }
            }
            return null;
        };

        /**
         * Creates a SC_Hero message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.SC_Hero
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.SC_Hero} SC_Hero
         */
        SC_Hero.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.SC_Hero)
                return object;
            var message = new $root.proto.SC_Hero();
            if (object.heroList) {
                if (!Array.isArray(object.heroList))
                    throw TypeError(".proto.SC_Hero.heroList: array expected");
                message.heroList = [];
                for (var i = 0; i < object.heroList.length; ++i) {
                    if (typeof object.heroList[i] !== "object")
                        throw TypeError(".proto.SC_Hero.heroList: object expected");
                    message.heroList[i] = $root.proto.HeroInfo.fromObject(object.heroList[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a SC_Hero message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.SC_Hero
         * @static
         * @param {proto.SC_Hero} message SC_Hero
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SC_Hero.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.heroList = [];
            if (message.heroList && message.heroList.length) {
                object.heroList = [];
                for (var j = 0; j < message.heroList.length; ++j)
                    object.heroList[j] = $root.proto.HeroInfo.toObject(message.heroList[j], options);
            }
            return object;
        };

        /**
         * Converts this SC_Hero to JSON.
         * @function toJSON
         * @memberof proto.SC_Hero
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SC_Hero.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SC_Hero
         * @function getTypeUrl
         * @memberof proto.SC_Hero
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SC_Hero.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.SC_Hero";
        };

        return SC_Hero;
    })();

    proto.HeroInfo = (function() {

        /**
         * Properties of a HeroInfo.
         * @memberof proto
         * @interface IHeroInfo
         * @property {number|null} [id] HeroInfo id
         */

        /**
         * Constructs a new HeroInfo.
         * @memberof proto
         * @classdesc Represents a HeroInfo.
         * @implements IHeroInfo
         * @constructor
         * @param {proto.IHeroInfo=} [properties] Properties to set
         */
        function HeroInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HeroInfo id.
         * @member {number} id
         * @memberof proto.HeroInfo
         * @instance
         */
        HeroInfo.prototype.id = 0;

        /**
         * Creates a new HeroInfo instance using the specified properties.
         * @function create
         * @memberof proto.HeroInfo
         * @static
         * @param {proto.IHeroInfo=} [properties] Properties to set
         * @returns {proto.HeroInfo} HeroInfo instance
         */
        HeroInfo.create = function create(properties) {
            return new HeroInfo(properties);
        };

        /**
         * Encodes the specified HeroInfo message. Does not implicitly {@link proto.HeroInfo.verify|verify} messages.
         * @function encode
         * @memberof proto.HeroInfo
         * @static
         * @param {proto.IHeroInfo} message HeroInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HeroInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
            return writer;
        };

        /**
         * Encodes the specified HeroInfo message, length delimited. Does not implicitly {@link proto.HeroInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.HeroInfo
         * @static
         * @param {proto.IHeroInfo} message HeroInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HeroInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HeroInfo message from the specified reader or buffer.
         * @function decode
         * @memberof proto.HeroInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.HeroInfo} HeroInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HeroInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.HeroInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HeroInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.HeroInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.HeroInfo} HeroInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HeroInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HeroInfo message.
         * @function verify
         * @memberof proto.HeroInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HeroInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            return null;
        };

        /**
         * Creates a HeroInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.HeroInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.HeroInfo} HeroInfo
         */
        HeroInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.HeroInfo)
                return object;
            var message = new $root.proto.HeroInfo();
            if (object.id != null)
                message.id = object.id | 0;
            return message;
        };

        /**
         * Creates a plain object from a HeroInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.HeroInfo
         * @static
         * @param {proto.HeroInfo} message HeroInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HeroInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.id = 0;
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            return object;
        };

        /**
         * Converts this HeroInfo to JSON.
         * @function toJSON
         * @memberof proto.HeroInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HeroInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for HeroInfo
         * @function getTypeUrl
         * @memberof proto.HeroInfo
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        HeroInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.HeroInfo";
        };

        return HeroInfo;
    })();

    proto.SC_User = (function() {

        /**
         * Properties of a SC_User.
         * @memberof proto
         * @interface ISC_User
         * @property {proto.IUserInfo|null} [user] SC_User user
         */

        /**
         * Constructs a new SC_User.
         * @memberof proto
         * @classdesc Represents a SC_User.
         * @implements ISC_User
         * @constructor
         * @param {proto.ISC_User=} [properties] Properties to set
         */
        function SC_User(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SC_User user.
         * @member {proto.IUserInfo|null|undefined} user
         * @memberof proto.SC_User
         * @instance
         */
        SC_User.prototype.user = null;

        /**
         * Creates a new SC_User instance using the specified properties.
         * @function create
         * @memberof proto.SC_User
         * @static
         * @param {proto.ISC_User=} [properties] Properties to set
         * @returns {proto.SC_User} SC_User instance
         */
        SC_User.create = function create(properties) {
            return new SC_User(properties);
        };

        /**
         * Encodes the specified SC_User message. Does not implicitly {@link proto.SC_User.verify|verify} messages.
         * @function encode
         * @memberof proto.SC_User
         * @static
         * @param {proto.ISC_User} message SC_User message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SC_User.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.user != null && Object.hasOwnProperty.call(message, "user"))
                $root.proto.UserInfo.encode(message.user, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SC_User message, length delimited. Does not implicitly {@link proto.SC_User.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.SC_User
         * @static
         * @param {proto.ISC_User} message SC_User message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SC_User.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SC_User message from the specified reader or buffer.
         * @function decode
         * @memberof proto.SC_User
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.SC_User} SC_User
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SC_User.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.SC_User();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.user = $root.proto.UserInfo.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SC_User message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.SC_User
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.SC_User} SC_User
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SC_User.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SC_User message.
         * @function verify
         * @memberof proto.SC_User
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SC_User.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.user != null && message.hasOwnProperty("user")) {
                var error = $root.proto.UserInfo.verify(message.user);
                if (error)
                    return "user." + error;
            }
            return null;
        };

        /**
         * Creates a SC_User message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.SC_User
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.SC_User} SC_User
         */
        SC_User.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.SC_User)
                return object;
            var message = new $root.proto.SC_User();
            if (object.user != null) {
                if (typeof object.user !== "object")
                    throw TypeError(".proto.SC_User.user: object expected");
                message.user = $root.proto.UserInfo.fromObject(object.user);
            }
            return message;
        };

        /**
         * Creates a plain object from a SC_User message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.SC_User
         * @static
         * @param {proto.SC_User} message SC_User
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SC_User.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.user = null;
            if (message.user != null && message.hasOwnProperty("user"))
                object.user = $root.proto.UserInfo.toObject(message.user, options);
            return object;
        };

        /**
         * Converts this SC_User to JSON.
         * @function toJSON
         * @memberof proto.SC_User
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SC_User.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SC_User
         * @function getTypeUrl
         * @memberof proto.SC_User
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SC_User.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.SC_User";
        };

        return SC_User;
    })();

    proto.UserInfo = (function() {

        /**
         * Properties of a UserInfo.
         * @memberof proto
         * @interface IUserInfo
         * @property {number|Long|null} [uid] UserInfo uid
         */

        /**
         * Constructs a new UserInfo.
         * @memberof proto
         * @classdesc Represents a UserInfo.
         * @implements IUserInfo
         * @constructor
         * @param {proto.IUserInfo=} [properties] Properties to set
         */
        function UserInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UserInfo uid.
         * @member {number|Long} uid
         * @memberof proto.UserInfo
         * @instance
         */
        UserInfo.prototype.uid = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new UserInfo instance using the specified properties.
         * @function create
         * @memberof proto.UserInfo
         * @static
         * @param {proto.IUserInfo=} [properties] Properties to set
         * @returns {proto.UserInfo} UserInfo instance
         */
        UserInfo.create = function create(properties) {
            return new UserInfo(properties);
        };

        /**
         * Encodes the specified UserInfo message. Does not implicitly {@link proto.UserInfo.verify|verify} messages.
         * @function encode
         * @memberof proto.UserInfo
         * @static
         * @param {proto.IUserInfo} message UserInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.uid);
            return writer;
        };

        /**
         * Encodes the specified UserInfo message, length delimited. Does not implicitly {@link proto.UserInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.UserInfo
         * @static
         * @param {proto.IUserInfo} message UserInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a UserInfo message from the specified reader or buffer.
         * @function decode
         * @memberof proto.UserInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.UserInfo} UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.UserInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.uid = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a UserInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.UserInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.UserInfo} UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a UserInfo message.
         * @function verify
         * @memberof proto.UserInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UserInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.uid != null && message.hasOwnProperty("uid"))
                if (!$util.isInteger(message.uid) && !(message.uid && $util.isInteger(message.uid.low) && $util.isInteger(message.uid.high)))
                    return "uid: integer|Long expected";
            return null;
        };

        /**
         * Creates a UserInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.UserInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.UserInfo} UserInfo
         */
        UserInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.UserInfo)
                return object;
            var message = new $root.proto.UserInfo();
            if (object.uid != null)
                if ($util.Long)
                    (message.uid = $util.Long.fromValue(object.uid)).unsigned = false;
                else if (typeof object.uid === "string")
                    message.uid = parseInt(object.uid, 10);
                else if (typeof object.uid === "number")
                    message.uid = object.uid;
                else if (typeof object.uid === "object")
                    message.uid = new $util.LongBits(object.uid.low >>> 0, object.uid.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a UserInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.UserInfo
         * @static
         * @param {proto.UserInfo} message UserInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UserInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.uid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.uid = options.longs === String ? "0" : 0;
            if (message.uid != null && message.hasOwnProperty("uid"))
                if (typeof message.uid === "number")
                    object.uid = options.longs === String ? String(message.uid) : message.uid;
                else
                    object.uid = options.longs === String ? $util.Long.prototype.toString.call(message.uid) : options.longs === Number ? new $util.LongBits(message.uid.low >>> 0, message.uid.high >>> 0).toNumber() : message.uid;
            return object;
        };

        /**
         * Converts this UserInfo to JSON.
         * @function toJSON
         * @memberof proto.UserInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UserInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for UserInfo
         * @function getTypeUrl
         * @memberof proto.UserInfo
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        UserInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.UserInfo";
        };

        return UserInfo;
    })();

    proto.SC_Item = (function() {

        /**
         * Properties of a SC_Item.
         * @memberof proto
         * @interface ISC_Item
         * @property {Array.<proto.IItemInfo>|null} [itemList] SC_Item itemList
         */

        /**
         * Constructs a new SC_Item.
         * @memberof proto
         * @classdesc Represents a SC_Item.
         * @implements ISC_Item
         * @constructor
         * @param {proto.ISC_Item=} [properties] Properties to set
         */
        function SC_Item(properties) {
            this.itemList = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SC_Item itemList.
         * @member {Array.<proto.IItemInfo>} itemList
         * @memberof proto.SC_Item
         * @instance
         */
        SC_Item.prototype.itemList = $util.emptyArray;

        /**
         * Creates a new SC_Item instance using the specified properties.
         * @function create
         * @memberof proto.SC_Item
         * @static
         * @param {proto.ISC_Item=} [properties] Properties to set
         * @returns {proto.SC_Item} SC_Item instance
         */
        SC_Item.create = function create(properties) {
            return new SC_Item(properties);
        };

        /**
         * Encodes the specified SC_Item message. Does not implicitly {@link proto.SC_Item.verify|verify} messages.
         * @function encode
         * @memberof proto.SC_Item
         * @static
         * @param {proto.ISC_Item} message SC_Item message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SC_Item.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.itemList != null && message.itemList.length)
                for (var i = 0; i < message.itemList.length; ++i)
                    $root.proto.ItemInfo.encode(message.itemList[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SC_Item message, length delimited. Does not implicitly {@link proto.SC_Item.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.SC_Item
         * @static
         * @param {proto.ISC_Item} message SC_Item message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SC_Item.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SC_Item message from the specified reader or buffer.
         * @function decode
         * @memberof proto.SC_Item
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.SC_Item} SC_Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SC_Item.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.SC_Item();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.itemList && message.itemList.length))
                            message.itemList = [];
                        message.itemList.push($root.proto.ItemInfo.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SC_Item message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.SC_Item
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.SC_Item} SC_Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SC_Item.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SC_Item message.
         * @function verify
         * @memberof proto.SC_Item
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SC_Item.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.itemList != null && message.hasOwnProperty("itemList")) {
                if (!Array.isArray(message.itemList))
                    return "itemList: array expected";
                for (var i = 0; i < message.itemList.length; ++i) {
                    var error = $root.proto.ItemInfo.verify(message.itemList[i]);
                    if (error)
                        return "itemList." + error;
                }
            }
            return null;
        };

        /**
         * Creates a SC_Item message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.SC_Item
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.SC_Item} SC_Item
         */
        SC_Item.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.SC_Item)
                return object;
            var message = new $root.proto.SC_Item();
            if (object.itemList) {
                if (!Array.isArray(object.itemList))
                    throw TypeError(".proto.SC_Item.itemList: array expected");
                message.itemList = [];
                for (var i = 0; i < object.itemList.length; ++i) {
                    if (typeof object.itemList[i] !== "object")
                        throw TypeError(".proto.SC_Item.itemList: object expected");
                    message.itemList[i] = $root.proto.ItemInfo.fromObject(object.itemList[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a SC_Item message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.SC_Item
         * @static
         * @param {proto.SC_Item} message SC_Item
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SC_Item.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.itemList = [];
            if (message.itemList && message.itemList.length) {
                object.itemList = [];
                for (var j = 0; j < message.itemList.length; ++j)
                    object.itemList[j] = $root.proto.ItemInfo.toObject(message.itemList[j], options);
            }
            return object;
        };

        /**
         * Converts this SC_Item to JSON.
         * @function toJSON
         * @memberof proto.SC_Item
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SC_Item.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SC_Item
         * @function getTypeUrl
         * @memberof proto.SC_Item
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SC_Item.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.SC_Item";
        };

        return SC_Item;
    })();

    proto.ItemInfo = (function() {

        /**
         * Properties of an ItemInfo.
         * @memberof proto
         * @interface IItemInfo
         * @property {number|null} [id] ItemInfo id
         * @property {number|null} [kind] ItemInfo kind
         * @property {number|null} [count] ItemInfo count
         * @property {number|null} [label] ItemInfo label
         * @property {number|null} [isBs] ItemInfo isBs
         * @property {number|null} [num1] ItemInfo num1
         * @property {number|null} [num2] ItemInfo num2
         * @property {number|null} [num3] ItemInfo num3
         */

        /**
         * Constructs a new ItemInfo.
         * @memberof proto
         * @classdesc Represents an ItemInfo.
         * @implements IItemInfo
         * @constructor
         * @param {proto.IItemInfo=} [properties] Properties to set
         */
        function ItemInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ItemInfo id.
         * @member {number} id
         * @memberof proto.ItemInfo
         * @instance
         */
        ItemInfo.prototype.id = 0;

        /**
         * ItemInfo kind.
         * @member {number} kind
         * @memberof proto.ItemInfo
         * @instance
         */
        ItemInfo.prototype.kind = 0;

        /**
         * ItemInfo count.
         * @member {number} count
         * @memberof proto.ItemInfo
         * @instance
         */
        ItemInfo.prototype.count = 0;

        /**
         * ItemInfo label.
         * @member {number} label
         * @memberof proto.ItemInfo
         * @instance
         */
        ItemInfo.prototype.label = 0;

        /**
         * ItemInfo isBs.
         * @member {number} isBs
         * @memberof proto.ItemInfo
         * @instance
         */
        ItemInfo.prototype.isBs = 0;

        /**
         * ItemInfo num1.
         * @member {number} num1
         * @memberof proto.ItemInfo
         * @instance
         */
        ItemInfo.prototype.num1 = 0;

        /**
         * ItemInfo num2.
         * @member {number} num2
         * @memberof proto.ItemInfo
         * @instance
         */
        ItemInfo.prototype.num2 = 0;

        /**
         * ItemInfo num3.
         * @member {number} num3
         * @memberof proto.ItemInfo
         * @instance
         */
        ItemInfo.prototype.num3 = 0;

        /**
         * Creates a new ItemInfo instance using the specified properties.
         * @function create
         * @memberof proto.ItemInfo
         * @static
         * @param {proto.IItemInfo=} [properties] Properties to set
         * @returns {proto.ItemInfo} ItemInfo instance
         */
        ItemInfo.create = function create(properties) {
            return new ItemInfo(properties);
        };

        /**
         * Encodes the specified ItemInfo message. Does not implicitly {@link proto.ItemInfo.verify|verify} messages.
         * @function encode
         * @memberof proto.ItemInfo
         * @static
         * @param {proto.IItemInfo} message ItemInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ItemInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.kind);
            if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.count);
            if (message.label != null && Object.hasOwnProperty.call(message, "label"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.label);
            if (message.isBs != null && Object.hasOwnProperty.call(message, "isBs"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.isBs);
            if (message.num1 != null && Object.hasOwnProperty.call(message, "num1"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.num1);
            if (message.num2 != null && Object.hasOwnProperty.call(message, "num2"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.num2);
            if (message.num3 != null && Object.hasOwnProperty.call(message, "num3"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.num3);
            return writer;
        };

        /**
         * Encodes the specified ItemInfo message, length delimited. Does not implicitly {@link proto.ItemInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.ItemInfo
         * @static
         * @param {proto.IItemInfo} message ItemInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ItemInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ItemInfo message from the specified reader or buffer.
         * @function decode
         * @memberof proto.ItemInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.ItemInfo} ItemInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ItemInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.ItemInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.int32();
                        break;
                    }
                case 2: {
                        message.kind = reader.int32();
                        break;
                    }
                case 3: {
                        message.count = reader.int32();
                        break;
                    }
                case 4: {
                        message.label = reader.int32();
                        break;
                    }
                case 5: {
                        message.isBs = reader.int32();
                        break;
                    }
                case 6: {
                        message.num1 = reader.int32();
                        break;
                    }
                case 7: {
                        message.num2 = reader.int32();
                        break;
                    }
                case 8: {
                        message.num3 = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ItemInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.ItemInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.ItemInfo} ItemInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ItemInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ItemInfo message.
         * @function verify
         * @memberof proto.ItemInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ItemInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.kind != null && message.hasOwnProperty("kind"))
                if (!$util.isInteger(message.kind))
                    return "kind: integer expected";
            if (message.count != null && message.hasOwnProperty("count"))
                if (!$util.isInteger(message.count))
                    return "count: integer expected";
            if (message.label != null && message.hasOwnProperty("label"))
                if (!$util.isInteger(message.label))
                    return "label: integer expected";
            if (message.isBs != null && message.hasOwnProperty("isBs"))
                if (!$util.isInteger(message.isBs))
                    return "isBs: integer expected";
            if (message.num1 != null && message.hasOwnProperty("num1"))
                if (!$util.isInteger(message.num1))
                    return "num1: integer expected";
            if (message.num2 != null && message.hasOwnProperty("num2"))
                if (!$util.isInteger(message.num2))
                    return "num2: integer expected";
            if (message.num3 != null && message.hasOwnProperty("num3"))
                if (!$util.isInteger(message.num3))
                    return "num3: integer expected";
            return null;
        };

        /**
         * Creates an ItemInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.ItemInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.ItemInfo} ItemInfo
         */
        ItemInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.ItemInfo)
                return object;
            var message = new $root.proto.ItemInfo();
            if (object.id != null)
                message.id = object.id | 0;
            if (object.kind != null)
                message.kind = object.kind | 0;
            if (object.count != null)
                message.count = object.count | 0;
            if (object.label != null)
                message.label = object.label | 0;
            if (object.isBs != null)
                message.isBs = object.isBs | 0;
            if (object.num1 != null)
                message.num1 = object.num1 | 0;
            if (object.num2 != null)
                message.num2 = object.num2 | 0;
            if (object.num3 != null)
                message.num3 = object.num3 | 0;
            return message;
        };

        /**
         * Creates a plain object from an ItemInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.ItemInfo
         * @static
         * @param {proto.ItemInfo} message ItemInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ItemInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = 0;
                object.kind = 0;
                object.count = 0;
                object.label = 0;
                object.isBs = 0;
                object.num1 = 0;
                object.num2 = 0;
                object.num3 = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.kind != null && message.hasOwnProperty("kind"))
                object.kind = message.kind;
            if (message.count != null && message.hasOwnProperty("count"))
                object.count = message.count;
            if (message.label != null && message.hasOwnProperty("label"))
                object.label = message.label;
            if (message.isBs != null && message.hasOwnProperty("isBs"))
                object.isBs = message.isBs;
            if (message.num1 != null && message.hasOwnProperty("num1"))
                object.num1 = message.num1;
            if (message.num2 != null && message.hasOwnProperty("num2"))
                object.num2 = message.num2;
            if (message.num3 != null && message.hasOwnProperty("num3"))
                object.num3 = message.num3;
            return object;
        };

        /**
         * Converts this ItemInfo to JSON.
         * @function toJSON
         * @memberof proto.ItemInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ItemInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ItemInfo
         * @function getTypeUrl
         * @memberof proto.ItemInfo
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ItemInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.ItemInfo";
        };

        return ItemInfo;
    })();

    return proto;
})();

module.exports = $root;
