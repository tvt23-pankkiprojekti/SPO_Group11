#include "rest.h"

#include <QNetworkRequest>
#include <QRestReply>

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
