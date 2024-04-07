# Bank-simul Qt application

## General overview

The user facing application of the Bank-simul project is implemented as a Qt application.
It can be divided into three major components:

- The REST API DLL
- The CardReader DLL
- The main executable

The REST API DLL is responsible for providing an interface to communicate with the server application of the project.
The CardReader DLL is responsible for providing an interface to the card reader that reads the card numbers from RFID enabled bank cards.<br>
Both of these DLLs will be covered in detail in their respective repositories.

### Main executable

The main executable provides the graphical interface for the end user to interact with their bank account through the server application with REST API requests.
The interface is implemented with the [QStackedWidget](https://doc.qt.io/qt-6/qstackedwidget.html) class and five inidividual Qt Designer Form classes for each one of the interfaces:

- [Login](#login-diagram)
- [Main menu](#main-menu-diagram)
- [Withdraw](#withdraw-diagram)
- [Show balance](#show-balance-diagram)
- [Show transactions](#show-transactions-diagram)

#### Login

The login interface enables the user to authenticate themselves with a bank accoutn and pin number combination. On a succesful authentication the application saves a token received from the server which will be used to authenticate any further requests in the session, and then presents the user with the main menu interface.

#### Main menu

The main menu interface acts as the main entry point for the user to interacting with their bank account.

#### Withdraw

#### Show balance

#### Show transactions

## Appendices

### Login diagram

![](doc/img/login.svg)

### Main menu diagram

![](doc/img/main-menu.svg)

### Withdraw diagram

![](doc/img/withdraw.svg)

### Show balance diagram

![](doc/img/show-balance.svg)

### Show transactions diagram

![](doc/img/show-transactions.svg)

