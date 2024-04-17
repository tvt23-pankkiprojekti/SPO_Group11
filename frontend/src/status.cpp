#include "status.h"
#include "ui_status.h"
#include "mainwindow.h"

Status::Status(MainWindow *parent)
    : QWidget(parent)
    , m_ui(new Ui::Status)
{
    m_ui->setupUi(this);

    m_ui->label_6->setText("Go to previous menu");
    m_ui->label_7->setText("Go to main menu");

    /*
     * Buttons
     */
    connect(m_ui->button_6, &QPushButton::clicked, this, [=, this]() {
        parent->show_widget(m_previous_widget);
    });
    connect(m_ui->button_7, &QPushButton::clicked, this, [=, this]() {
        parent->show_menu();
    });
}

Status::~Status()
{
    delete m_ui;
}

void Status::set_status(const QString& status)
{
    m_ui->label_0->setText(status);
}

void Status::set_previous_widget(QWidget *widget)
{
    m_previous_widget = widget;
}
