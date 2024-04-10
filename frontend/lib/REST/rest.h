// libREST.dll

// login (STR card_number, STR pin)
// OK -> STR signed_account_number
// ERROR -> 1 ERR_CARD_NOT_FOUND
//          2 ERR_INCORRECT_PIN
//          3 ERR_CARD_FROZEN

// balance (STR signed_account_number)
// OK -> NUM balance
// ERROR -> 4 ERR_INVALID_ACCOUNT_NUMBER

// withdraw (STR signed_account_number, NUM amount)
// OK -> NUM balance_change
// ERROR -> 4 ERR_INVALID_ACCOUNT_NUMBER
//          5 ERR_NO_MONEY

// transactions (STR signed_account_number)
// OK -> JSON transactions
// ERROR -> 4 ERR_INVALID_ACCOUNT_NUMBER

#pragma once

#include <optional>

#include <QJsonDocument>
#include <QNetworkAccessManager>
#include <QtCore/QtGlobal>
#include <qrestaccessmanager.h>

#ifdef REST_SHARED_LIBRARY
#   define REST_API Q_DECL_EXPORT
#else
#   define REST_API Q_DECL_IMPORT
#endif

class REST_API [[nodiscard]] Response final
{
public:
    enum class Code : unsigned char {
        // for all
        OK,
        REQUEST_ERROR,
        SERVER_ERROR,
        UNKNOWN_ERROR,

        // for login
        CARD_NOT_FOUND,
        INCORRECT_PIN,
        CARD_FROZEN,
        NO_ACCOUNT,

        // for balance, withdraw, transactions
        // INVALID_SESSION, // invalid signed_account_number

        // for balance

        // for withdraw
        // INSUFFICIENT_FUNDS,

        // for transactions
        // NO_TRANSACTIONS // Not really an error, can be deduced from the data being empty
    };

    Response() = delete;
    Response(Code code)
        : m_code(code), m_data({})
    {
    }

    Response(const QJsonDocument& data)
        : m_code(Code::OK), m_data(data)
    {
    }

    // m_code == Code::OK: m_data has data
    // m_code != Code::OK: m_data is empty
    Code code() const { return m_code; }
    bool has_data() const { return m_data.has_value() && m_code == Code::OK; }
    QJsonDocument data() const { return m_data.value(); }

    void set_code(Code code) { m_code = code; }
    void set_data(const QJsonDocument& data) { m_data = data; }

private:
    Code m_code;
    std::optional<QJsonDocument> m_data;
};

class REST_API REST final : public QObject
{
    Q_OBJECT

public:
    /**
     * Returns a pointer to the REST instance
     *
     * If the instance does not exist yet, one will be created
     */
    static REST *the();

    /**
     * Deletes the REST instance, if one exists
     */
    static void end();

    void make_login_request(const QString& card_number, const QString& pin);
    void make_balance_request();
    void make_withdraw_request();
    void make_transactions_request();

signals:
    void login_request_finished(Response);
    void balance_request_finished(Response);
    void withdraw_request_finished(Response);
    void transactions_request_finished(Response);

private:
    QNetworkAccessManager *m_network_manager = nullptr;
    QRestAccessManager *m_rest_manager = nullptr;
};
