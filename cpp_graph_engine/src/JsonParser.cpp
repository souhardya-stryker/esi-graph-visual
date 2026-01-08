#include "JsonParser.h"
#include "nlohmann_json.hpp"

#include <iostream>
#include <vector>
#include <string>

using namespace std;
using json = nlohmann::json;

vector<EdgeRecord> JsonParser::parseEdgeArray(const string &jsonText) {
    vector<EdgeRecord> out;

    try {
        auto j = json::parse(jsonText);

        // Expecting an array of edge objects
        if (!j.is_array()) return out;

        for (auto &it : j) {
            if (!it.is_object()) continue;

            EdgeRecord e;

            if (it.contains("source"))
                e.sourceDistrict = it["source"].get<string>();

            if (it.contains("destination"))
                e.destinationDistrict = it["destination"].get<string>();

            if (it.contains("source_station"))
                e.sourceStation = it["source_station"].get<string>();

            if (it.contains("destination_station"))
                e.destinationStation = it["destination_station"].get<string>();

            if (it.contains("esi"))
                e.esi = it["esi"].get<string>();

            if (it.contains("label"))
                e.label = it["label"].get<string>();

            if (it.contains("startLabel"))
                e.startLabel = it["startLabel"].get<string>();

            if (it.contains("endLabel"))
                e.endLabel = it["endLabel"].get<string>();

            out.push_back(e);
        }
    }
    catch (const exception &ex) {
        cerr << "JSON parse error: " << ex.what() << "\n";
    }

    return out;
}
