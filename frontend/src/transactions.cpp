#include "transactions.h"
#include "ui_transactions.h"
#include "mainwindow.h"

#include <REST/rest.h>

#define MAKE_LABEL_TEXT(_num)                                                                    \
    if (data.size() > _num) {                                                                    \
        auto object = data[_num].toObject();                                                     \
        auto datetime = object["dateTime"].toString();                                           \
        auto change = object["balanceChange"].toString();                                        \
        if (change.toDouble() > 0) m_ui->label_##_num->setText("+" + change + "€, " + datetime); \
        else m_ui->label_##_num->setText(change + "€, " + datetime);                             \
    } else {                                                                                     \
        m_ui->button_right->setEnabled(false);                                                   \
    }

Transactions::Transactions(MainWindow *parent)
    : QWidget(parent)
    , m_ui(new Ui::Transactions)
    , m_main_window(parent)
{
    m_ui->setupUi(this);
    m_ui->button_left->setEnabled(false);

    /*
     * Request handling
     */
    connect(REST::the(), &REST::transactions_request_finished, this, [=, this](Response response) {
        clear_transactions();

        if (m_timer)
                killTimer(m_timer);
        
        if (response.code() == Response::Code::OK) {
            auto data = response.data().array();

            m_ui->label_page->setText("Page: " + QString::number(m_index + 1));

            MAKE_LABEL_TEXT(0);
            MAKE_LABEL_TEXT(1);
            MAKE_LABEL_TEXT(2);
            MAKE_LABEL_TEXT(3);
            MAKE_LABEL_TEXT(4);

            m_timer = startTimer(10000);
        }
        else if (response.code() == Response::Code::INVALID_TOKEN) {
            parent->show_status(parent->login_widget(), "Session expired (Code 6)", false, "Log back in");
        }
        else {
            parent->show_status(this, "Server error (Code 500)");
        }
    });

    /*
     * Buttons
     */
    connect(m_ui->button_ok, &QPushButton::clicked, this, [=, this]() {
        parent->show_menu();
        m_index = 0;
        killTimer(m_timer);
        m_timer = 0;
    });

    connect(m_ui->button_left, &QPushButton::clicked, this, [=, this]() {
        m_index--;
        REST::the()->make_transactions_request(parent->token(), m_index * 5);
        m_ui->button_right->setEnabled(true);
        killTimer(m_timer);
        m_timer = startTimer(10000);

        if (m_index == 0) {
            m_ui->button_left->setEnabled(false);
        }
    });

    connect(m_ui->button_right, &QPushButton::clicked, this, [=, this]() {
        m_index++;
        REST::the()->make_transactions_request(parent->token(), m_index * 5);
        m_ui->button_left->setEnabled(true);
        killTimer(m_timer);
        m_timer = startTimer(10000);
    });
}

Transactions::~Transactions()
{
    killTimer(m_timer);
    delete m_ui;
}

void Transactions::timerEvent(QTimerEvent *event)
{
    killTimer(m_timer);
    m_timer = 0;
    m_main_window->show_menu();
}

void Transactions::clear_transactions()
{
    static const QString empty = "-";
    m_ui->label_0->setText(empty);
    m_ui->label_1->setText(empty);
    m_ui->label_2->setText(empty);
    m_ui->label_3->setText(empty);
    m_ui->label_4->setText(empty);
}
