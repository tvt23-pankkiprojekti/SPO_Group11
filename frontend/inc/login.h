#ifndef LOGIN_H
#define LOGIN_H

#include <QWidget>
#include <CardReader/cardreader.h>

namespace Ui {
class Login;
}

class Login : public QWidget
{
    Q_OBJECT

public:
    explicit Login(QWidget *parent = nullptr);
    ~Login();

signals:
    void loggedIn(QString);

private:
    Ui::Login *ui;
    CardReader& m_reader;
};

#endif // LOGIN_H
