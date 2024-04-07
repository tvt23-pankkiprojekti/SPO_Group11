#pragma once

#include <QMainWindow>

#include <REST/rest.h>

class MainWindow final : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();
    
private:
    REST *m_rest;
};
