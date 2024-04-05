cmake_minimum_required(VERSION 3.25)

project(REST LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

find_package(Qt6 COMPONENTS REQUIRED Core Network)

add_library(REST SHARED
    rest.cpp
)

target_link_libraries(REST PRIVATE Qt6::Core Qt6::Network)
