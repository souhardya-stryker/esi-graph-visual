#include "../include/LayoutEngine.h"
#include <unordered_map>
#include <unordered_set>
#include <queue>
#include <algorithm>
#include <iostream>

using namespace std;

// helper: get or create logical station
static void add_or_mark_station(
    unordered_map<string, Station> &mapSt,
    const string &name,
    const string &district,
    bool asSource,
    bool asDest
) {
    if (name.empty()) return;

    auto it = mapSt.find(name);
    if (it == mapSt.end()) {
        Station s;
        s.id = name;
        s.label = name;
        if (!district.empty()) s.districts.insert(district);
        s.isSource = asSource;
        s.isDestination = asDest;
        mapSt.emplace(name, s);
    } else {
        if (!district.empty())
            it->second.districts.insert(district);

        it->second.isSource = it->second.isSource || asSource;
        it->second.isDestination = it->second.isDestination || asDest;
    }
}

void LayoutEngine::buildPositions(
    const vector<EdgeRecord> &edges,
    vector<PositionedStation> &outStations,
    vector<LinkOut> &outLinks,
    const LayoutOptions &opts
) {
    outStations.clear();
    outLinks.clear();

    // -----------------------------
    // 1) Build district graph
    // -----------------------------
    unordered_map<string, unordered_set<string>> districtAdj;
    unordered_set<string> allDistricts;
    unordered_map<string, Station> stations;

    for (auto &e : edges) {
        if (!e.sourceDistrict.empty() && !e.destinationDistrict.empty()) {
            districtAdj[e.sourceDistrict].insert(e.destinationDistrict);
            allDistricts.insert(e.sourceDistrict);
            allDistricts.insert(e.destinationDistrict);
        }

        add_or_mark_station(stations, e.sourceStation, e.sourceDistrict, true, false);
        add_or_mark_station(stations, e.destinationStation, e.destinationDistrict, false, true);
    }

    // -----------------------------
    // 2) Compute district columns (topological layering)
    // -----------------------------
    unordered_map<string,int> indeg;
    for (auto &d : allDistricts) indeg[d] = 0;

    for (auto &p : districtAdj)
        for (auto &to : p.second)
            indeg[to]++;

    queue<string> q;
    unordered_map<string,int> column;

    for (auto &p : indeg) {
        if (p.second == 0) {
            q.push(p.first);
            column[p.first] = 0;
        }
    }

    if (q.empty()) {
        for (auto &d : allDistricts) {
            q.push(d);
            column[d] = 0;
        }
    }

    while (!q.empty()) {
        auto u = q.front(); q.pop();
        for (auto &v : districtAdj[u]) {
            int cand = column[u] + 1;
            if (!column.count(v) || column[v] < cand)
                column[v] = cand;
            if (--indeg[v] == 0)
                q.push(v);
        }
    }

    // -----------------------------
    // 3) Group districts by column
    // -----------------------------
    unordered_map<int, vector<string>> colToDistricts;
    int maxCol = 0;

    for (auto &d : allDistricts) {
        int c = column.count(d) ? column[d] : 0;
        colToDistricts[c].push_back(d);
        maxCol = max(maxCol, c);
    }

    for (auto &p : colToDistricts)
        sort(p.second.begin(), p.second.end());

    // -----------------------------
    // 4) Place station INSTANCES
    // -----------------------------
    unordered_map<string, pair<int,int>> instancePosition;   // station@district
    unordered_map<string, string> reactIdForInstance;

    int nextNodeId = 1;

    for (int col = 0; col <= maxCol; ++col) {
        int x = opts.leftMargin + col * opts.columnWidth;
        if (!colToDistricts.count(col)) continue;

        int y = opts.topMargin;

        for (auto &district : colToDistricts[col]) {
            vector<string> instances;

            for (auto &kv : stations) {
                if (kv.second.districts.count(district)) {
                    instances.push_back(kv.first);
                }
            }

            sort(instances.begin(), instances.end());

            for (auto &stationName : instances) {
                string key = stationName + "@" + district;
                instancePosition[key] = {x, y};

                string reactId = "node" + to_string(nextNodeId++);
                reactIdForInstance[key] = reactId;

                y += opts.verticalSpacing;
            }

            y += opts.verticalSpacing;
        }
    }


    // -----------------------------
    // 5) Output PositionedStation (one per instance)
    // -----------------------------
    for (auto &kv : stations) {
        for (auto &district : kv.second.districts) {
            string key = kv.first + "@" + district;
            if (!instancePosition.count(key)) continue;

            PositionedStation ps;
            ps.s = kv.second;
            ps.s.districts.clear();
            ps.s.districts.insert(district);

            ps.x = instancePosition[key].first;
            ps.y = instancePosition[key].second;
            ps.reactId = reactIdForInstance[key];

            outStations.push_back(ps);
        }
    }

    // -----------------------------
    // 6) Build links
    // -----------------------------
    for (auto &e : edges) {
        string fromKey = e.sourceStation + "@" + e.sourceDistrict;
        string toKey   = e.destinationStation + "@" + e.destinationDistrict;

        if (!reactIdForInstance.count(fromKey) ||
            !reactIdForInstance.count(toKey))
            continue;

        int colFrom = column.count(e.sourceDistrict) ? column[e.sourceDistrict] : 0;
        int colTo   = column.count(e.destinationDistrict) ? column[e.destinationDistrict] : 0;

        bool reverse = colTo < colFrom;

        outLinks.push_back({
            reactIdForInstance[fromKey],
            reactIdForInstance[toKey],
            e.esi,
            e.label,
            e.startLabel,
            reverse
        });
    }
}
