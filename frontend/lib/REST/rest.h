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

#define BASE_URL (QString("https://banksimul.embwebbed.com"))

class REST_API Response final
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
        INSUFFICIENT_FUNDS,
        SERVER_ERROR = 500
    };

    Response() = delete;
    Response(int code, const std::optional<QJsonDocument>& data = {})
        : m_code(code), m_data(data)
    {
    }

    // m_code == Code::OK: m_data has data
    // m_code != Code::OK: m_data is empty
    int code() const { return m_code; }
    bool has_data() const { return m_data.has_value(); }
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
    void make_balance_request(const QString& token);
    void make_prewithdraw_request(const QString& token);
    void make_withdraw_request(const QString& token, double amount);
    void make_transactions_request(const QString& token, int index = 0, int amount = 5);

signals:
    void login_request_finished(Response);
    void balance_request_finished(Response);
    void prewithdraw_request_finished(Response);
    void withdraw_request_finished(Response);
    void transactions_request_finished(Response);

private:
    QNetworkAccessManager *m_network_manager = nullptr;
    QRestAccessManager *m_rest_manager = nullptr;
};
