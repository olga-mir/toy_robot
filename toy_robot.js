const inquirer = require('inquirer');
const readline = require('readline');
const fs = require('fs');

// File extension to use when running this module with test file
const test_output_extension = 'out_js';

// According to requirement the grid shoudl be specificable, but there is no rule provided
// how to configure it. For easy manual configuration change this two values
const default_max_x = 4;
const default_max_y = 4;

var ToyRobot = (function() {
  // Two sets of handlers for initialized and un-initialized state optimize program execution and simplify handlers code.
  // In this way there is no need to check for state or valid coordinates in every handler, every time it is invoked.
  // Handlers will assume that robot's position is always valid.
  var handlers_normal, handlers_dummy;
  var handlers;
  var max_x = 0;
  var max_y = 0;
  var max_valid_command_length = 0;

  var toy_robot = {
    x: -1,
    y: -1,
    direction_ind : -1 // according to 'directions' array
  }

  // directions order is used for left/right rotation
  // To rotate left fro current item go +1 (mod 4), to rotate right - go -1 (mod 4)
  var directions = ['north','west','south','east'];
  var directions_map = {
    'north': 0,
    'west' : 1,
    'south': 2,
    'east' : 3,
  };

  var debug = 0;
  function log(msg) {
    if (debug) {
      console.log("log: ", toy_robot, msg||'');
    }
  }

  var place_handler = function(params) {
    var re = /^([1-9]\d*|0),([1-9]\d*|0),(north|west|south|east)$/i;
    var match = re.exec(params);
    if (match && match.length == 4) {
      var x = parseInt(match[1]);
      var y = parseInt(match[2]);
      if ( x <= max_x && y <= max_y) {
        toy_robot.x = x;
        toy_robot.y = y;
        toy_robot.direction_ind = directions_map[match[3]];
        handlers = handlers_normal;
      }
    }
    log();
    return true;
  }

  var move_handler = function() {
    var x = toy_robot.x;
    var y = toy_robot.y;
    switch(toy_robot.direction_ind) {
      case 0: // north
        y = Math.min(y+1, max_y);
        break;
      case 1: // west
        x = Math.max(x-1, 0);
        break;
      case 2: // south
        y = Math.max(y-1, 0);
        break;
      case 3: // east
        x = Math.min(x+1, max_x);
        break;
      default:
        console.error("Inconsistent robot state: ", toy_robot);
    }
    toy_robot.x = x;
    toy_robot.y = y;
    log();
    return true;
  }

  var left_handler = function() {
    toy_robot.direction_ind = (toy_robot.direction_ind+1) % 4;
    log();
    return true;
  }

  var right_handler = function() {
    toy_robot.direction_ind = (toy_robot.direction_ind+3) % 4;
    log();
    return true;
  }

  var report_handler = function() {
    console.log("%d,%d,%s", toy_robot.x, toy_robot.y, directions[toy_robot.direction_ind].toUpperCase());

    // note: although requirements don't specifically say that REPORT is the end of the game,
    // for simplicity, it is implemented in this way. This is supported by the examples and
    // the absence of another exit rule.
    return false;
  }

  var dummy_handler = function(){return true};
  handlers_dummy = {
    place:  place_handler,
    move:   dummy_handler,
    left:   dummy_handler,
    right:  dummy_handler,
    report: dummy_handler
  };
  handlers_normal = {
    place:  place_handler,
    move:   move_handler,
    left:   left_handler,
    right:  right_handler,
    report: report_handler
  }
  handlers = handlers_dummy;

  function process_command(cmd) {
    // truncate user input to the max of valid command length to reduce impact of malicious input
    // as well as make further string operations cheaper
    var parsed_cmd = cmd.substring(0, max_valid_command_length).toLowerCase().split(' ');
    var opcode = parsed_cmd[0],
        params = parsed_cmd[1];
    var continue_reading = true;
    if (handlers[opcode]) {
      continue_reading = handlers[opcode](params);
    }
    return continue_reading;
  }

  return {

    init: function(config) {
      if (!config) {
        return;
      }
      max_x = config.x || 0;
      max_y = config.y || 0;
      log("init");
      max_valid_command_length = "report".length + max_x.toString().length + max_y.toString().length + "north".length + 2; // two commas
    },

    run: function() {

      var question = [{
        name: 'cmd',
        message: '>',
        default : ''
      }];

      // Generic engine for reading commands from stdin while is requiered by user
      function read_next_command(answer) {
        var continue_reading = process_command(answer.cmd);
        if (continue_reading) {
          inquirer.prompt(question).then(read_next_command);
        }
      }
      inquirer.prompt(question).then(read_next_command);
    },

    print_state: function() {
      return toy_robot.x+","+toy_robot.y+","+(directions[toy_robot.direction_ind].toUpperCase())+"\n";
    },

    command_handler: process_command
  }
})();


// TODO - ideally this test code should live in another file, but at least test code separated from production code
function run_test(test_file, robot) {
  const rl = readline.createInterface({
    input: fs.createReadStream(test_file)
  });

  var continue_reading = true;
  rl.on('line', function (line) {
    continue_reading = robot.command_handler(line);
    if (!continue_reading) {
      var output = test_file + "." + test_output_extension;
      var result = robot.print_state();
      fs.writeFile(output, result, function (err) {
        if (err) throw err;
      });
    }
  });
}


// By requirement the grid is specificable, but avoding reading the input from user
// in order not to pollute app output in case automated tests are used
ToyRobot.init({x:default_max_x, y:default_max_y});

if (process.argv.length === 3) {
  run_test(process.argv[2], ToyRobot);
} else {
  ToyRobot.run();
}
