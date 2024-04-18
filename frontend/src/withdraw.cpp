#include "withdraw.h"
#include "ui_withdraw.h"
#include "mainwindow.h"

#include <QJsonObject.h>

#include <REST/rest.h>

#define MAKE_KEYPAD(_num)                                               \
    connect(m_ui->pad_##_num, &QPushButton::clicked, this, [this]() {   \
        show_custom(_num);                                              \
    })

static const double amounts[] = { 10.0, 20.0, 50.0, 100.0 };

Withdraw::Withdraw(MainWindow *parent)
    : QWidget(parent)
    , m_ui(new Ui::Withdraw)
{
    m_ui->setupUi(this);

    /*
     * Request handling
     */
    connect(REST::the(), &REST::prewithdraw_request_finished, this, [this](Response response) {
        if (response.has_data()) {
            auto data = response.data().object();

            auto name = "Name: " + data["firstName"].toString() + " " + data["lastName"].toString();
            m_ui->label_0->setText(name);

            auto balance = "Balance: " + data["balance"].toString() + "€";
            m_ui->label_1->setText(balance);

            show_menu();
        }
    });

    connect(REST::the(), &REST::withdraw_request_finished, this, [=, this](Response response) {
        show_menu();

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
    connect(m_ui->button_2, &QPushButton::clicked, this, [this]() {
        switch (m_mode) {
            case WithdrawMode::Menu: {
                show_selected(amounts[0]);
                break;
            }
            default: {
                break;
            }
        }
    });
    connect(m_ui->button_3, &QPushButton::clicked, this, [this]() {
        switch (m_mode) {
            case WithdrawMode::Menu: {
                show_selected(amounts[1]);
                break;
            }
            default: {
                break;
            }
        }
    });
    connect(m_ui->button_4, &QPushButton::clicked, this, [this]() {
        switch (m_mode) {
            case WithdrawMode::Menu: {
                show_selected(amounts[2]);
                break;
            }
            default: {
                break;
            }
        }
    });
    connect(m_ui->button_5, &QPushButton::clicked, this, [this]() {
        switch (m_mode) {
            case WithdrawMode::Menu: {
                show_selected(amounts[3]);
                break;
            }
            default: {
                break;
            }
        }
    });
    connect(m_ui->button_6, &QPushButton::clicked, this, [=, this]() {
        switch (m_mode) {
            case WithdrawMode::Menu: {
                parent->show_menu();
                break;
            }
            case WithdrawMode::Selected: {
                show_menu();
                break;
            }
            default: {
                break;
            }
        }
    });
    connect(m_ui->button_7, &QPushButton::clicked, this, [=, this]() {
        switch (m_mode) {
            case WithdrawMode::Menu: {
                show_custom(0);
                break;
            }
            case WithdrawMode::Selected: {
                REST::the()->make_withdraw_request(parent->token(), m_current_amount);
            }
            default: {
                break;
            }
        }
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
    connect(m_ui->pad_cancel, &QPushButton::clicked, this, [this]() {
        show_menu();
    });
    connect(m_ui->pad_clear, &QPushButton::clicked, this, [this]() {
        m_current_amount = 0.0;
        show_custom(0);
    });
    connect(m_ui->pad_ok, &QPushButton::clicked, this, [this]() {
        show_selected(m_current_amount);
    });
}

Withdraw::~Withdraw()
{
    delete m_ui;
}

void Withdraw::show_menu()
{   
    m_current_amount = 0.0;

    set_keypad(false);

    m_ui->label_2->setText(QString::number(amounts[0]) + "€");
    m_ui->label_3->setText(QString::number(amounts[1]) + "€");
    m_ui->label_4->setText(QString::number(amounts[2]) + "€");
    m_ui->label_5->setText(QString::number(amounts[3]) + "€");
    m_ui->label_6->setText("Main menu...");
    m_ui->label_7->setText("Custom...");

    m_ui->button_0->setEnabled(false);
    m_ui->button_1->setEnabled(false);
    m_ui->button_2->setEnabled(true);
    m_ui->button_3->setEnabled(true);
    m_ui->button_4->setEnabled(true);
    m_ui->button_5->setEnabled(true);
    m_ui->button_6->setEnabled(true);
    m_ui->button_7->setEnabled(true);

    m_mode = WithdrawMode::Menu;
}

void Withdraw::show_custom(double amount)
{
    m_current_amount = m_current_amount * 10 + amount;

    set_keypad(true);

    m_ui->label_2->setText("Custom amount:");
    m_ui->label_3->setText(QString::number(m_current_amount) + "€");
    m_ui->label_4->setText("");
    m_ui->label_5->setText("");
    m_ui->label_6->setText("");
    m_ui->label_7->setText("");

    m_ui->button_2->setEnabled(false);
    m_ui->button_3->setEnabled(false);
    m_ui->button_4->setEnabled(false);
    m_ui->button_5->setEnabled(false);
    m_ui->button_6->setEnabled(false);
    m_ui->button_7->setEnabled(false);

    m_mode = WithdrawMode::Custom;
}

void Withdraw::show_selected(double amount)
{
    m_current_amount = amount;

    set_keypad(false);

    m_ui->label_2->setText("Withdraw " + QString::number(amount) + "€?");
    m_ui->label_3->setText("");
    m_ui->label_4->setText("");
    m_ui->label_5->setText("");
    m_ui->label_6->setText("Cancel...");
    m_ui->label_7->setText("Proceed...");

    m_ui->button_2->setEnabled(false);
    m_ui->button_3->setEnabled(false);
    m_ui->button_4->setEnabled(false);
    m_ui->button_5->setEnabled(false);
    m_ui->button_6->setEnabled(true);
    m_ui->button_7->setEnabled(true);

    m_mode = WithdrawMode::Selected;
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

    m_ui->pad_cancel->setEnabled(enabled);
    m_ui->pad_clear->setEnabled(enabled);
    m_ui->pad_ok->setEnabled(enabled);
}
