#include "mainwindow.h"
#include "REST/rest.h"
#include "ui_mainwindow.h"

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
