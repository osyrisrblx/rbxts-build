"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommandName = void 0;
function getCommandName(settings, command) {
    var _a, _b;
    return (_b = (_a = settings === null || settings === void 0 ? void 0 : settings.names) === null || _a === void 0 ? void 0 : _a[command]) !== null && _b !== void 0 ? _b : command;
}
exports.getCommandName = getCommandName;
//# sourceMappingURL=getCommandName.js.map