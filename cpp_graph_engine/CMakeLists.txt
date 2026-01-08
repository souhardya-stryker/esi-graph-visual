cmake_minimum_required(VERSION 3.10)
project(graph_engine_simple)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(${CMAKE_CURRENT_SOURCE_DIR}/include)
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/external)

add_executable(graph_engine
    src/JsonParser.cpp
    src/LayoutEngine.cpp
    src/ExportReactJSON.cpp
    src/GraphEngine.cpp
    src/main.cpp
)
