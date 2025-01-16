# Simulation
- [x] Make simulation 3D
- [x] Convert ECEF coordinates to geodetic and store geodetic coordinates to fit the WorldWind position definition
- [x] Save time points so the simulation time can be synchronized with the animation time
- [ ] Reimplement simulation in Rust so that it can be compiled into web assembly and ran directly
  - [ ] Propagator
  - [ ] Gravity
  - [ ] Propulsion

# Launch visualization
- [x] Read points from the Python generated CSV
- [x] Syncronize simulation time with animation time
- [x] Draw launch trajectory based on simulation time

# Console log
- [ ] Basic console log
- [ ] Colored logs