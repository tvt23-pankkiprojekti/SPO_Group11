#include "balance.h"
#include "ui_balance.h"
#include "mainwindow.h"

#include <REST/rest.h>

#ifdef QT_DEBUG
#include <QDebug>
#endif

Balance::Balance(QWidget *mousePointerLogin, MainWindow *parent)
    : QWidget(parent)
    , m_ui(new Ui::Balance)
{
    m_ui->setupUi(this);

    m_ui->textTransactions->setReadOnly(true);

    // Timer connections
    connect(&mouseMovementTimer,
            &QTimer::timeout,
            this,
            [this]{
                if (mousePoint != QCursor::pos()){
                    #ifdef QT_DEBUG
                    qDebug("interaction");
                    #endif
                    noUserActionTimer.start();
                }
                mousePoint = QCursor::pos();
            });

    connect(&noUserActionTimer,
                &QTimer::timeout,
                this,
                [=, this]{
                    #ifdef QT_DEBUG
                    qDebug("Ten seconds passed");
                    #endif
                    resetTimers();
                    m_ui->textTransactions->clear();
                    parent->show_menu();
                }
    );

    // other connections
    connect(m_ui->pushButton, &QPushButton::clicked, this, [=, this]() {
        resetTimers();
        m_ui->textTransactions->clear();
        parent->show_menu();
    });

    connect(REST::the(),
            &REST::balance_request_finished,
            this,
            [=, this](Response response){
                // timers need these
                noUserActionTimer.start(10000);
                mouseMovementTimer.start(1000);
                mousePoint = QCursor::pos();
                if(response.code() == Response::Code::OK){
                    auto data = response.data();
                    // set label to show current balance
                    auto dataBalance = data["balance"].toObject();
                    auto balanceString = dataBalance["balance"].toString();
                    m_ui->labelBalance->setText(balanceString);

                    REST::the()->make_transactions_request(parent->token());
                }
                else if(response.code() == Response::Code::INVALID_TOKEN){
                    parent->show_status(mousePointerLogin, "Session expired (Code 6)", false, "Log back in");
                    resetTimers();
                }
                else {
                    resetTimers();
                    parent->show_status(this, "Server error (Code 500)");
                }
            }
    );

    connect(REST::the(), &REST::transactions_request_finished, this, [=, this](Response response) {
        if (response.code() == Response::Code::OK) {
            // show recent transactions (max is 5)
            auto data = response.data().array();

            for(const auto& i : data){
                auto x = i.toObject();
                auto balance = x["balanceChange"].toString() + "€";
                auto date = x["dateTime"].toString();
                QDateTime dateTime = QDateTime::fromString(date, Qt::ISODateWithMs);
                QString dateString = dateTime.toString("hh:mm dd.MM.yyyy");
                m_ui->textTransactions->append((balance + "\t" + dateString));
            }
        }
        else if(response.code() == Response::Code::INVALID_TOKEN){
            parent->show_status(mousePointerLogin, "Session expired (Code 6)", false, "Log back in");
            resetTimers();
        }
        else {
            resetTimers();
            parent->show_status(this, "Server error (Code 500)");
        }
    });
}

Balance::~Balance()
{
    delete m_ui;
}

void Balance::resetTimers()
{
    noUserActionTimer.stop();
    mouseMovementTimer.stop();
}
