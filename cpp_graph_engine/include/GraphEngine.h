#pragma once
#include <string>

class GraphEngine {
public:
    // process: takes raw JSON text (array of edges) and returns JSON string
    // with fields: sources (array), destinations (array), links (array)
    std::string process(const std::string &inputJson);
};
