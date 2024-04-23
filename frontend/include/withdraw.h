#ifndef WITHDRAW_H
#define WITHDRAW_H

#include <QWidget>

class MainWindow;

namespace Ui {
class Withdraw;
}

class Withdraw : public QWidget
{
    Q_OBJECT

public:
    explicit Withdraw(MainWindow *parent = nullptr);
    ~Withdraw();

private:
    void reset_view();
    void set_keypad(bool);
    void set_amount_buttons(bool);
    void set_current_amount(double);
    void reset_timer();

    Ui::Withdraw *m_ui;
    MainWindow *m_main_window;
    double m_current_amount = 0.0;
    bool m_enter_custom_amount = false;
    int m_timer;
};

#endif // WITHDRAW_H
