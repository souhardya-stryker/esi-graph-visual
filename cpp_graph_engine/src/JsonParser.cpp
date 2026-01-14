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

        // Root must be an object
        if (!j.is_object())
            return out;

        // "flow" must exist and be an array
        if (!j.contains("flow") || !j["flow"].is_array())
            return out;

        for (auto &it : j["flow"]) {
            if (!it.is_object()) continue;

            EdgeRecord e;

            if(it.contains("id"))
                e.id = it["id"].get<int>();

            if (it.contains("source"))
                e.sourceStation = it["source"].get<string>();

            if (it.contains("destination"))
                e.destinationStation = it["destination"].get<string>();

            if (it.contains("source_station"))
                e.sourceDistrict = it["source_station"].get<string>();

            if (it.contains("destination_station"))
                e.destinationDistrict = it["destination_station"].get<vector<string>>();

            if (it.contains("esi"))
                e.esi = it["esi"].get<string>();

            if (it.contains("label"))
                e.label = it["label"].get<vector<string>>();

            if (it.contains("startLabel"))
                e.startLabel = it["startLabel"].get<string>();// si value cannot be empty or garbage must be a unique string

            if (it.contains("endLabel"))
                e.endLabel = it["endLabel"].get<vector<string>>();
            
            if (it.contains("startLabelId"))
                e.startLabelId = it["startLabelId"].get<int>();

            if (it.contains("endLabelId"))
                e.endLabelId = it["endLabelId"].get<vector<int>>();

            out.push_back(e);
        }
    }
    catch (const exception &ex) {
        cerr << "JSON parse error: " << ex.what() << "\n";
    }

    return out;
}

UserInput JsonParser::parseUserInputs(const string &jsonText) {
    UserInput out;

    try {
        auto j = json::parse(jsonText);

        // Root must be an object
        if (!j.is_object())
            return out;

        // "input" must exist and be an object
        if (!j.contains("input") || !j["input"].is_object())
            return out;

        if (j["input"].contains("source_system"))
            out.primarySource = j["input"]["source_system"].get<string>();

        if (j["input"].contains("destination_system"))
            out.primaryTarget = j["input"]["destination_system"].get<string>();

    }
    catch (const exception &ex) {
        cerr << "JSON parse error: " << ex.what() << "\n";
    }

    return out;
}