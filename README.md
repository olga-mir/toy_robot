This was first submitted in 2016.
I have updated some parts of it in 2019 for an experiment

# Toy Robot Simulator
Coding interview exercise

## Description

- The application is a simulation of a toy robot moving on a square tabletop,
  of dimensions 5 units x 5 units.
- There are no other obstructions on the table surface.
- The robot is free to roam around the surface of the table, but must be
  prevented from falling to destruction. Any movement that would result in the
  robot falling from the table must be prevented, however further valid movement
  commands must still be allowed.

# Prerequisites
This app is writen in Javascript for NodeJS. It is assumed that NodeJS is installed on the system. Other than core npm module the only module used is 'inquirer', but there is no need to install it manually.

# Usage
The app can be used in two modes: interactive and test with a test file.

To run in interactive mode goto to project root directory and run:
```
> ./scripts/run.sh
```
In the first time it runs it will take some time and it will not pring anything to console. This is done in case there are automated scripts in use to check this assignment.

This script will install (only once) required npm modules and run the toy_robot.js app in interactive mode.
To run in test mode, you need to have npm dependencies installed (it slipped out in the process), then from project root directory run:

```
> node toy_robot.js <test_filename_with_path>
```

# Testing

When you run app in the test mode, as desribed in previous section, the app will output the result to the console, but it will also create output file
<test_filename_with_path>.out_js in the same directory as the input test file.

To generate input file use:
```
> ./tests/generate_test.sh <test_filename_with_path>
```
Filename can be in any format but it must be provided. This will provide valid test with max 4096 commands, with only single 'report' as the last command.

To produce a test result from the generated file, that will be used to compare with JS app result, run:
```
> ./tests/toy_robot.js <test_filename_with_path>
```
This bash script duplicates main game logic from js and produces output file in the same directory as the input test file with extension ".out_sh"
If diff of out_js and out_sh is empty, good chances that the test passed (or both programms have the same bugs).

# Cleanup
```
> ./scripts/cleanup.sh
```

# Assumptions
* 'report' is the last command in the sequence of commands. It is always terminates the program and (other than killing the app, e.g. with Ctrl-C) there is no way to terminate the game.
* Commands are not case sensitive. 'place 0,0,north' is a valid command and will be processed. This was not strictly specified in the requirement and I decided to allow this behaviour due to personal preferences.
* Other than case sensitivity, everything else is strictly validated, e.g. no extra spaces are allowed. 'PLACE  0,0,NORTH' and 'PLACE 0, 0, NORTH' are both not valid.
* The grid is not specificable through app interface, but is easily configured manually in the code.
