#pragma once
#include <string>
#include <vector>
#include <unordered_set>

struct EdgeRecord {
    std::string sourceDistrict;
    std::string destinationDistrict;
    std::string sourceStation;
    std::string destinationStation;
    std::string esi;
    std::string label;
    std::string startLabel;
    std::string endLabel;

    bool reverse = false; // future-proof for reverse links
};

struct Station {
    std::string id;           // station name
    std::string label;
    std::unordered_set<std::string> districts; 
    bool isSource = false;
    bool isDestination = false;
};


struct PositionedStation {
    Station s;
    double x;
    double y;
    std::string reactId;       // "SRC1" or "DST1"
};
