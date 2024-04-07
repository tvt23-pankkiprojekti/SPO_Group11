#include "mainwindow.h"

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
{
    m_rest = new REST();

    // TODO: Implement these

    // connect(..., ..., this, &REST::make_login_request);
    // connect(..., ..., this, &REST::make_balance_request);
    // connect(..., ..., this, &REST::make_withdraw_request);
    // connect(..., ..., this, &REST::make_transactions_request);

    // connect(m_rest, &REST::login_request_finished, this, [this](Response response) {
    //
    // });

    // connect(m_rest, &REST::balance_request_finished, this, [this](Response response) {
    //
    // });

    // connect(m_rest, &REST::login_request_finished, this, [this](Response response) {
    //
    // });

    // connect(m_rest, &REST::login_request_finished, this, [this](Response response) {
    //
    // });
}

MainWindow::~MainWindow()
{
    delete m_rest;
}
