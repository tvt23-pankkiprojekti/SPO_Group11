#pragma once

#include <QWidget>

class MainWindow;

namespace Ui {
    class Withdraw;
}

enum class WithdrawMode
{
    Menu,
    Custom,
    Selected
};

class Withdraw : public QWidget
{
    Q_OBJECT

public:
    explicit Withdraw(MainWindow *parent = nullptr);
    ~Withdraw();

private:
    void show_menu();
    void show_custom(double);
    void show_selected(double);
    
    void set_keypad(bool);

    Ui::Withdraw *m_ui;

    WithdrawMode m_mode = WithdrawMode::Menu;
    double m_current_amount = 0.0;
    bool m_enter_custom_amount = false;
};
