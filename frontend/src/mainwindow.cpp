#include "mainwindow.h"
#include "REST/rest.h"
#include "ui_mainwindow.h"
#include <qcoreapplication.h>
#include <qlogging.h>
#include <QJsonObject>
#include <QJsonArray>

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , m_ui(new Ui::MainWindow)
    , m_reader(CardReader::getInstance())

    , m_login_widget(new Login)
    , m_menu_widget(new Menu)
    , m_balance_widget(new Balance(this))
    , m_menu_widget( new Menu(this) )
    , m_balance_widget(new Balance)
    , m_transactions_widget(new Transactions)
    , m_withdraw_widget(new Withdraw(this))
    , m_status_widget(new Status(this))
{
    m_ui->setupUi(this);

    for (auto widget: std::initializer_list<QWidget*>{
        m_login_widget,
        m_menu_widget,
        m_balance_widget,
        m_transactions_widget,
        m_withdraw_widget,
        m_status_widget
    }) {
        m_ui->stackedWidget->addWidget(widget);
    }

    /*
     * Stuff that needs to be run when the current widget is changed
     */
    connect(m_ui->stackedWidget, &QStackedWidget::currentChanged, this, [this]() {
        if (m_ui->stackedWidget->currentWidget() == m_withdraw_widget) {
            REST::the()->make_prewithdraw_request(m_token);
        }
    });

    // m_ui->stackedWidget->setCurrentWidget(m_withdraw_widget);
    // show_status(m_withdraw_widget, ":D", false);

    connect(m_menu_widget, &Menu::withdraw_selected, this, [this]{
        show_widget(m_withdraw_widget);
    });

    connect(m_menu_widget, &Menu::showBalance_selected, this, [this]{
        show_widget(m_balance_widget);
    });

    connect(m_menu_widget, &Menu::showTransactions_selected, this, [this]{
        show_widget(m_transactions_widget);
    });

    connect(m_menu_widget, &Menu::logOut, this, [this]{
        m_token.clear();
        show_widget(m_login_widget);
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

void MainWindow::show_status(QWidget * widget, const QString& status, bool visible)
{
    m_ui->stackedWidget->setCurrentWidget(m_status_widget);
    m_status_widget->set_previous_widget(widget);
    m_status_widget->set_status(status);
    m_status_widget->set_menu_widget(visible);
}

void MainWindow::show_menu()
{
    m_ui->stackedWidget->setCurrentWidget(m_menu_widget);
    m_menu_widget->m_user_action_timer.start();
}

void MainWindow::show_widget(QWidget *widget)
{
    m_ui->stackedWidget->setCurrentWidget(widget);
}
