# EA Visual

A repository for visualizing graphs: a C++ engine (using OGDF for layout) produces node coordinates and a React frontend renders the graph.
---
## Project Overview

- **Frontend:** React application (`frontend/`) that renders graphs using engine-provided coordinates.
- **C++ Graph Engine:** `cpp_graph_engine/` — computes layouts using **OGDF** (included as a submodule).

---
## Repository Structure

```
EA_visual/
├─ frontend/          # React application
├─ cpp_graph_engine/  # C++ engine + OGDF submodule
│  ├─ CMakeLists.txt
│  ├─ src/
│  └─ ogdf/           # OGDF source (submodule)
├─ .gitignore
└─ README.md
```
---
## Getting Started

### Prerequisites
- MSYS2 with MinGW64 toolchain (for building the C++ engine)
- CMake
- Node.js and npm (for the frontend)
### 1. Clone repository

```bash
git clone --recurse-submodules https://github.com/souhardya-stryker/esi-graph-visual.git
cd EA_visual
```
The `--recurse-submodules` flag ensures OGDF is downloaded as well.

### 2. Build the C++ Graph Engine
Use the MSYS2 MinGW64 terminal for reliable MinGW toolchain behavior.

```bash
cd cpp_graph_engine
mkdir -p build
cd build
cmake .. -G "MinGW Makefiles" -DCMAKE_INSTALL_PREFIX=local_install
mingw32-make -j8
```
If you change `CMakeLists.txt`, re-run `cmake ..` from the `build/` directory before rebuilding.

Run the engine from the `build/` folder:
```bash
./graph_engine.exe
```
The engine can be configured to output JSON with node coordinates for the frontend.

### 3. Run the React Frontend
```bash
cd frontend
npm install
npm start
```
Open `http://localhost:3000` in the browser. The frontend can consume JSON output from the engine via a simple local API.

---
## Design & Architecture

- **Frontend:** Located in `frontend/` (React). Components should expect a JSON payload containing `nodes` and `edges`.
- **Engine:** C++ code in `cpp_graph_engine/src/` using OGDF (`cpp_graph_engine/ogdf/`) to compute coordinates.
- **Integration options:**
	- File-based: engine writes JSON to disk; a small Node.js service reads and serves it to the frontend.
	- Local API: a Node/Express server that runs the engine or reads its output and exposes a REST endpoint.
	- WebSocket: for live updates during interactive sessions.

Suggested JSON format:
```json
{
	"nodes": [
		{"id": "n1", "x": 100, "y": 200, "label": "A"}
	],
	"edges": [
		{"from": "n1", "to": "n2"}
	]
}
```
---
## Development Workflow

- Edit C++ sources in `cpp_graph_engine/src/`; build in MSYS2.
- Edit frontend code in `frontend/`; use `npm start` for hot reload.
- Keep `build/` folders and local installs out of Git; they are in `.gitignore`.

To update OGDF (submodule):
```bash
cd cpp_graph_engine/ogdf
git pull origin master
cd ../..
# then rebuild the engine
```
---
## Contributing

- Use feature branches and open pull requests to `main`.
- Add tests for critical logic; include test/run instructions in this README when applicable.

---
## Notes & Tips

- Ignored folders: `cpp_graph_engine/build/`, `ogdf/build/`, `ogdf/local_install/`.
- Use MSYS2 MinGW64 terminal on Windows for consistent builds.
- Consider adding GitHub Actions for frontend lint/tests and optional C++ build checks.

---
## License & Contact

- **License:** (Add your chosen license, e.g., MIT)
- **Author / Contact:** (Add your name, GitHub handle, or email)

If you want, I can also add badges (build/CI, license) or a short example showing how to run the engine and serve JSON to the frontend.
```markdown
# EA Visual

This repository contains:

- **Frontend**: React application (`frontend/`)  
- **C++ Graph Engine**: `cpp_graph_engine/` using **OGDF** for graph layout computations  

This README explains how to set up the project after cloning, build the C++ engine, and run the frontend.

---
## Repository Structure

``
EA_visual/
├─ frontend/          # React application
├─ cpp_graph_engine/  # C++ engine + OGDF submodule
│  ├─ CMakeLists.txt
│  ├─ src/
│  └─ ogdf/           # OGDF source (submodule)
├─ .gitignore
└─ README.md
``
---

## Getting Started

### 1. Clone the repository

```bash
git clone --recurse-submodules https://github.com/souhardya-stryker/esi-graph-visual.git
cd EA_visual
```

> The `--recurse-submodules` ensures OGDF source is also downloaded.

### 2. Build the C++ Graph Engine

**Requirements:** [MSYS2](https://www.msys2.org/) with MinGW64 toolchain installed.

1. Open **MSYS2 MinGW64 terminal**.
2. Navigate to the C++ engine folder:

```bash
cd /c/Work/EA_visual/cpp_graph_engine
mkdir build
cd build
```

3. Run **CMake** to configure the project:

```bash
cmake .. -G "MinGW Makefiles" -DCMAKE_INSTALL_PREFIX=local_install
```
For rerun changed code change **CMakeLists.txt**

```bash
cmake ..
```

4. Build the engine:

```bash
mingw32-make -j8
```

5. Run the engine:

```bash
./graph_engine.exe
```

> You will see the graph node coordinates printed in the terminal.

---

### 3. Run the React Frontend

1. Open a terminal in the `frontend/` folder:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

> The frontend will run at `http://localhost:3000` and can connect to your local C++ API if implemented.

---

### 4. Notes for Developers

* **Build folders are ignored in git** (`cpp_graph_engine/build/`, `ogdf/build/`, `ogdf/local_install/`).
* **Binary files are ignored** (`*.exe`, `*.obj`, etc.).
* If you update OGDF, run `git submodule update --remote ogdf`.

---

### 5. Optional: Using OGDF Submodule

If you want to update or re-initialize OGDF:

```bash
cd cpp_graph_engine/ogdf
git pull origin master
```

> Then rebuild the C++ engine as shown above.

---

### 6. Recommended Workflow

* Make all C++ changes in `cpp_graph_engine/src/`.
* Build and run in MSYS2 terminal.
* React frontend changes are independent.
* Use MSYS2 terminal for reproducible builds; VS Code tasks can be configured later if desired.

---

### 7. (Optional) Integrating C++ Output with React

* The C++ engine can output **JSON with node coordinates**.
* A simple Node.js API can read this JSON and serve it to the React frontend.
* The frontend can then render the graph dynamically using the coordinates.
