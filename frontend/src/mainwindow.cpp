#include "mainwindow.h"
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
    m_rest = new REST();

    for (auto widget: std::initializer_list<QWidget*>{
        login,
        menu,
        balance,
        transactions,
        withdraw
    })
        ui->stackedWidget->addWidget(widget);

    // TODO: Implement these

    // connect(..., ..., this, &REST::make_login_request);
    // connect(..., ..., this, &REST::make_balance_request);
    // connect(..., ..., this, &REST::make_withdraw_request);
    // connect(..., ..., this, &REST::make_transactions_request);

    // connect(m_rest, &REST::login_request_finished, this, [this](Response response) {
    //
    // });

    // connect(m_rest, &REST::balance_request_finished, this, [this](Response response) {
    //
    // });

    // connect(m_rest, &REST::login_request_finished, this, [this](Response response) {
    //
    // });

    // connect(m_rest, &REST::login_request_finished, this, [this](Response response) {
    //
    // });
}

MainWindow::~MainWindow()
{
    delete m_rest;
}
