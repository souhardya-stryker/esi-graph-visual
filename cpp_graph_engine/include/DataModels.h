#pragma once
#include <string>
#include <vector>
#include <unordered_set>

struct EdgeRecord {
    int id;
    std::string sourceDistrict;
    std::vector<std::string> destinationDistrict;
    std::string sourceStation;
    std::string destinationStation;
    std::string esi;
    std::vector<std::string> label;
    std::string startLabel;
    std::vector<std::string> endLabel;
    int startLabelId;
    std::vector<int> endLabelId;

    bool reverse; // future-proof for reverse links
};

//update the user input accordingly
struct UserInput {
    std::string primarySource;
    std::string primaryTarget;
};

struct Station {
    std::string id;           // station name
    std::string label;
    std::unordered_set<std::string> districts; 
    bool isSource = false;
    bool isDestination = false;
};


struct PositionedStation {
    std::string platform;
    std::string label;
    double x;
    double y;
    std::string reactId;       // "SRC1" or "DST1"
};
