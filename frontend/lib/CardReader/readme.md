# CardReader

## Overview

This library provides an interface to communicate with an Olimex MOD-RFID125 RFID reader using the QSerialPort library. The interface provides the following signals and methods to the user:

- [getInstance](#getinstance)
- [findPort](#findport)
- [open](#open)
- [cardRead](#cardread)
- [serialPortError](#serialporterror)

## Type aliases

```cpp
using PortInfo = std::optional<QSerialPortInfo>;
```

## Methods

### getInstance

```cpp
static CardReader& getInstance(void);
```

The CardReader class follows the singleton pattern. This method returns a reference to the statically declared instance of the CardReader.

### findPort

```cpp
static PortInfo findPort(void);
```

Goes through the system's serial ports and looks for a device with the correct vendor id. If no such device is found the method returns a default initialized PortInfo, which is an "empty" value that is contextually converted to the boolean value false.<br>
**The user is responsible for checking the PortInfo for a presence of a value if it is to be used.**

### open

```cpp
void open(PortInfo);
```

Opens the serial port provided by the PortInfo argument for communication. Intended to be used with the port information that is returned from `findPort`.

## Signals

### cardRead

```cpp
void cardRead(QString)
```

This signal is emitted when the card reader has read a card. The argument is the number of the card the card reader read.

### serialPortError

```cpp
void serialPortError(QSerialPort::SerialPortError)
```

This signal is emitted when the underlying QSerialPort object emits an error.
