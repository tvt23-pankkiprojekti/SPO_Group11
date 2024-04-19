#ifndef BALANCE_H
#define BALANCE_H

#include <QWidget>
#include <QTimer>
#include <REST/rest.h>
//#include <QRestAccessManager>


namespace Ui {
class Balance;
}

class Balance : public QWidget
{
    Q_OBJECT

public:
    explicit Balance(QWidget *parent = nullptr);
    ~Balance();

private slots:
    void on_btnMenu_clicked();

private:
    Ui::Balance *ui;

    void setBalance(const QString &balance);
};

#endif // BALANCE_H
