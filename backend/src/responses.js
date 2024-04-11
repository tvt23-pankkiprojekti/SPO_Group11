// Status codes:
// 0    OK, just a 200 OK status might be sufficient here?
// 1    Card not found
// 2    Incorrect pin
// 3    Card frozen
// 4    No account linked
// 5    Missing parameters (no pin, or type and token)
// 6    Invalid token
// 500  Server error

const Response = {
    OK: 0,
    CARD_NOT_FOUND: 1,
    INCORRECT_PIN: 2,
    CARD_FROZEN: 3,
    NO_ACCOUNT_LINKED: 4,
    MISSING_PARAMETERS: 5,
    INVALID_TOKEN: 6,
    ASK_FOR_TYPE: 7,
    SERVER_ERROR: 500
};

module.exports = Response;
