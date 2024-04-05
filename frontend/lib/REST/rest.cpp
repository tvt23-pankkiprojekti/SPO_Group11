#include "rest.h"

#include <QNetworkRequest>
#include <QRestReply>

REST::REST()
{
    qDebug() << "REST initialized\n";

    m_manager = new QNetworkAccessManager();
    m_rest_manager = new QRestAccessManager(m_manager);
}

REST::~REST()
{
    delete m_rest_manager;
    delete m_manager;
}
