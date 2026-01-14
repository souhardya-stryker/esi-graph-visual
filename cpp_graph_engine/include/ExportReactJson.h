#pragma once
#include "DataModels.h"
#include <string>
#include <vector>

class ExportReactJSON {
public:
    // Convert positioned stations and links into a JSON string
    // links: tuple(fromReactId,toReactId,esi,label,startLabel,endLabel,reverseFlag)
    using LinkOut = std::tuple<
        std::string,
        std::string,
        std::vector<std::string>,
        int,
        bool,
        std::string,
        std::vector<std::string>,
        std::string,
        std::vector<std::string>
    >;
    static std::string makeJSON(const std::vector<PositionedStation> &stations,
                                const std::vector<LinkOut> &links);
};
