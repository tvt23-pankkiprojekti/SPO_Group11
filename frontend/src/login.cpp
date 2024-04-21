#include "login.h"
#include "ui_login.h"

#ifdef QT_DEBUG
#include <QDebug>
#endif

#include "mainwindow.h"
#include <CardReader/cardreader.h>

Login::Login(REST* const restPtr, QWidget *parent)
    : QWidget(parent)
    , ui(new Ui::Login)
    , m_reader(CardReader::getInstance())
    , m_rest(restPtr)
    , m_mainWindow(parent)
{
    ui->setupUi(this);

    mainContainer = qobject_cast<QStackedWidget*>(
        ui->stackedWidget_loginContainer
    );

    // !------- Connect non-dynamic signals -------!
    QObject::connect(
        ui->lineEdit_pin,
        &QLineEdit::textEdited,
        this,
        [this]{
            #ifdef QT_DEBUG
            qDebug() << "Pin input edited -> resetting timer";
            #endif
            // Reset user action timer every time
            // pin input is edited
            userActionTimer.start();
        }
    );

    QObject::connect(
        ui->pushButton_cancelEnterPin,
        &QPushButton::clicked,
        this,
        [this]{
            reset();
        }
    );

    QObject::connect(
        ui->pushButton_cancelSelectAccunt,
        &QPushButton::clicked,
        this,
        [this]{
            reset();
        }
    );

    QObject::connect(
        &userActionTimer,
        &QTimer::timeout,
        this,
        [this]{
            #ifdef QT_DEBUG
            qDebug() << "User action timeout in login";
            #endif

            reset();
        }
    );

    QObject::connect(
        ui->pushButton_debit,
        &QPushButton::clicked,
        this,
        [this]{
            ui->pushButton_debit->setEnabled(false);
            ui->pushButton_credit->setEnabled(false);
            emit loggedIn(m_tokens["debit"].toString());
            reset();
        }
    );

    QObject::connect(
        ui->pushButton_credit,
        &QPushButton::clicked,
        this,
        [this]{
            ui->pushButton_debit->setEnabled(false);
            ui->pushButton_credit->setEnabled(false);
            emit loggedIn(m_tokens["credit"].toString());
            reset();
        }
    );
    // !-------------------------------------------!


    // !----------- Initialize objects ------------!
    auto port = CardReader::findPort();

    if (!port) {
        throw std::runtime_error("Card reader not found.");
    }

    m_reader.open(port);
    userActionTimer.setSingleShot(true);
    userActionTimer.setInterval(USER_ACTION_TIMEOUT);
    // !-------------------------------------------!

    enterInsertCard();
}

Login::~Login()
{
    delete ui;
}

// Some of the signals need to be connected after this widget has been
// added to the stacked widget in the MainWindow and it has taken
// ownership of this (Login)
void Login::connectPostConstructorSignals(void) {
    auto login = [this]{
        #ifdef QT_DEBUG
        qDebug() << "Login clicked with card number: " << m_cardNumber;
        #endif

        // User is in status screen -> don't let them interact
        if (qobject_cast<QStackedWidget*>(parent())->currentWidget() != this) {
            return;
        }

        ui->pushButton_login->setEnabled(false);
        ui->lineEdit_pin->setEnabled(false);

        // User attempts login so we stop the userActionTimer
        userActionTimer.stop();
        const auto pin = ui->lineEdit_pin->text();
        enterLoggingIn(pin);
    };

    QObject::connect(ui->pushButton_login, &QPushButton::clicked, this, login);
    QObject::connect(ui->lineEdit_pin, &QLineEdit::returnPressed, this, login);

    // Used to reset the timer when user closes the status window
    // The signal is sent by the owning QStackedWidget
    QObject::connect(
        qobject_cast<QStackedWidget*>(parent()),
        &QStackedWidget::currentChanged,
        this,
        [this](int currentWidgetIdx){
            if (
                mainContainer->currentWidget() == ui->page_enterPin &&
                currentWidgetIdx == StackedWidgetChildren::LOGIN
            ) {
                #ifdef QT_DEBUG
                qDebug() << "Status exited";
                #endif

                // User came back from status screen -> re-start timer
                userActionTimer.start();
            }
        }
    );
}

void Login::enterInsertCard(void) {
    #ifdef QT_DEBUG
    qDebug() << "enterInsert card: " << m_cardNumber << m_tokens;
    #endif

    mainContainer->setCurrentWidget(ui->page_insertCard);

    QObject::connect(
        &m_reader,
        &CardReader::cardRead,
        this,
        [this](QString cardNumber){
            // Card read -> disconnect this signal
            // until this phase is entered again
            m_reader.disconnect();

            m_cardNumber = cardNumber;
            enterInputPin();
        }
    );
}

void Login::enterInputPin(void) {
    mainContainer->setCurrentWidget(ui->page_enterPin);
    ui->pushButton_login->setEnabled(true);
    ui->lineEdit_pin->setEnabled(true);
    ui->lineEdit_pin->setFocus();
    userActionTimer.start();
}

void Login::enterLoggingIn(const QString pin) {
    // First connect the signal
    QObject::connect(
        m_rest,
        &REST::login_request_finished,
        this,
        [this](Response res){
            #ifdef QT_DEBUG
            qDebug() << "Response code: " << res.code();
            if (res.has_data()) {
                qDebug() << "Response data:\n" << res.data();
            }
            #endif

            // Response received -> disconnect this signal
            // until this phase is entered again
            QObject::disconnect(
                m_rest,
                &REST::login_request_finished,
                nullptr,
                nullptr
            );

            if ( !res.has_data() ) {
                qobject_cast<MainWindow*>(m_mainWindow)->show_status(
                    this, "Login failed", false
                );

                enterInputPin();
                return;
            }

            m_tokens = res.data();
            QString debitToken = m_tokens["debit"].toString();
            QString creditToken = m_tokens["credit"].toString();

            // no credit account found -> open debit account
            if (creditToken.isEmpty()) {
                emit loggedIn(debitToken);
                reset();
            }
            // no debit account found -> open credit account
            else if (debitToken.isEmpty()) {
                emit loggedIn(creditToken);
                reset();
            }
            // both credit and debit accounts found
            else {
                enterSelectAccount();
            }
        }
    );

    // Then make the login request
    m_rest->make_login_request(m_cardNumber, pin);
}

void Login::enterSelectAccount() {
    mainContainer->setCurrentWidget(ui->page_selectAccount);
    userActionTimer.start();
    ui->pushButton_debit->setEnabled(true);
    ui->pushButton_credit->setEnabled(true);
}

void Login::reset(void) {
    userActionTimer.stop();
    ui->lineEdit_pin->clear();
    m_reader.disconnect();
    m_cardNumber.clear();
    m_tokens = QJsonDocument();

    QObject::disconnect(
        m_rest,
        &REST::login_request_finished,
        nullptr,
        nullptr
    );

    enterInsertCard();
}
