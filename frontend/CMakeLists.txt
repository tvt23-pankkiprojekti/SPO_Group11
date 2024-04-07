cmake_minimum_required(VERSION 3.25)

project(pankki LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

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
    src/mainwindow.cpp
)

target_link_libraries(pankki PRIVATE REST Qt6::Core Qt6::Widgets Qt6::Network)
