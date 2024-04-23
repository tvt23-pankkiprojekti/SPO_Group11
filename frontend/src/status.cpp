#include "status.h"
#include "ui_status.h"
#include "mainwindow.h"

Status::Status(MainWindow *parent)
    : QWidget(parent)
    , m_ui(new Ui::Status)
{
    m_ui->setupUi(this);

    m_user_action_timer.setSingleShot(true);
    m_user_action_timer.setInterval(USER_ACTION_TIMEOUT);

    connect(&m_user_action_timer, &QTimer::timeout, this, [this, parent]{
        #ifdef QT_DEBUG
        qDebug() << "User action timeout in status";
        #endif

        if (m_previous_widget) {
            parent->show_widget(m_previous_widget);
        }
        else {
            parent->show_menu();
        }
    });

    /*
     * Buttons
     */
    connect(m_ui->button_previous, &QPushButton::clicked, this, [=, this]() {
        parent->show_widget(m_previous_widget);
        m_user_action_timer.stop();
    });
    connect(m_ui->button_menu, &QPushButton::clicked, this, [=, this]() {
        parent->show_menu();
        m_user_action_timer.stop();
    });
}

Status::~Status()
{
    delete m_ui;
}

void Status::set_status(const QString& status)
{
    m_ui->label_status->setText(status);
}

void Status::set_previous_widget(QWidget *widget)
{
    m_previous_widget = widget;
}

void Status::set_menu_widget(bool visible)
{
    m_ui->button_menu->setVisible(visible);
}
