#pragma once
#include "DataModels.h"
#include <vector>
#include <string>

class JsonParser {
public:
    // Parses JSON text containing an ARRAY of edge objects
    // Each object matches:
    // { source, destination, source_station, destination_station, ... }
    static std::vector<EdgeRecord> parseEdgeArray(const std::string &jsonText);
};
