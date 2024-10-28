"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gene = void 0;
var wire_1 = require("./wire");
var Gene = /** @class */ (function (_super) {
    __extends(Gene, _super);
    function Gene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._kodo = null;
        _this._isFrozen = false;
        return _this;
    }
    Object.defineProperty(Gene.prototype, "kodo", {
        get: function () {
            return this._kodo;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Gene.prototype, "isActive", {
        get: function () {
            return !!this._kodo && this._kodo.isAlive;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Gene.prototype, "isFrozen", {
        get: function () {
            return this._isFrozen;
        },
        enumerable: false,
        configurable: true
    });
    Gene.prototype.init = function (kodo) {
        this._kodo = kodo;
        this._isFrozen = false;
        this.onInit();
    };
    Gene.prototype.freeze = function () {
        this._detachWireListeners();
        this._isFrozen = true;
        this.onFreeze();
    };
    Gene.prototype.continue = function () {
        this._attachWireListeners();
        this._isFrozen = false;
        this.onResume();
    };
    Gene.prototype.kill = function () {
        this._detachWireListeners();
        this.onKill();
        this._kodo = null;
    };
    Gene.prototype.onInit = function () { };
    Gene.prototype.onFreeze = function () { };
    Gene.prototype.onResume = function () { };
    Gene.prototype.onKill = function () { };
    return Gene;
}(wire_1.Wiring));
exports.Gene = Gene;
//# sourceMappingURL=gene.js.map