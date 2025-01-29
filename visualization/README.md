# Rocket Launch Trajectory Visualization with NASA WorldWind

## Description
A 3D visualization tool to display rocket launch trajectories using [NASA WorldWind](https://github.com/NASAWorldWind/WebWorldWind). This project enables users to simulate and explore launch paths on a high-fidelity 3D Earth model.

## Features
- Real-time 3D visualization of rocket trajectories.
- Interactive controls for camera navigation.
- Support for loading trajectory data from a `.csv` file in the format:
  ```
  timestamp,latitude,longitude,altitude
  ```

## Prerequisites
1. **Python**: Ensure Python 3.x is installed on your system. Download from [python.org](https://www.python.org/). Depending on how you install Python - if you are working on Windows, you might need to first [add the path to the Python executable](https://www.geeksforgeeks.org/how-to-add-python-to-windows-path/).

## Installation
1. [Clone the repository](https://www.wikihow.com/Clone-a-Repository-on-Github):
   ```bash
   git clone https://github.com/herince/rocket-launches.git
   ```

2. Prepare your trajectory data:
   - Open the folder `rocket-launches/visualization`.
   - Create a `.csv` file with trajectory points in the format:
     ```
     timestamp,latitude,longitude,altitude
     ```
   - Save the input CSV file as `input/rocket-path-geodetic.csv` 

3. Host the Webpage on Windows:
   
    To view the visualization and load the trajectory `.csv` file, you need to host the project locally using Python's simple HTTP server. To do that - open a terminal where you have Python 3 accessible and run:

    ```
    py -m http.server
    ```

    The server listens to port 8000. To use a different port, provide an extra argument to the command

    ```
    py -m http.server 8080
    ```

4. Open your browser and navigate to [http://localhost:8000](http://localhost:8000)

## Project Structure

```
├── css/                    # CSS files to style the page
├── input/                  # Configuration files (e.g., rocket-path-geodetic.csv)
└── js/                     # JavaScript source code for
    ├── main.js              # The file that creates the WorldWind window and defines the visualization update function
    └── file-handling.js     # Functions that handle loading and parsing config files
├── README.md               # Project documentation
└── index.html              # The main HTML for the visualization
```

## License

The project is licensed under the [GNU General Public License v2.0](https://github.com/herince/rocket-launches/blob/main/LICENSE).
