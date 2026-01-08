#include "../include/GraphEngine.h"
#include "../include/JsonParser.h"
#include "../include/LayoutEngine.h"
#include "../include/ExportReactJSON.h"

#include <string>
#include <vector>
using namespace std;

string GraphEngine::process(const std::string &inputJson) {
    // 1) parse input array of edges
    std::vector<EdgeRecord> edges = JsonParser::parseEdgeArray(inputJson);

    // 2) layout and position stations
    std::vector<PositionedStation> positioned;
    std::vector<LayoutEngine::LinkOut> links;
    LayoutEngine::buildPositions(edges, positioned, links);

    // 3) export JSON string for react
    return ExportReactJSON::makeJSON(positioned, links);
}
