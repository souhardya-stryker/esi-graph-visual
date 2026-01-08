#pragma once
#include "DataModels.h"

#include <vector>
#include <unordered_map>
#include <string>
#include <tuple>

// Layout options
struct LayoutOptions {
    double leftMargin = 50.0;
    double columnWidth = 320.0;   // distance between columns horizontally
    double topMargin = 100.0;
    double verticalSpacing = 75.0; // spacing between nodes within a district
};

class LayoutEngine {
public:
    // Each link is represented as:
    // (fromReactId, toReactId, esi, label, startLabel, reverseFlag)
    // NOTE: This will be extended later for branched links, midX, endLabels
    using LinkOut = std::tuple<
        std::string,
        std::string,
        std::string,
        std::string,
        std::string,
        bool
    >;

    static void buildPositions(
        const std::vector<EdgeRecord> &edges,
        std::vector<PositionedStation> &outStations,
        std::vector<LinkOut> &outLinks,
        const LayoutOptions &opts = LayoutOptions()
    );
};
