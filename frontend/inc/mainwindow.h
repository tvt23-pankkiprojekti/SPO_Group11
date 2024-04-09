#pragma once

#include <QMainWindow>

#include <REST/rest.h>

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
    Ui::MainWindow *ui;
    REST *m_rest;

    Login* login;
    Menu* menu;
    Transactions* transactions;
    Balance* balance;
    Withdraw* withdraw;
};