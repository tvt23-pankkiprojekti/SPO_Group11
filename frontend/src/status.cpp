#include "status.h"
#include "ui_status.h"
#include "mainwindow.h"

Status::Status(MainWindow *parent)
    : QWidget(parent)
    , m_ui(new Ui::Status)
{
    m_ui->setupUi(this);

    /*
     * Buttons
     */
    connect(m_ui->button_previous, &QPushButton::clicked, this, [=, this]() {
        parent->show_widget(m_previous_widget);
    });
    connect(m_ui->button_menu, &QPushButton::clicked, this, [=, this]() {
        parent->show_menu();
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
