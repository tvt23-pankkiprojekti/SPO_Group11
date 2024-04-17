#ifndef STATUS_H
#define STATUS_H

#include <QWidget>

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

private:
    Ui::Status *m_ui;

    QWidget *m_previous_widget;
};

#endif // STATUS_H
