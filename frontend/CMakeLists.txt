cmake_minimum_required(VERSION 3.25)

project(pankki LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

set(CMAKE_AUTOUIC_SEARCH_PATHS forms)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

# This sets the directory where the DLLs are placed
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR})

find_package(Qt6 COMPONENTS REQUIRED Core Widgets Network)

include_directories(lib)
add_subdirectory(lib/REST)

add_executable(pankki
    src/main.cpp
    inc/mainwindow.h src/mainwindow.cpp forms/mainwindow.ui
    inc/login.h src/login.cpp forms/login.ui
    inc/withdraw.h src/withdraw.cpp forms/withdraw.ui
    inc/balance.h src/balance.cpp forms/balance.ui
    inc/transactions.h src/transactions.cpp forms/transactions.ui
    inc/menu.h src/menu.cpp forms/menu.ui
)

target_include_directories(pankki PRIVATE inc)
target_link_libraries(pankki PRIVATE REST Qt6::Core Qt6::Widgets Qt6::Network)
