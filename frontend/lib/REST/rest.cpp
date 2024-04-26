#include "rest.h"

#include <QJsonObject>
#include <QNetworkRequest>
#include <QRestReply>

#define HANDLE_REPLY(_reply, _signal)                                           \
    auto json_optional = _reply.readJson();                                     \
    if (!json_optional.has_value()) {                                           \
        emit _signal(Response(Response::Code::SERVER_ERROR));                   \
        return;                                                                 \
    }                                                                           \
    auto data = json_optional.value();                                          \
    auto code = data["code"].toInt();                                           \
    if (code == Response::Code::OK) {                                           \
        emit _signal({ code, data });                                           \
        return;                                                                 \
    }                                                                           \
    emit _signal({ code });

static REST *__rest = nullptr;

REST *REST::the()
{
    if (!__rest) {
        __rest = new REST();
        __rest->m_network_manager = new QNetworkAccessManager();
        __rest->m_rest_manager = new QRestAccessManager(__rest->m_network_manager);
    }

    return __rest;
}

void REST::end()
{
    delete __rest->m_rest_manager;
    delete __rest->m_network_manager;
    delete __rest;

    __rest = nullptr;
}

void REST::make_login_request(const QString& card_number, const QString& pin)
{
    QJsonObject body;
    body["pin"] = pin;

    const QString url = BASE_URL + "/api/login/" + card_number;
    const auto request = QNetworkRequest(url);
    
    m_rest_manager->post(request, QJsonDocument(body), nullptr, [&](QRestReply& reply) {
        HANDLE_REPLY(reply, login_request_finished);
    });
}

void REST::make_balance_request(const QString& token)
{
    const QString url = BASE_URL + "/api/balance";
    auto request = QNetworkRequest(url);
    request.setRawHeader("authorization", token.toUtf8());

    m_rest_manager->get(request, nullptr, [&](QRestReply& reply) {
        HANDLE_REPLY(reply, balance_request_finished);
    });
}

void REST::make_prewithdraw_request(const QString& token)
{
    const QString url = BASE_URL + "/api/prewithdraw";
    auto request = QNetworkRequest(url);
    request.setRawHeader("authorization", token.toUtf8());

    m_rest_manager->get(request, nullptr, [&](QRestReply& reply) {
        HANDLE_REPLY(reply, prewithdraw_request_finished);
    });
}

void REST::make_withdraw_request(const QString& token, double amount)
{
    QJsonObject body;
    body["amount"] = amount;
    
    const QString url = BASE_URL + "/api/withdraw";
    auto request = QNetworkRequest(url);
    request.setRawHeader("authorization", token.toUtf8());

    m_rest_manager->post(request, QJsonDocument(body), nullptr, [&](QRestReply& reply) {
        HANDLE_REPLY(reply, withdraw_request_finished);
    });
}

void REST::make_transactions_request(const QString& token, int index, int amount)
{
    QJsonObject body;
    body["index"] = index;
    body["amount"] = amount;

    const QString url = BASE_URL + "/api/transactions";
    auto request = QNetworkRequest(url);
    request.setRawHeader("authorization", token.toUtf8());

    m_rest_manager->post(request, QJsonDocument(body), nullptr, [&](QRestReply& reply) {
        HANDLE_REPLY(reply, transactions_request_finished);
    });
}
