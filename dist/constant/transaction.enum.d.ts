export declare enum TransactionType {
    IMPORT = "import",
    EXPORT = "export",
    TRANSFER = "transfer",
    TRANSFER_IN = "transfer-in",
    TRANSFER_OUT = "transfer-out",
    ADJUST = "adjust"
}
export declare enum TransactionStatus {
    PENDING = "pending",
    IN_TRANSIT = "in_ transit",
    RECEIVED = "received",
    APPROVED = "approved",
    REJECT = "reject"
}
export declare enum TransactionSource {
    ORDER = "order",
    RETURN = "return",
    MANUAL = "manual",
    TRANSFER = "transfer",
    CANCELLED = "cancelled"
}
