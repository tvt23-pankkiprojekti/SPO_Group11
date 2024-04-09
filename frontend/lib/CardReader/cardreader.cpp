#include "cardreader.h"

#ifdef QT_DEBUG
#include <QDebug>
#endif

CardReader::CardReader(QObject *parent)
    : QObject(parent)
    , port()
{
    QObject::connect(
        &port,
        &QSerialPort::errorOccurred,
        this,
        [this](QSerialPort::SerialPortError error) {
            emit serialPortError(error);
        }
    );

    // Card reader spits out data in this form: \r\n-[0-9A-Z]{10}\r\n>
    // So we take 10 characters starting from index 3
    QObject::connect(&port, &QSerialPort::readyRead, this, [this]{
        QString result = port.readAll();

        #ifdef QT_DEBUG
        qDebug() << result;
        #endif

        result = result.sliced(3, 10);
        emit cardRead(result);
    });
}

CardReader& CardReader::getInstance(void) {
    static CardReader instance;
    return instance;
}

CardReader::PortInfo CardReader::findPort(void) {
    constexpr int VENDOR_ID = 5562;
    const auto availablePorts = QSerialPortInfo::availablePorts();

    // Search the available ports for a device with a matching vendor ID
    const auto readerPort = std::find_if(
        availablePorts.begin(),
        availablePorts.end(),
        [VENDOR_ID](auto p){ return p.vendorIdentifier() == VENDOR_ID; }
        );

    if (readerPort == availablePorts.end()) {
        return CardReader::PortInfo();
    }

    return CardReader::PortInfo(*readerPort);
}

void CardReader::open(CardReader::PortInfo portInfo) {
    port.setPort(portInfo.value());
    port.open(QSerialPort::ReadWrite);
}
