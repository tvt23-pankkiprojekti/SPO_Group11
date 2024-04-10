cmake_minimum_required(VERSION 3.14)

project(CardReader LANGUAGES CXX)

set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(QT NAMES Qt6 Qt5 REQUIRED COMPONENTS Core)
find_package(Qt${QT_VERSION_MAJOR} REQUIRED COMPONENTS Core SerialPort)

add_library(CardReader SHARED
  CardReader_global.h
  cardreader.cpp
  cardreader.h
)

include_directories(src)

target_link_libraries(CardReader PRIVATE Qt${QT_VERSION_MAJOR}::Core Qt6::SerialPort)

target_compile_definitions(CardReader PRIVATE CARDREADER_SHARED_LIBRARY)

