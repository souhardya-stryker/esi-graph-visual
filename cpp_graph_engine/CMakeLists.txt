cmake_minimum_required(VERSION 3.16)
project(graph_engine)

set(CMAKE_CXX_STANDARD 17)

# Path where OGDF was installed
set(OGDF_ROOT "${CMAKE_SOURCE_DIR}/ogdf/local_install")

# Include & Lib paths
include_directories(${OGDF_ROOT}/include)
include_directories(${OGDF_ROOT}/include/ogdf-release)   # Sometimes needed

link_directories(${OGDF_ROOT}/lib)

add_executable(graph_engine
    src/main.cpp
)

target_link_libraries(graph_engine
    ogdf
    COIN  # remove if your build has no COIN libs
)
