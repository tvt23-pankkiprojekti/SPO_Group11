#include "mainwindow.h"
#include "REST/rest.h"
#include "ui_mainwindow.h"
#include <qcoreapplication.h>
#include <qlogging.h>
#include <QJsonObject>
#include <QJsonArray>

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
    , m_rest(REST::the())

    , login(new Login(m_rest))
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

    QObject::connect(
        login,
        &Login::loggedIn,
        this,
        [this](QString token) {
            #ifdef QT_DEBUG
            qDebug() << token;
            #endif

            m_token = token;
            ui->stackedWidget->setCurrentWidget(menu);
        }
    );

    QObject::connect(menu, &Menu::loggedOut, this, [this] {
        ui->stackedWidget->setCurrentWidget(login);
    });

    // TODO: Implement these

    // REST::the()->make_login_request("1000200030004000", "1111");
    // REST::the()->make_login_request("1000200030004001", "2222");
    // REST::the()->make_login_request("1000200030004002", "3333");
    // REST::the()->make_login_request("1000200030004003", "4444");
    // REST::the()->make_login_request("1000200030004004", "5555");
    
    // connect(..., ..., this, [this]() {
    //     REST::make_login_request(...);
    // });

    // connect(..., ..., this, [this]() {
    //     REST::make_balance_request(...);
    // });

    // connect(..., ..., this, [this]() {
    //     REST::make_prewithdraw_request(...);
    // });

    // connect(..., ..., this, [this]() {
    //     REST::make_withdraw_request(...);
    // });

    // connect(..., ..., this, [this]() {
    //     REST::make_transactions_request(...);
    // });

    // connect(REST::the(), &REST::login_request_finished, this, [this](Response response) {
    //     if (response.has_data()) {
    //         auto data = response.data().object();

    //         m_token = data["debit"].toString();
    //         qDebug() << "token: " << m_token;

    //         REST::the()->make_prewithdraw_request(m_token);
    //     }
    // });

    // connect(REST::the(), &REST::balance_request_finished, this, [this](Response response) {
    //
    // });

    // connect(REST::the(), &REST::prewithdraw_request_finished, this, [this](Response response) {
    //     if (response.has_data()) {
    //         auto data = response.data().object();

    //         qDebug() << "firstName: " << data["firstName"].toString();
    //         qDebug() << "lastName: " << data["lastName"].toString();
    //         qDebug() << "balance: " << data["balance"].toString().toDouble();
        
    //         REST::the()->make_withdraw_request(m_token, 100);
    //     }
    // });

    // connect(REST::the(), &REST::withdraw_request_finished, this, [this](Response response) {
    //     if (response.has_data()) {
    //         auto data = response.data().object();

    //         qDebug() << "amount: " << data["amount"].toDouble();
        
    //         REST::the()->make_transactions_request(m_token);
    //     }
    // });

    // connect(REST::the(), &REST::transactions_request_finished, this, [](Response response) {
    //     if (response.has_data()) {
    //         auto data = response.data().array();

    //         qDebug() << "transactions: ";
    //         for (auto transaction : data) {
    //             auto datetime = transaction.toObject()["dateTime"].toString();
    //             auto change = transaction.toObject()["balanceChange"].toString().toDouble();
    //             qDebug() << "\tdateTime:" << datetime << ", balanceChange:" << change;
    //         }
    //     }
    // });
}

MainWindow::~MainWindow()
{
    REST::end();
}
