#include "menu.h"
#include "ui_menu.h"

Menu::Menu(QWidget *parent)
    : QWidget(parent)
    , ui(new Ui::Menu)
{
    ui->setupUi(this);

    QObject::connect(ui->logoutButton, &QPushButton::clicked, this, [this]{
        emit loggedOut();
    });

}

Menu::~Menu()
{
    delete ui;
}

void Menu::setUserName(QString userName) {
    ui->label_cardOwner->setText(
        QString("Hello owner of card ") +
        userName +
        " :)"
    );
}
