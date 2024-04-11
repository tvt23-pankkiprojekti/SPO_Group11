#include "mainwindow.h"
#include "REST/rest.h"
#include "ui_mainwindow.h"
#include <qcoreapplication.h>
#include <qlogging.h>

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
    , m_reader(CardReader::getInstance())

    , login(new Login)
    , menu(new Menu)
    , balance(new Balance)
    , transactions(new Transactions)
    , withdraw(new Withdraw)
{
    ui->setupUi(this);

    for (auto widget: std::initializer_list<QWidget*>{
        login,
        menu,
        balance,
        transactions,
        withdraw
    })
        ui->stackedWidget->addWidget(widget);

    // TODO: Implement these

    // connect(..., ..., this, [this]() {
    //     REST::make_login_request(...);
    // });

    // REST::the()->make_login_request("1000200030004000", "1111");
    // REST::the()->make_login_request("1000200030004001", "2222");
    // REST::the()->make_login_request("1000200030004002", "3333");
    // REST::the()->make_login_request("1000200030004003", "4444");
    REST::the()->make_login_request("1000200030004004", "5555");

    resize(200, 50);

    // connect(..., ..., this, [this]() {
    //     REST::make_balance_request(...);
    // });

    // connect(..., ..., this, [this]() {
    //     REST::make_withdraw_request(...);
    // });

    // connect(..., ..., this, [this]() {
    //     REST::make_transactions_request(...);
    // });

    connect(REST::the(), &REST::login_request_finished, this, [this](Response response) {
        qDebug() << "LOGIN_REQUEST_FINISHED:";
        qDebug() << "code:" << response.code();
        qDebug() << "has_data:" << response.has_data();
        if (response.has_data())
            qDebug() << "data:" << response.data().toJson().toStdString();
            
        switch (response.code()) {
            case Response::Code::OK: qDebug() << "OK"; break;
            case Response::Code::CARD_NOT_FOUND: qDebug() << "CARD_NOT_FOUND"; break;
            case Response::Code::INCORRECT_PIN: qDebug() << "INCORRECT_PIN"; break;
            case Response::Code::CARD_FROZEN: qDebug() << "CARD_FROZEN"; break;
            case Response::Code::NO_ACCOUNT_LINKED: qDebug() << "NO_ACCOUNT_LINKED"; break;
            case Response::Code::MISSING_PARAMETERS: qDebug() << "MISSING_PARAMETERS"; break;
            case Response::Code::INVALID_TOKEN: qDebug() << "INVALID_TOKEN"; break;
            case Response::Code::SERVER_ERROR: qDebug() << "SERVER_ERROR"; break;
        }
    });

    // connect(REST::the(), &REST::balance_request_finished, this, [this](Response response) {
    //
    // });

    // connect(REST::the(), &REST::login_request_finished, this, [this](Response response) {
    //
    // });

    // connect(REST::the(), &REST::login_request_finished, this, [this](Response response) {
    //
    // });
}

MainWindow::~MainWindow()
{
    REST::end();
}
