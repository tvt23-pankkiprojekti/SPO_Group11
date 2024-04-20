#ifndef STATUS_H
#define STATUS_H

#include <QWidget>
#include <QTimer>

using namespace std::chrono_literals;

class MainWindow;

namespace Ui {
class Status;
}

class Status : public QWidget
{
    Q_OBJECT

public:
    explicit Status(MainWindow *parent = nullptr);
    ~Status();

    void set_status(const QString&);
    void set_previous_widget(QWidget *);
    void set_menu_widget(bool);

    QTimer m_user_action_timer;
    static constexpr auto USER_ACTION_TIMEOUT = 5s;

private:
    Ui::Status *m_ui;

    QWidget *m_previous_widget;
};

#endif // STATUS_H
