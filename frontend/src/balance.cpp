#include "balance.h"
#include "ui_balance.h"
#include "mainwindow.h"

#include <REST/rest.h>
#include <QJsonObject.h>
#include <QJsonArray>



Balance::Balance(MainWindow *parent)
    : QWidget(parent)
    , m_ui(new Ui::Balance)
{
    m_ui->setupUi(this);
    m_ui->textTransactions->setReadOnly(true);
    connect(REST::the(),
            &REST::balance_request_finished,
            this,
            [this](Response response){
                if(response.has_data()){
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
            }
    );

    connect(m_ui->pushButtonMenu, &QPushButton::clicked, this, [=, this]() {
        parent->show_menu();
    });
}

Balance::~Balance()
{
    delete m_ui;
}

void Balance::setBalance(const QString &balance)
{
    m_ui->labelBalance->setText(balance);
}

void Balance::on_btnMenu_clicked()
{
    REST *pre = REST::the();
    pre->make_balance_request("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50TnVtYmVyIjoiOGZjMDM0N2MtZmUyZi0xMWVlLThkZjAtOGMxNjQ1NDAzNDc3IiwiaWF0IjoxNzEzNTIxNDM2fQ.JWH1BcDN5av-w9Mx05ZCtYEE5Rjc2L1Mu1CXo3Uv0Mc");
    //this->close();
    //parent->show_menu();
}

