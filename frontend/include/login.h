#ifndef LOGIN_H
#define LOGIN_H

#include <QWidget>
#include <QStackedWidget>
#include <QTimer>
#include <CardReader/cardreader.h>
#include <REST/rest.h>

using namespace std::chrono_literals;

namespace Ui {
class Login;
}

class Login : public QWidget
{
    Q_OBJECT

public:
    explicit Login(REST* const restPtr, QWidget *parent = nullptr);
    ~Login();

signals:
    void loggedIn(QString token);

private:
    static constexpr auto PIN_TIMEOUT = 10s;
    Ui::Login *ui;
    REST* const m_rest;
    CardReader& m_reader;

    QStackedWidget* mainContainer;
    QTimer userActionTimer;

    void enterInsertCard(void);
    void enterInputPin(QString cardNumber);
    void enterLoggingIn(QString cardN, QString pin);
    void enterSelectAccount(QString debitToken, QString creditToken);
    void reset(void);
};

#endif // LOGIN_H
