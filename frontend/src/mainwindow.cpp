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
    // REST::the()->make_login_request("1000200030004004", "5555");

    // connect(..., ..., this, [this]() {
    //     REST::make_balance_request(...);
    // });

    // connect(..., ..., this, [this]() {
    //     REST::make_withdraw_request(...);
    // });

    // connect(..., ..., this, [this]() {
    //     REST::make_transactions_request(...);
    // });

    // connect(REST::the(), &REST::login_request_finished, this, [this](Response response) {
    // 
    // });

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
