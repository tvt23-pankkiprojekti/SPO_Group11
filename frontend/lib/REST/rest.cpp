#include "rest.h"

#include <QNetworkRequest>
#include <QRestReply>

REST::REST()
{
    m_manager = new QNetworkAccessManager();
    m_rest_manager = new QRestAccessManager(m_manager);
}

REST::~REST()
{
    delete m_rest_manager;
    delete m_manager;
}

void REST::make_login_request()
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
