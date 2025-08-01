"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionSource = exports.TransactionStatus = exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["IMPORT"] = "import";
    TransactionType["EXPORT"] = "export";
    TransactionType["TRANSFER"] = "transfer";
    TransactionType["TRANSFER_IN"] = "transfer-in";
    TransactionType["TRANSFER_OUT"] = "transfer-out";
    TransactionType["ADJUST"] = "adjust";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["IN_TRANSIT"] = "in_ transit";
    TransactionStatus["RECEIVED"] = "received";
    TransactionStatus["APPROVED"] = "approved";
    TransactionStatus["REJECT"] = "reject";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var TransactionSource;
(function (TransactionSource) {
    TransactionSource["ORDER"] = "order";
    TransactionSource["RETURN"] = "return";
    TransactionSource["MANUAL"] = "manual";
    TransactionSource["TRANSFER"] = "transfer";
    TransactionSource["CANCELLED"] = "cancelled";
})(TransactionSource || (exports.TransactionSource = TransactionSource = {}));
//# sourceMappingURL=transaction.enum.js.map