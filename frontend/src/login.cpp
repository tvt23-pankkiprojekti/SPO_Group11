#include "login.h"
#include "ui_login.h"

#include <QPushButton>
#include <QStackedWidget>

#ifdef QT_DEBUG
#include <QDebug>
#endif

Login::Login(QWidget *parent)
    : QWidget(parent)
    , ui(new Ui::Login)
    , m_reader(CardReader::getInstance())
{
    ui->setupUi(this);

    auto port = CardReader::findPort();
    if (port) m_reader.open(port);
    else qDebug() << "Can't find card reader :(";

    QObject::connect(
        &m_reader,
        &CardReader::cardRead,
        this,
        [this](QString cardN){
            auto parent = qobject_cast<QStackedWidget*>(this->parent());

            if (parent->currentWidget() != this) {
                return;
            }

            #ifdef QT_DEBUG
            qDebug() << QString("logging in as ") + cardN;
            #endif

            emit loggedIn(cardN);
        }
    );
}

Login::~Login()
{
    delete ui;
}
