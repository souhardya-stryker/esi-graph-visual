```markdown
# EA Visual

This repository contains:

- **Frontend**: React application (`frontend/`)  
- **C++ Graph Engine**: `cpp_graph_engine/` using **OGDF** for graph layout computations  

This README explains how to set up the project after cloning, build the C++ engine, and run the frontend.

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

### 1. Clone the repository

```bash
git clone --recurse-submodules https://github.com/souhardya-stryker/esi-graph-visual.git
cd EA_visual
````

> The `--recurse-submodules` ensures OGDF source is also downloaded.

---

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
