#include "rest.h"

#include <QJsonObject>
#include <QNetworkRequest>
#include <QRestReply>

static REST *__rest = nullptr;

static const QString LOGIN_REQUEST_URL = "http://localhost:8008/api/login/with_card/";

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

    const QString url = LOGIN_REQUEST_URL + card_number;
    const auto request = QNetworkRequest(url);
    m_rest_manager->post(request, QJsonDocument(body), nullptr, [&](QRestReply& reply) {
        auto json_optional = reply.readJson();
        if (!json_optional.has_value()) {
            emit login_request_finished(Response(Response::Code::SERVER_ERROR));
            return;
        }

        auto json = json_optional.value();
        auto code = json["code"].toInt();
        auto token = json["token"].toString();
        auto partial_token = json["partial_token"].toBool();

        if (code == Response::Code::OK) {
            auto data = json.object();
            data.remove("code");
            emit login_request_finished({ code, QJsonDocument(data) });
            return;
        }
        else if (code == Response::Code::ASK_FOR_TYPE) {
            emit login_request_finished({ code, QJsonDocument({{ "token", token }})});
            return;
        }

        emit login_request_finished({ code });
    });
}

void REST::make_type_request(const QString& partial_token, const QString& type)
{

}

void REST::make_balance_request()
{

}

void REST::make_withdraw_request()
{

}

void REST::make_transactions_request()
{

}
