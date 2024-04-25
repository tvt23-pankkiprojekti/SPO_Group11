#pragma once

#include <QWidget>

class MainWindow;

namespace Ui {
    class Transactions;
}

class Transactions : public QWidget
{
    Q_OBJECT

public:
    explicit Transactions(MainWindow *parent = nullptr);
    ~Transactions();

private:
    void timerEvent(QTimerEvent *event) override;
    void clear_transactions();

    Ui::Transactions *m_ui;
    MainWindow *m_main_window;
    int m_index = 0;
    int m_timer = 0;
};
