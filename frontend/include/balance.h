#ifndef BALANCE_H
#define BALANCE_H

#include <QWidget>
#include <QTimer>
#include <QJsonObject>
#include <QJsonArray>

class MainWindow;

namespace Ui {
class Balance;
}

class Balance : public QWidget
{
    Q_OBJECT

public:
    explicit Balance(QWidget *pointerLogin, MainWindow *parent = nullptr);
    ~Balance();

signals:
    void logOut();

private:
    Ui::Balance *m_ui;
    QTimer noUserActionTimer, mouseMovementTimer;
    QPoint mousePoint;

    void resetTimers();
};

#endif // BALANCE_H
