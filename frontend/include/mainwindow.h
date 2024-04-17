#pragma once

#include <QMainWindow>

#include <REST/rest.h>
#include <CardReader/cardreader.h>

#include "login.h"
#include "menu.h"
#include "transactions.h"
#include "balance.h"
#include "withdraw.h"

QT_BEGIN_NAMESPACE
namespace Ui {
class MainWindow;
}
QT_END_NAMESPACE

class MainWindow final : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private:
    Ui::MainWindow *m_ui;
    CardReader& m_reader;

    QString m_token;

    Login* m_login_widget;
    Menu* m_menu_widget;
    Transactions* m_transactions_widget;
    Balance* m_balance_widget;
    Withdraw* m_withdraw_widget;
};
