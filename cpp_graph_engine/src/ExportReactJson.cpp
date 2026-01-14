#include "../include/ExportReactJSON.h"
#include "../external/nlohmann_json.hpp"
#include <sstream>

using namespace std;
using json = nlohmann::json;

string ExportReactJSON::makeJSON(
    const vector<PositionedStation> &stations,
    const vector<LinkOut> &links
) {
    json out;

    // Only ONE node array now
    out["sources"] = json::array();

    // -----------------------------
    // Nodes
    // -----------------------------
    for (const auto &ps : stations) {
        json node;
        node["id"] = ps.reactId;
        node["label"] = ps.label;
        node["x"] = static_cast<int>(ps.x);
        node["y"] = static_cast<int>(ps.y);
        node["rectGroup"] = ps.platform;

        out["sources"].push_back(node);
    }

    // -----------------------------
    // Links
    // -----------------------------
    out["links"] = json::array();

    for (const auto &L : links) {
        string from, esi, startLabel, type;
        vector<string> to, label, endLabel;
        bool reverse;
        int midX;

        tie(type, from, to, midX, reverse, esi, label, startLabel, endLabel) = L;

        json link;
        link["type"] = type;
        link["from"] = from;
        link["to"] = to;
        link["midX"] = midX;
        link["reverse"] = reverse;
        link["esi"] = esi;
        link["label"] = label;
        link["startLabel"] = startLabel;
        link["endLabel"] = endLabel;

        out["links"].push_back(link);
    }

    return out.dump();
}
