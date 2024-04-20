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
    void connectPostConstructorSignals(void);

signals:
    void loggedIn(QString token);

private:
    static constexpr auto USER_ACTION_TIMEOUT = 10s;
    Ui::Login *ui;
    QWidget* m_mainWindow;
    REST* const m_rest;
    CardReader& m_reader;

    QStackedWidget* mainContainer;
    QTimer userActionTimer;
    QString m_cardNumber;
    QJsonDocument m_tokens;

    void enterInsertCard(void);
    void enterInputPin(void);
    void enterLoggingIn(const QString pin);
    void enterSelectAccount(void);
    void reset(void);
};

#endif // LOGIN_H
