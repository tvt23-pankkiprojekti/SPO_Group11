#include "menu.h"
#include "forms/ui_menu.h"
#include "ui_menu.h"
#include "mainwindow.h"

Menu::Menu(QWidget *parent)
    : QWidget(parent)
    , ui(new Ui::Menu)
{
    ui->setupUi(this);
    m_user_action_timer.setInterval(user_action_timeout);
    m_user_action_timer.setSingleShot(true);
    connect(&m_user_action_timer, &QTimer::timeout, this, &Menu::time_run_out);
    connect(ui->buttonWithdraw, &QPushButton::clicked, this, &Menu::on_buttonWithdraw_clicked);
    connect(ui->buttonShowBalance, &QPushButton::clicked, this, &Menu::on_buttonShowBalance_clicked);
    connect(ui->buttonShowTransactions, &QPushButton::clicked, this, &Menu::on_buttonShowTransactions_clicked);
}

Menu::~Menu()
{
    delete ui;
}

void Menu::on_buttonWithdraw_clicked()
{
    emit withdraw_selected();
    m_user_action_timer.stop();
}

void Menu::on_buttonShowBalance_clicked()
{
    emit showBalance_selected();
    m_user_action_timer.stop();
}

void Menu::on_buttonShowTransactions_clicked()
{
    emit showTransactions_selected();
    m_user_action_timer.stop();
}

void Menu::on_buttonLogout_clicked()
{
    emit logOut();
    m_user_action_timer.stop();
}

void Menu::time_run_out()
{
    emit logOut();
}
