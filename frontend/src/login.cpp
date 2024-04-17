#include "login.h"
#include "ui_login.h"

#include <REST/rest.h>

#ifdef QT_DEBUG
#include <QDebug>
#endif

Login::Login(REST* const restPtr, QWidget *parent)
    : QWidget(parent)
    , ui(new Ui::Login)
    , m_reader(CardReader::getInstance())
    , m_rest(restPtr)
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
            qDebug() << "User action timeout";
            #endif

            reset();
        }
    );
    // !------------------------------------------!

    // !----------- Initialize objects -----------!
    auto port = CardReader::findPort();

    if (!port) {
        qDebug() << "Card reader not found";
        // TODO: what should we do in this case?
        return;
    }

    m_reader.open(port);
    userActionTimer.setSingleShot(true);
    userActionTimer.setInterval(PIN_TIMEOUT);
    // !------------------------------------------!

    enterInsertCard();
}

Login::~Login()
{
    delete ui;
}

void Login::enterInsertCard(void) {
    mainContainer->setCurrentWidget(ui->page_insertCard);

    QObject::connect(
        &m_reader,
        &CardReader::cardRead,
        this,
        [this](QString cardN){
            // Card read -> disconnect this signal
            // until this phase is entered again
            m_reader.disconnect();

            enterInputPin(cardN);
        }
    );
}

void Login::enterInputPin(QString cardNumber) {
    mainContainer->setCurrentWidget(ui->page_enterPin);
    ui->pushButton_login->setDisabled(false);
    userActionTimer.start();

    QObject::connect(
        ui->pushButton_login,
        &QPushButton::clicked,
        this,
        [this, cardNumber]{
            // User attempts login -> disconnect this signal
            // until this phase is entered again
            ui->pushButton_login->disconnect();
            ui->pushButton_login->setDisabled(true);

            userActionTimer.stop();
            const auto pin = ui->lineEdit_pin->text();
            enterLoggingIn(cardNumber, pin);
        }
    );
}

void Login::enterLoggingIn(QString cardN, QString pin) {
    // First connect the signal
    QObject::connect(
        m_rest,
        &REST::login_request_finished,
        this,
        [this, cardN](Response res){
            // Response received -> disconnect this signal
            // until this phase is entered again
            m_rest->disconnect();

            #ifdef QT_DEBUG
            qDebug() << res.code();
            #endif

            if ( !res.has_data() ) {
                #ifdef QT_DEBUG
                qDebug() << "No data in response";
                #endif

                // TODO: handle error
                enterInputPin(cardN);
                return;
            }

            auto data = res.data();
            QJsonValue debit = data["debit"];
            QJsonValue credit = data["credit"];

            // no credit account found -> open debit account
            if (credit.isUndefined()) {
                emit loggedIn( debit.toString() );
                reset();
            }
            // no debit account found -> open credit account
            else if (debit.isUndefined()) {
                emit loggedIn( credit.toString() );
                reset();
            }
            // both credit and debit accounts found
            else {
                auto debitToken = debit.toString();
                auto creditToken = credit.toString();
                enterSelectAccount(debitToken, creditToken);
            }
        }
    );

    m_rest->make_login_request(cardN, pin);
}

void Login::enterSelectAccount(QString debitToken, QString creditToken) {
    mainContainer->setCurrentWidget(ui->page_selectAccount);

    QObject::connect(
        ui->pushButton_debit,
        &QPushButton::clicked,
        this,
        [this, debitToken]{
            // Account selected -> disconnect both
            // button signals until this phase is entered again
            ui->pushButton_debit->disconnect();
            ui->pushButton_credit->disconnect();
            emit loggedIn(debitToken);
            reset();
        }
    );

    QObject::connect(
        ui->pushButton_credit,
        &QPushButton::clicked,
        this,
        [this, creditToken]{
            // Account selected -> disconnect both
            // button signals until this phase is entered again
            ui->pushButton_debit->disconnect();
            ui->pushButton_credit->disconnect();
            emit loggedIn(creditToken);
            reset();
        }
    );

    userActionTimer.start();
}

void Login::reset(void) {
    userActionTimer.stop();
    ui->lineEdit_pin->clear();
    m_reader.disconnect();
    m_rest->disconnect();
    enterInsertCard();
}
