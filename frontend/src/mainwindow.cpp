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

    , m_login_widget(new Login( REST::the(), this ))
    , m_balance_widget(new Balance(m_login_widget,this))
    , m_menu_widget( new Menu(this) )
    , m_transactions_widget(new Transactions(this))
    , m_withdraw_widget(new Withdraw(this))
    , m_status_widget(new Status(this))
{
    m_ui->setupUi(this);

    // The order matters here since the QStackedWidget::currentChanged signal
    // emits the index number of the widget it changed to. It needs to stay
    // the same as the StackedWidgetChildren enum in mainwindow.h.
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
        auto current = m_ui->stackedWidget->currentWidget();
        
        if (current == m_withdraw_widget) {
            REST::the()->make_prewithdraw_request(m_token);
        }
        else if (current == m_balance_widget) {
            REST::the()->make_balance_request(m_token);
        }
        else if (current == m_transactions_widget) {
            REST::the()->make_transactions_request(m_token);
        }
    });

    m_login_widget->connectPostConstructorSignals();

    QObject::connect(
        m_login_widget,
        &Login::loggedIn,
        this,
        [this](QString token) {
            #ifdef QT_DEBUG
            qDebug() << token;
            #endif

            m_token = token;
            m_ui->stackedWidget->setCurrentWidget(m_menu_widget);
        }
    );

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

    connect(m_balance_widget, &Balance::logOut, this, [this]{
        m_token.clear();
    });
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
    m_status_widget->m_user_action_timer.start();
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
