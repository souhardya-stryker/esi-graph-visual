#include "../include/GraphEngine.h"
#include <fstream>
#include <iostream>
#include <string>

using namespace std;

int main(int argc, char **argv) {
    string inputFile = "sample_input.json";
    if (argc > 1) inputFile = argv[1];

    ifstream in(inputFile);
    if (!in) {
        cerr << "Cannot open input file: " << inputFile << "\n";
        return 1;
    }
    string content((istreambuf_iterator<char>(in)), istreambuf_iterator<char>());
    in.close();

    GraphEngine engine;
    string out = engine.process(content);
    cout << out << endl;

    return 0;
}
