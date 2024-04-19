#include "balance.h"

#include "ui_balance.h"

#include <REST/rest.h>
#include <QJsonObject>
#include <QJsonArray>

#include <QDebug>


Balance::Balance(QWidget *parent)
    : QWidget(parent)
    , ui(new Ui::Balance)
{
    ui->setupUi(this);
    ui->labelBalance->setText("HELLO");

    connect(REST::the(),
            &REST::balance_request_finished,
            this,
            [this](Response response){
                if(response.has_data()){
                    auto data = response.data();
                    auto dataRecent = data["recenttransactions"];
                    qDebug() << data["balance"];
                    for(auto i: dataRecent.toArray()){
                        auto x = i.toObject();
                        qDebug() << x["balanceChange"].toString() + " " + x["dateTime"].toString();

                    }
                }
                ui->labelBalance->setText("BLAA");
            }
    );
}

Balance::~Balance()
{
    delete ui;
}

void Balance::setBalance(const QString &balance)
{
    ui->labelBalance->setText(balance);
}

void Balance::on_btnMenu_clicked()
{
    REST *pre = REST::the();
    pre->make_balance_request("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50TnVtYmVyIjoiZjIxZGQ4Y2QtZmQ1OS0xMWVlLTljMzQtNzQ1NjNjMGEzN2Y2IiwiaWF0IjoxNzEzNDU1OTg0fQ.5EUH5OLv5ZYTsz6393ldeyEJqBR1wN4ApxqSkfpxd30");
    //ui->labelBalance->setText("balance");
}

