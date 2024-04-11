#include "rest.h"

#include <QJsonObject>
#include <QNetworkRequest>
#include <QRestReply>
#include <qjsondocument.h>

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

    const QString url = "http://localhost:8008/api/login/with_card/" + card_number;
    const auto request = QNetworkRequest(url);

    qDebug() << "URL:" << url;
    qDebug() << "PIN:" << pin;

    m_rest_manager->get(request, QJsonDocument(body), nullptr, [&](QRestReply& reply) {
        auto json_optional = reply.readJson();
        if (!json_optional.has_value()) {
            emit login_request_finished(Response(Response::Code::SERVER_ERROR));
            qDebug() << "Empty reply";
            return;
        }

        auto json = json_optional.value();
        auto code = json["code"].toInt();
        auto token = json["token"].toString();
        auto partial_token = json["partial_token"].toBool();
        
        qDebug() << "code:" << code;
        qDebug() << "token:" << token;
        qDebug() << "partial_token:" << partial_token;

        if (code == Response::Code::OK) {
            auto data = json.object();
            data.remove("code");
            emit login_request_finished({ QJsonDocument(data) });
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
