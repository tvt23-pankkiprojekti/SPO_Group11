#include "mainwindow.h"

#include <QJsonDocument>
#include <QJsonArray>
#include <QJsonObject>

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
{
    m_rest = new REST();
}

MainWindow::~MainWindow()
{
    delete m_rest;
}
