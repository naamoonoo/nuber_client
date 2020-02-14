"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Verification_1 = __importDefault(require("../../../entities/Verification"));
var email_1 = require("../../../utils/email");
var resolverProtector_1 = require("../../../utils/resolverProtector");
var resolvers = {
    Mutation: {
        EmailVerification: resolverProtector_1.authResolverProtector(function (_, __, _a) {
            var req = _a.req;
            return __awaiter(void 0, void 0, void 0, function () {
                var user, existedVerification, newVerification, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            user = req.user;
                            if (!user.email) return [3 /*break*/, 6];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, Verification_1.default.findOne({
                                    payload: user.email
                                })];
                        case 2:
                            existedVerification = _b.sent();
                            if (existedVerification) {
                                existedVerification.remove();
                            }
                            return [4 /*yield*/, Verification_1.default.create({
                                    payload: user.email,
                                    target: "EMAIL"
                                }).save()];
                        case 3:
                            newVerification = _b.sent();
                            return [4 /*yield*/, email_1.sendVerificationMail(newVerification.payload, newVerification.key)];
                        case 4:
                            _b.sent();
                            user.email = newVerification.payload;
                            user.verifiedEmail = false;
                            user.save();
                            return [2 /*return*/, {
                                    res: true,
                                    error: null
                                }];
                        case 5:
                            error_1 = _b.sent();
                            return [2 /*return*/, {
                                    res: false,
                                    error: error_1.message
                                }];
                        case 6: return [2 /*return*/, {
                                res: false,
                                error: "user should have email address for verification"
                            }];
                    }
                });
            });
        }),
        ValidateEmailVerification: resolverProtector_1.authResolverProtector(function (_, args, _a) {
            var req = _a.req;
            return __awaiter(void 0, void 0, void 0, function () {
                var key, user, requestedVerification, error_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            key = args.key;
                            user = req.user;
                            if (!user.email) return [3 /*break*/, 4];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            console.log(user.email);
                            console.log(key);
                            return [4 /*yield*/, Verification_1.default.findOne({
                                    payload: user.email,
                                    key: key // key is the same one which is requested
                                })];
                        case 2:
                            requestedVerification = _b.sent();
                            if (requestedVerification) {
                                requestedVerification.verified = true;
                                requestedVerification.save();
                                user.verifiedEmail = true;
                                user.save();
                                return [2 /*return*/, {
                                        res: true,
                                        error: null
                                    }];
                            }
                            else {
                                return [2 /*return*/, {
                                        res: false,
                                        error: "verficiation is not valid"
                                    }];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _b.sent();
                            return [2 /*return*/, {
                                    res: false,
                                    error: error_2.message
                                }];
                        case 4: return [2 /*return*/, {
                                res: false,
                                error: "user don't have a mail for verification"
                            }];
                    }
                });
            });
        })
    }
};
exports.default = resolvers;
//# sourceMappingURL=EmailVerification.resolvers.js.map