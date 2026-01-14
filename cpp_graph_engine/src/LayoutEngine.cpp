#include "../include/LayoutEngine.h"
#include <bits/stdc++.h>

using namespace std;

class StationInstance {
public:
    string station;
    int districtCount;
    pair<double,double> position; //x,y
    vector<StationInstance*> neighbors;
    //Paramereized constructor
    StationInstance(const string &st, int dc)
        : station(st), districtCount(dc), position(0.0,0.0), neighbors() {}
    
};


void fixedLayout(
    const vector<EdgeRecord> &edges,
    const UserInput &userInputs,
    vector<PositionedStation> &outStations,
    vector<LayoutEngine::LinkOut> &outLinks,
    const LayoutOptions &opts
){
    
    StationInstance sourceStationInstance = StationInstance(userInputs.primarySource, 1);
    StationInstance targetStationInstance = StationInstance(userInputs.primaryTarget, 1);
    sourceStationInstance.position = {50.0, 100.0};
    targetStationInstance.position = {600.0, 100.0};
    int uid = 1;
    //sources list for react
    for(auto &e: edges){
        PositionedStation ps;
        if(e.sourceStation == userInputs.primarySource){
            ps.platform = "S: " + e.sourceStation;
            ps.label = e.sourceDistrict;
            ps.x = sourceStationInstance.position.first;
            ps.y = sourceStationInstance.position.second;
            for(auto &dstStation : e.destinationDistrict){
                PositionedStation dstPs;
                int siIndex = 0;
                dstPs.platform = "D: " + e.destinationStation;
                dstPs.label = dstStation;
                dstPs.x = targetStationInstance.position.first;
                dstPs.y = targetStationInstance.position.second;
                targetStationInstance.position.second += 50.0;
                dstPs.reactId = "node" + to_string(uid);
                uid++;
                outStations.push_back(dstPs);
            }
            targetStationInstance.position.second += 25.0;
            sourceStationInstance.position.second = targetStationInstance.position.second;
            ps.reactId = "node" + to_string(uid);
            uid++;
            outStations.push_back(ps);
        }
        else if(e.sourceStation == userInputs.primaryTarget){
            ps.platform = "D: " + e.sourceStation;
            ps.label = e.sourceDistrict;
            ps.x = targetStationInstance.position.first;
            ps.y = targetStationInstance.position.second;
            for(auto &dstStation : e.destinationDistrict){
                PositionedStation dstPs;
                int siIndex = 0;
                dstPs.platform = "S: " + e.destinationStation;
                dstPs.label = dstStation;
                dstPs.x = sourceStationInstance.position.first;
                dstPs.y = sourceStationInstance.position.second;
                sourceStationInstance.position.second += 50.0;
                dstPs.reactId = "node" + to_string(uid);
                uid++;
                outStations.push_back(dstPs);
            }
            sourceStationInstance.position.second += 25.0;
            targetStationInstance.position.second = sourceStationInstance.position.second;
            ps.reactId = "node" + to_string(uid);
            uid++;
            outStations.push_back(ps);
        }
        //sources for react created with final positions
    }

    //links list for react
    uid = 1;
    for(auto &e: edges){
        vector<string> destinationId;
        string sourceId = "";
        int midX = -1;
        bool reverse = (e.sourceStation == userInputs.primarySource) ? false : true;
        //recreate node ids to enter just copying from previous loop
        
        for(auto &dstStation : e.destinationDistrict){
            destinationId.push_back("node" + to_string(uid));
            uid++;
        }
        sourceId = "node" + to_string(uid);
        uid++;

        //recreation ends here

        if(e.destinationDistrict.size() == 1){
            outLinks.push_back({ "straight", sourceId, destinationId, midX, reverse, e.esi, e.label, e.startLabel, e.endLabel });
        }
        else{
            midX = (reverse) ? 450 : 250;
            outLinks.push_back({ "branched", sourceId, destinationId, midX, reverse, e.esi, e.label, e.startLabel, e.endLabel });
        }
    }

}

void LayoutEngine::buildPositions(
    const vector<EdgeRecord> &edges,
    const UserInput &userInputs,
    vector<PositionedStation> &outStations,
    vector<LinkOut> &outLinks,
    const LayoutOptions &opts
) {
    outStations.clear();
    outLinks.clear();

    if(!userInputs.primarySource.empty() && !userInputs.primaryTarget.empty())
        fixedLayout(edges, userInputs, outStations, outLinks, opts);//only if one primary source and target is there
    
}
