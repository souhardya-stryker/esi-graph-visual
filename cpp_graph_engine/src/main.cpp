#include <ogdf/basic/Graph.h>
#include <ogdf/basic/graph_generators.h>
#include <ogdf/layered/SugiyamaLayout.h>
#include <ogdf/layered/LongestPathRanking.h>
#include <ogdf/layered/OptimalRanking.h>
#include <ogdf/layered/MedianHeuristic.h>
#include <ogdf/layered/SplitHeuristic.h>
#include <ogdf/basic/GraphAttributes.h>

#include <iostream>
#include <sstream>

using namespace ogdf;

int main() {
    Graph G;

    // Nodes
    node a = G.newNode();
    node b = G.newNode();
    node c = G.newNode();
    node d = G.newNode();

    // Edges
    G.newEdge(a, b);
    G.newEdge(a, c);
    G.newEdge(b, d);
    G.newEdge(c, d);

    // Sugiyama Layout
    GraphAttributes GA(G,
        GraphAttributes::nodeGraphics | GraphAttributes::edgeGraphics |
        GraphAttributes::nodeLabel | GraphAttributes::edgeStyle
    );

    SugiyamaLayout SL;
    SL.call(GA);

    // JSON output
    std::stringstream json;
    json << "{\n  \"nodes\": [\n";

    bool first = true;
    for (node v : G.nodes) {
        if (!first) json << ",\n";
        first = false;
        json << "    { \"id\": \"" << v->index()
             << "\", \"x\": " << GA.x(v)
             << ", \"y\": " << GA.y(v) << " }";
    }

    json << "\n  ],\n  \"edges\": [\n";

    first = true;
    for (edge e : G.edges) {
        if (!first) json << ",\n";
        first = false;

        json << "    [ \"" << e->source()->index()
             << "\", \"" << e->target()->index() << "\" ]";
    }

    json << "\n  ]\n}";

    std::cout << json.str();
    return 0;
}
