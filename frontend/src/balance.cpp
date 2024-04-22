#include "balance.h"
#include "ui_balance.h"
#include "mainwindow.h"

#include <REST/rest.h>

#ifdef QT_DEBUG
#include <QDebug>
#endif

Balance::Balance(MainWindow *parent)
    : QWidget(parent)
    , m_ui(new Ui::Balance)
{
    m_ui->setupUi(this);

    m_ui->textTransactions->setReadOnly(true);

    // Timer connections
    connect(&anotherTimer,
            &QTimer::timeout,
            this,
            [this]{
                if (point != QCursor::pos()){
                    #ifdef QT_DEBUG
                    qDebug("interaction");
                    #endif
                    usersActionTimer.start();
                }
                point = QCursor::pos();
            });

    connect(&usersActionTimer,
                &QTimer::timeout,
                this,
                [=, this]{
                    #ifdef QT_DEBUG
                    qDebug("Ten seconds passed");
                    #endif
                    reset();
                    m_ui->textTransactions->clear();
                    parent->show_menu();
                }
    );

    // other connections
    connect(m_ui->pushButton, &QPushButton::clicked, this, [=, this]() {
        reset();
        m_ui->textTransactions->clear();
        parent->show_menu();
    });

    connect(REST::the(),
            &REST::balance_request_finished,
            this,
            [=, this](Response response){
                // timers need these
                qDebug() << "NEW the() REQUEST";
                usersActionTimer.start(10000);
                anotherTimer.start(1000);
                point = QCursor::pos();
                if(response.code() == Response::Code::OK){ //this returns 0, even thought database is turned off. As a result balance and recent transactions don't return.
                    auto data = response.data();
                    // show recent transactions
                    auto dataRecent = data["recenttransactions"];
                    for(auto i: dataRecent.toArray()){
                        auto x = i.toObject();
                        auto balance = x["balanceChange"].toString() + "€";
                        auto date = x["dateTime"].toString();
                        QDateTime dateTime = QDateTime::fromString(date, Qt::ISODateWithMs);
                        QString dateString = dateTime.toString("hh:mm dd.MM.yyyy");
                        m_ui->textTransactions->append((balance + "\t" + dateString));
                    }
                    // set label to show current balance
                    auto dataBalance = data["balance"].toObject();
                    auto balanceString = dataBalance["balance"].toString();
                    setBalance(balanceString);
                }
                else if(response.code() == Response::Code::INVALID_TOKEN){
                    // token is deleted and we go to login screen
                    // User needs to be notified. Maybe in the login screen?
                    reset();
                    emit logOut();
                }
                else {
                    reset();
                    parent->show_status(this, "Server error (Code 500)");
                }
            }
    );
}

Balance::~Balance()
{
    delete m_ui;
}

void Balance::setBalance(const QString &balance)
{
    m_ui->labelBalance->setText(balance);
}

void Balance::reset()
{
    usersActionTimer.stop();
    anotherTimer.stop();
}
