#ifndef CARDREADER_H
#define CARDREADER_H

#include "CardReader_global.h"

#include <QObject>
#include <QSerialPort>
#include <QSerialPortInfo>


class CARDREADER_EXPORT CardReader : public QObject
{
    Q_OBJECT
public:
    using PortInfo = std::optional<QSerialPortInfo>;

    static CardReader& getInstance(void);
    static PortInfo findPort(void);
    void open(PortInfo);

    CardReader operator=(CardReader&) = delete;
    CardReader(CardReader&) = delete;

signals:
    void cardRead(QString);
    void serialPortError(QSerialPort::SerialPortError);

private:
    explicit CardReader(QObject* parent = nullptr);
    QSerialPort port;

};

#endif // CARDREADER_H
