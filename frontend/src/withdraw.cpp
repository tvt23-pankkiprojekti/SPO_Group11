#include "withdraw.h"
#include "ui_withdraw.h"
#include "mainwindow.h"

#include <QJsonObject.h>

#include <REST/rest.h>

#define MAKE_AMOUNT(_num)                                                   \
    connect(m_ui->amount_##_num, &QPushButton::clicked, this, [this]() {    \
        set_current_amount(_num);                                           \
    });

#define MAKE_KEYPAD(_num)                                                   \
    connect(m_ui->pad_##_num, &QPushButton::clicked, this, [this]() {       \
        set_current_amount(m_current_amount * 10 + _num);                   \
    });

Withdraw::Withdraw(MainWindow *parent)
    : QWidget(parent)
    , m_ui(new Ui::Withdraw)
{
    m_ui->setupUi(this);

    reset_view();

    /*
     * Request handling
     */
    connect(REST::the(), &REST::prewithdraw_request_finished, this, [=, this](Response response) {
        if (response.code() == Response::Code::OK) {
            auto data = response.data().object();

            auto name = data["firstName"].toString() + " " + data["lastName"].toString();
            m_ui->label_name->setText(name);

            auto balance = data["balance"].toString() + "€";
            m_ui->label_balance->setText(balance);
        
            return;
        }
        parent->show_status(this, "Server error (Code 500)");
    });

    connect(REST::the(), &REST::withdraw_request_finished, this, [=, this](Response response) {
        reset_view();

        if (response.code() == Response::Code::INSUFFICIENT_FUNDS) {
            parent->show_status(this, "Insufficient funds (Code 7)");
        }
        else if (response.code() == Response::Code::OK) {
            auto data = response.data().object();
            auto amount = QString::number(data["amount"].toDouble());

            parent->show_status(this, "Successfully withdrew " + amount + "€");
        }
        else {
            parent->show_status(this, "Server error (Code 500)");
        }

        REST::the()->make_prewithdraw_request(parent->token());
    });

    /*
     * Amount buttons
     */
    MAKE_AMOUNT(10);
    MAKE_AMOUNT(20);
    MAKE_AMOUNT(40);
    MAKE_AMOUNT(60);
    MAKE_AMOUNT(100);

    connect(m_ui->amount_custom, &QPushButton::clicked, this, [this]() {
        if (m_enter_custom_amount) {
            set_keypad(false);
            set_amount_buttons(true);
            m_ui->amount_custom->setText("Custom...");
        }
        else {
            set_keypad(true);
            set_amount_buttons(false);
            m_ui->amount_custom->setText("Back...");
        }

        set_current_amount(0.0);
        m_enter_custom_amount = !m_enter_custom_amount;
    });

    /*
     * Keypad numbers
     */
    MAKE_KEYPAD(0);
    MAKE_KEYPAD(1);
    MAKE_KEYPAD(2);
    MAKE_KEYPAD(3);
    MAKE_KEYPAD(4);
    MAKE_KEYPAD(5);
    MAKE_KEYPAD(6);
    MAKE_KEYPAD(7);
    MAKE_KEYPAD(8);
    MAKE_KEYPAD(9);

    /*
     * Keypad buttons
     */
    connect(m_ui->pad_cancel, &QPushButton::clicked, this, [=, this]() {
        parent->show_menu();
    });
    connect(m_ui->pad_clear, &QPushButton::clicked, this, [this]() {
        set_current_amount(0.0);
    });
    connect(m_ui->pad_ok, &QPushButton::clicked, this, [=, this]() {
        REST::the()->make_withdraw_request(parent->token(), m_current_amount);
    });
}

Withdraw::~Withdraw()
{
    delete m_ui;
}

void Withdraw::reset_view()
{
    m_ui->pad_empty_0->setEnabled(false);
    m_ui->pad_empty_1->setEnabled(false);
    m_ui->pad_empty_2->setEnabled(false);
    
    set_keypad(false);
    set_amount_buttons(true);
    set_current_amount(0.0);

    m_enter_custom_amount = false;
    m_ui->amount_custom->setText("Custom...");
}

void Withdraw::set_keypad(bool enabled)
{
    m_ui->pad_0->setEnabled(enabled);
    m_ui->pad_1->setEnabled(enabled);
    m_ui->pad_2->setEnabled(enabled);
    m_ui->pad_3->setEnabled(enabled);
    m_ui->pad_4->setEnabled(enabled);
    m_ui->pad_5->setEnabled(enabled);
    m_ui->pad_6->setEnabled(enabled);
    m_ui->pad_7->setEnabled(enabled);
    m_ui->pad_8->setEnabled(enabled);
    m_ui->pad_9->setEnabled(enabled);
}

void Withdraw::set_amount_buttons(bool enabled)
{
    m_ui->amount_10->setEnabled(enabled);
    m_ui->amount_20->setEnabled(enabled);
    m_ui->amount_40->setEnabled(enabled);
    m_ui->amount_60->setEnabled(enabled);
    m_ui->amount_100->setEnabled(enabled);
}

void Withdraw::set_current_amount(double amount)
{
    m_ui->label_amount->setText("Amount: " + QString::number(amount) + "€");
    m_ui->pad_ok->setEnabled(static_cast<bool>(amount));
    
    m_current_amount = amount;
}
