#ifndef BALANCE_H
#define BALANCE_H

#include <QWidget>
#include <QTimer>

class MainWindow;

namespace Ui {
class Balance;
}

class Balance : public QWidget
{
    Q_OBJECT

public:
    explicit Balance(MainWindow *parent = nullptr);
    ~Balance();

private slots:
    void on_btnMenu_clicked();

private:
    Ui::Balance *m_ui;
    QTimer *objectTimer;

    void backToMenu();
    void timerClock();
    void setBalance(const QString &balance);
};

#endif // BALANCE_H
