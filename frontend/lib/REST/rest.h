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
    // This should be identical to responses.js
    enum Code {
        OK = 0,
        CARD_NOT_FOUND,
        INCORRECT_PIN,
        CARD_FROZEN,
        NO_ACCOUNT_LINKED,
        MISSING_PARAMETERS,
        INVALID_TOKEN,
        SERVER_ERROR = 500
    };

    Response() = delete;
    Response(int code)
        : m_code(code), m_data({})
    {
    }

    Response(const QJsonDocument& data)
        : m_code(Code::OK), m_data(data)
    {
    }

    // m_code == Code::OK: m_data has data
    // m_code != Code::OK: m_data is empty
    int code() const { return m_code; }
    bool has_data() const { return m_data.has_value() && m_code == Code::OK; }
    QJsonDocument data() const { return m_data.value(); }

    void set_code(int code) { m_code = code; }
    void set_data(const QJsonDocument& data) { m_data = data; }

private:
    int m_code;
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
    void make_type_request(const QString& partial_token, const QString& type);
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
