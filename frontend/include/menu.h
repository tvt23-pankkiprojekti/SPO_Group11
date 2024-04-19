#ifndef MENU_H
#define MENU_H

#include <QWidget>
#include <QTimer>

using namespace std::chrono_literals;

namespace Ui {
class Menu;
}

class Menu : public QWidget
{
    Q_OBJECT

public:
    explicit Menu(QWidget *parent = nullptr);
    ~Menu();

    static constexpr auto user_action_timeout = 30s;
    QTimer m_user_action_timer;

signals:
    void withdraw_selected();
    void showBalance_selected();
    void showTransactions_selected();
    void logOut();

private:
    Ui::Menu *ui;

    void on_buttonWithdraw_clicked();
    void on_buttonShowBalance_clicked();
    void on_buttonShowTransactions_clicked();
    void on_buttonLogout_clicked();
    void time_run_out();
};

#endif // MENU_H
