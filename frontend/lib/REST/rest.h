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
#include <qrestaccessmanager.h>

class Response final
{
public:
    enum class Code : unsigned char {
        OK = 0,
        CARD_NOT_FOUND,
        INCORRECT_PIN,
        CARD_FROZEN
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
    QJsonDocument data() const { return m_data.value(); }

private:
    Code m_code;
    std::optional<QJsonDocument> m_data;
};

class REST final : public QObject
{
    Q_OBJECT

public:
    REST();
    ~REST();

private:
    QNetworkAccessManager *m_manager = nullptr;
    QRestAccessManager *m_rest_manager = nullptr;
};
