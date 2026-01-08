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
        node["label"] = ps.s.label;
        node["x"] = static_cast<int>(ps.x);
        node["y"] = static_cast<int>(ps.y);


        // Each PositionedStation has exactly one district
        if (!ps.s.districts.empty()) {
            node["rectGroup"] = *ps.s.districts.begin();
        } else {
            node["rectGroup"] = "";
        }

        out["sources"].push_back(node);
    }

    // -----------------------------
    // Links
    // -----------------------------
    out["links"] = json::array();

    for (const auto &L : links) {
        string from, to, esi, label, startLabel;
        bool reverse;

        tie(from, to, esi, label, startLabel, reverse) = L;

        json link;
        link["type"] = "straight";
        link["from"] = from;
        link["to"] = to;
        link["esi"] = esi;
        link["label"] = label;
        link["startLabel"] = startLabel;
        link["reverse"] = reverse;

        out["links"].push_back(link);
    }

    return out.dump();
}
